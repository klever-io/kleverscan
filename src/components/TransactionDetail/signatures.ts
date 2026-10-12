/* A signature arrives as one string or a list. Mapping the string itself
   would render one row per character, so a bare string stays one value. */
export const signatureList = (
  signature: string | string[] | undefined,
): string[] => {
  if (Array.isArray(signature)) {
    return signature.filter(item => item.length > 0);
  }
  if (typeof signature === 'string' && signature.length > 0) {
    return [signature];
  }
  return [];
};
