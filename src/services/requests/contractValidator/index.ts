import {
  AuditReport,
  ContractInfo,
  ValidationJob,
} from '@/types/smart-contract';

const BASE = '/api/contract-validator';

export const fetchLatestJob = async (
  contractAddress: string,
): Promise<ValidationJob | null> => {
  const res = await fetch(`${BASE}/${contractAddress}/jobs/latest`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch latest job');
  const data = await res.json();
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
  // 404: no source for this version. 403: source is private (verified ABI-only).
  // Both mean "no source files to show" — the ABI is served separately.
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error('Failed to fetch source files');
  const data = await res.json();
  return data.sourceFiles as Record<string, string>;
};

export const submitValidation = async (
  contractAddress: string,
  file: File,
  kscVersion: string,
  rustVersion: string,
  walletAddress: string,
  signature: string,
  hideSource = false,
): Promise<{ jobId: number; message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ksc_version', kscVersion);
  if (rustVersion) formData.append('rust_version', rustVersion);
  if (hideSource) formData.append('hide_source', 'true');

  const res = await fetch(`${BASE}/${contractAddress}/validate`, {
    method: 'POST',
    headers: {
      'X-Wallet-Address': walletAddress,
      'X-Wallet-Signature': signature,
    },
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
  const text = await res.text();
  let data: { message?: string; data?: AuditReport } = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) throw new Error(data.message || 'Audit submission failed');
  return data.data as AuditReport;
};
