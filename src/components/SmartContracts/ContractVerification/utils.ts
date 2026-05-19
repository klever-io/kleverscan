import { SmartContractDetailsData } from '@/types/smart-contract';

export function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

export function buildBlockchainVersions(
  scData?: SmartContractDetailsData,
): { txHash: string; label: string }[] {
  if (!scData?.deployTxHash) return [];
  const upgrades = scData.upgrades ?? [];
  const opts: { txHash: string; label: string }[] = upgrades
    .map((u, i) => ({
      txHash: u.upgradeTxHash,
      label: `Upgrade ${i + 1} — ${new Date(u.timestamp * 1000).toLocaleDateString()}`,
    }))
    .reverse();
  opts.push({
    txHash: scData.deployTxHash,
    label: `Deploy — ${new Date(scData.timestamp * 1000).toLocaleDateString()}`,
  });
  return opts;
}
