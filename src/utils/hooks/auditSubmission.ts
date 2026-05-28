import { AuditReport } from '@/types/smart-contract';
import { isSafeUrl } from '@/components/SmartContracts/ContractVerification/utils';
import { useExtension } from '@/contexts/extension';
import { Transaction } from '@klever/connect';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface AuditSettings {
  receiver_address: string;
  transfer_value: number;
  asset_id: string;
}

export function useAuditSubmission({
  contractAddress,
  currentAudit,
  onSubmitted,
}: {
  contractAddress: string;
  currentAudit: AuditReport | null;
  onSubmitted: () => void;
}) {
  const [link, setLink] = useState('');
  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(
    null,
  );
  const [transferValue, setTransferValue] = useState<number | null>(null);
  const { wallet } = useExtension();

  useEffect(() => {
    setLink(currentAudit?.link ?? '');
    setLabel(currentAudit?.label ?? '');
  }, [currentAudit?.id, currentAudit?.link, currentAudit?.label]);

  useEffect(() => {
    fetch('/api/contract-validator/settings')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then((data: AuditSettings) => {
        if (data?.transfer_value != null) {
          setTransferValue(data.transfer_value / 10 ** KLV_PRECISION);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedLink = link.trim();
    const normalizedLabel = label.trim();

    if (!normalizedLink || !normalizedLabel) {
      toast.error('Link and label are required');
      return;
    }
    if (!isSafeUrl(normalizedLink)) {
      toast.error('Please enter a valid https:// URL');
      return;
    }
    if (!wallet) {
      toast.error('Wallet not connected. Please connect your wallet.');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    let settings: AuditSettings;
    try {
      const settingsRes = await fetch('/api/contract-validator/settings');
      if (!settingsRes.ok) throw new Error('Failed to fetch settings');
      settings = await settingsRes.json();
      if (!settings.receiver_address || settings.transfer_value == null) {
        throw new Error('Invalid settings response');
      }
    } catch {
      toast.error('Failed to load payment settings');
      setSubmitting(false);
      return;
    }

    let signedTransaction: unknown;
    try {
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
      return;
    }

    try {
      const res = await fetch(
        `/api/contract-validator/${contractAddress}/audit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signedTransaction: JSON.stringify(signedTransaction),
            link: normalizedLink,
            label: normalizedLabel,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          data?.message || data?.data?.message || 'Submission failed';
        toast.error(message);
        setSubmitError(message);
        return;
      }
      toast.success('Audit report submitted successfully');
      onSubmitted();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      toast.error(message);
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    link,
    setLink,
    label,
    setLabel,
    submitting,
    submitError,
    transferValue,
    pendingExternalUrl,
    setPendingExternalUrl,
    handleSubmit,
  };
}
