interface MultisignSigner {
  weight?: number | string;
  signed?: boolean;
}

interface MultisignThresholdSource {
  signers?: MultisignSigner[];
  Threshold?: number;
  fromJSON?: boolean;
}

/**
 * The multisign API sent the threshold as `Threshold` while its Go struct tag
 * was malformed (`json:"threshold'"`), and sends `threshold` since the tag was
 * fixed (klever-io/multisign-api#61). Accept both so the page works against
 * either deploy, and expose it as `Threshold`, which the components read.
 */
export const normalizeMultisignTx = <T extends Record<string, unknown>>(
  tx: T,
): T & { Threshold: number } => {
  const { threshold, Threshold, ...rest } = tx as Record<string, unknown>;
  const value = Number(threshold ?? Threshold ?? 0);

  return {
    ...(rest as T),
    Threshold: Number.isFinite(value) ? value : 0,
  };
};

/** Sum of the weights of the signers that have signed. */
export const signedWeight = (signers?: MultisignSigner[]): number =>
  (signers ?? []).reduce((sum, signer) => {
    if (!signer?.signed) return sum;
    const weight = Number(signer.weight);
    return Number.isFinite(weight) ? sum + weight : sum;
  }, 0);

/**
 * Same rule the API applies before broadcasting (`Threshold > 0 && sum >=
 * Threshold`). A transaction imported from a JSON file carries no signer list
 * or threshold, so the chain is left to judge it.
 */
export const canBroadcastMultisign = (
  tx?: MultisignThresholdSource,
): boolean => {
  if (!tx) return false;
  if (tx.fromJSON) return true;

  const threshold = tx.Threshold ?? 0;
  return threshold > 0 && signedWeight(tx.signers) >= threshold;
};
