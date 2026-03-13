import { ContractInfo, ValidationJob } from '@/types/smart-contract';

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

export const fetchContractInfo = async (
  contractAddress: string,
): Promise<ContractInfo | null> => {
  const res = await fetch(`${BASE}/${contractAddress}/info`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch contract info');
  const data = await res.json();
  return data.contractInfo as ContractInfo;
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
    throw new Error(
      data.message || data.error || 'Validation submission failed',
    );
  }
  return data;
};
