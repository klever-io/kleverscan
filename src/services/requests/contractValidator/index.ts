import {
  AuditReport,
  ContractInfo,
  ValidationJob,
} from '@/types/smart-contract';

const BASE = '/api/contract-validator';

export const fetchLatestJob = async (
  contractAddress: string,
  refetchContractInfo: () => void,
): Promise<ValidationJob | null> => {
  const res = await fetch(`${BASE}/${contractAddress}/jobs/latest`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch latest job');
  const data = await res.json();
  if (data.job?.status === 'completed') {
    // Refetch contract info to get the latest verified version
    refetchContractInfo();
  }
  return data.job as ValidationJob;
};

export interface ContractInfoResult {
  contractInfo: ContractInfo | null;
  auditReports: AuditReport[];
  sourceUpToDate: boolean;
}

export const fetchContractInfo = async (
  contractAddress: string,
): Promise<ContractInfoResult> => {
  const res = await fetch(`${BASE}/${contractAddress}/info`);
  if (!res.ok) throw new Error('Failed to fetch contract info');
  const data = await res.json();
  const auditReports = (data.auditReports ?? []) as AuditReport[];
  const contractInfo = data.contractInfo
    ? ({
        ...(data.contractInfo as ContractInfo),
        sourceUpToDate: data.sourceUpToDate,
      } as ContractInfo)
    : null;
  return {
    contractInfo,
    auditReports,
    sourceUpToDate: data.sourceUpToDate ?? false,
  };
};

export const fetchSourceFiles = async (
  contractAddress: string,
  version: number,
): Promise<Record<string, string> | null> => {
  const res = await fetch(
    `${BASE}/${contractAddress}/versions/${version}/source`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch source files');
  const data = await res.json();
  return data.sourceFiles as Record<string, string>;
};

export const submitValidation = async (
  contractAddress: string,
  file: File,
  kscVersion: string,
  rustVersion: string,
): Promise<{ jobId: number; message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ksc_version', kscVersion);
  if (rustVersion) formData.append('rust_version', rustVersion);

  const res = await fetch(`${BASE}/${contractAddress}/validate`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Validation submission failed', {
      cause: data?.error || undefined,
    }) as Error;
    throw err;
  }
  return data;
};

export const fetchContractAudits = async (
  contractAddress: string,
): Promise<AuditReport[]> => {
  const res = await fetch(`${BASE}/${contractAddress}/audits`);
  if (!res.ok) throw new Error('Failed to fetch audit reports');
  const data = await res.json();
  return (data.data ?? []) as AuditReport[];
};

export const submitAuditReport = async (
  contractAddress: string,
  txHash: string,
  link: string,
  label: string,
): Promise<AuditReport> => {
  const res = await fetch(
    `${BASE}/${contractAddress}/versions/${txHash}/audits`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link, label }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Audit submission failed');
  return data.data as AuditReport;
};
