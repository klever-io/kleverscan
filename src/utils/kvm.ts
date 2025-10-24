export const getKvmReleaseTimestamp = (): number | null => {
  // Support both server and client env var names
  const envVal = process.env
    .NEXT_PUBLIC_KVM_RELEASE_DATE_TIMESTAMP_MS as string;
  if (!envVal) return null;
  const parsed = Number(envVal);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

export const isKvmReleaseActive = (): boolean => {
  const ts = getKvmReleaseTimestamp();
  if (!ts) return false;

  const now = Date.now();
  return now >= ts;
};

export const isKVMAvailable = (network: string | undefined): boolean => {
  if (!network) return isKvmReleaseActive();
  if (network !== 'Mainnet') return true;
  return isKvmReleaseActive();
};
