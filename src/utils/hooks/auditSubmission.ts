import { submitAuditReport } from '@/services/requests/contractValidator';
import { AuditReport } from '@/types/smart-contract';
import { isSafeUrl } from '@/components/SmartContracts/ContractVerification/utils';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useAuditSubmission({
  contractAddress,
  txHash,
  currentAudit,
  onSubmitted,
}: {
  contractAddress: string;
  txHash: string;
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

  useEffect(() => {
    setLink(currentAudit?.link ?? '');
    setLabel(currentAudit?.label ?? '');
  }, [currentAudit?.id, currentAudit?.link, currentAudit?.label]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      toast.error('Transaction hash is required');
      return;
    }
    if (!link.trim() || !label.trim()) {
      toast.error('Link and label are required');
      return;
    }
    if (!isSafeUrl(link.trim())) {
      toast.error('Please enter a valid https:// URL');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitAuditReport(contractAddress, txHash, link, label);
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
    pendingExternalUrl,
    setPendingExternalUrl,
    handleSubmit,
  };
}
