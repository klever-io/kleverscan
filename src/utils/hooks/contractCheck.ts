import { useExtension } from '@/contexts/extension';
import {
  fetchWalletChecks,
  submitCheck,
} from '@/services/requests/contractValidator';
import api from '@/services/api';
import { ValidationJob } from '@/types/smart-contract';
import { readBuildVersionsFromZip } from '@/utils/contractValidator/abiVersions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { broadcastTXandCheckStatus } from '@/utils/transaction';
import { Transaction } from '@klever/connect';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ValidationSettings {
  receiver_address: string;
  transfer_value: number;
  asset_id: string;
}

const ADDRESS_RE = /^klv1[0-9a-z]{58}$/;

/**
 * useContractCheck drives the paid, public "does my source match this contract"
 * tool: the user pays the configured KLV fee, the wallet signs and broadcasts
 * the transfer, then the confirmed payment hash + the uploaded zip are sent to
 * the validator. The async verdict is NOT awaited here — the validation history
 * (which polls while any check is running) is the single source of truth for
 * status and results.
 */
export function useContractCheck() {
  const { wallet, walletAddress, connectExtension, extensionInstalled } =
    useExtension();

  const [contractAddress, setContractAddress] = useState('');
  const [kscVersion, setKscVersion] = useState('');
  const [rustVersion, setRustVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [feeKlv, setFeeKlv] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  // Fetch the validation fee up front so the button can display it.
  useEffect(() => {
    fetch('/api/contract-validator/settings')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then((data: { validation?: ValidationSettings }) => {
        const value = data?.validation?.transfer_value;
        if (value != null) setFeeKlv(value / 10 ** KLV_PRECISION);
      })
      .catch(() => {});
  }, []);

  // Wallet's check history (survives reloads, and resumes polling any ongoing
  // checks). Polls every 5s while a check is pending/running, then stops.
  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ['walletChecks', walletAddress],
    queryFn: () => fetchWalletChecks(walletAddress),
    enabled: !!walletAddress,
    refetchInterval: q => {
      const jobs = (q.state.data ?? []) as ValidationJob[];
      return jobs.some(j => j.status === 'pending' || j.status === 'running')
        ? 5000
        : false;
    },
  });

  const isAddressValid = ADDRESS_RE.test(contractAddress.trim());

  // Resolve the contract's owner (deployer) once the address is valid, so the UI
  // can warn an owner that they can validate for free on the contract page.
  const { data: ownerAddress } = useQuery({
    queryKey: ['scOwner', contractAddress.trim()],
    enabled: isAddressValid,
    staleTime: 60_000,
    queryFn: async () => {
      const res = await api.get({ route: `sc/${contractAddress.trim()}` });
      return (res?.data?.sc?.deployer as string) ?? null;
    },
  });

  const isOwner =
    !!walletAddress && !!ownerAddress && walletAddress === ownerAddress;

  // On file select, read the compiler versions from the zip's output/*.abi.json
  // and auto-fill them (best-effort). `parsing` lets the UI show a loader and
  // reveal the version inputs only once parsing finishes.
  const onFileSelected = async (selected: File | null): Promise<void> => {
    setFile(selected);
    setKscVersion('');
    setRustVersion('');
    if (!selected) return;
    setParsing(true);
    try {
      const versions = await readBuildVersionsFromZip(selected);
      if (versions?.kscVersion) setKscVersion(versions.kscVersion);
      if (versions?.rustVersion) setRustVersion(versions.rustVersion);
    } finally {
      setParsing(false);
    }
  };

  const handleCheck = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const address = contractAddress.trim();
    if (!ADDRESS_RE.test(address)) {
      toast.error('Enter a valid contract address (klv1…)');
      return;
    }
    if (!kscVersion.trim()) {
      toast.error('KSC version is required');
      return;
    }
    if (!rustVersion.trim()) {
      toast.error('Rust version is required');
      return;
    }
    if (!file) {
      toast.error('Select the project .zip to check');
      return;
    }
    if (!wallet) {
      toast.error('Wallet not connected. Please connect your wallet.');
      return;
    }

    setSubmitting(true);

    // Load payment settings (receiver + amount in on-chain precision).
    let settings: ValidationSettings;
    try {
      setStatusText('Loading payment settings…');
      const res = await fetch('/api/contract-validator/settings');
      if (!res.ok) throw new Error();
      const data = await res.json();
      settings = data?.validation;
      if (!settings?.receiver_address || settings.transfer_value == null) {
        throw new Error();
      }
    } catch {
      toast.error('Failed to load payment settings');
      setSubmitting(false);
      setStatusText(null);
      return;
    }

    // Build + sign the KLV payment.
    let signedTransaction: unknown;
    try {
      setStatusText('Waiting for wallet signature…');
      const unsignedTx = await wallet.buildTransaction([
        {
          receiver: settings.receiver_address,
          amount: settings.transfer_value,
          contractType: 0,
        },
      ]);
      signedTransaction = await wallet.signTransaction(
        Transaction.fromTransaction(unsignedTx),
      );
    } catch {
      toast.error('Wallet signing was rejected or failed');
      setSubmitting(false);
      setStatusText(null);
      return;
    }

    // Broadcast and wait for on-chain confirmation before hitting the validator,
    // so the payment is visible when the validator verifies it.
    let paymentTxHash: string;
    try {
      setStatusText('Broadcasting payment…');
      const {
        error: txError,
        status,
        hash,
      } = await broadcastTXandCheckStatus(
        signedTransaction as Parameters<typeof broadcastTXandCheckStatus>[0],
      );
      if (txError || status !== 'success' || !hash) {
        throw new Error('Payment transaction failed');
      }
      paymentTxHash = hash;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Payment transaction failed';
      toast.error(message);
      setSubmitting(false);
      setStatusText(null);
      return;
    }

    // Submit the upload, then hand off to the history. We do NOT wait for the
    // compile/verdict here: the new job shows up as "Running" in the history
    // below, which polls the server until it completes.
    try {
      setStatusText('Uploading project…');
      await submitCheck(
        address,
        file,
        kscVersion.trim(),
        rustVersion.trim(),
        paymentTxHash,
      );
      toast.success(
        'Validation started — track its progress in the history below.',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
      setStatusText(null);
      refetchHistory(); // surface the new (running) check immediately
    }
  };

  return {
    contractAddress,
    setContractAddress,
    kscVersion,
    setKscVersion,
    rustVersion,
    setRustVersion,
    file,
    onFileSelected,
    feeKlv,
    submitting,
    statusText,
    parsing,
    isAddressValid,
    isOwner,
    handleCheck,
    walletAddress,
    connectExtension,
    extensionInstalled,
    history,
  };
}
