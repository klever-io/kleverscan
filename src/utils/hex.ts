// Shared helpers for decoding smart-contract log payloads. The node returns
// event `topics`/`data` (and error messages) as hex strings.

export const cleanHex = (value?: string | null): string =>
  (value ?? '').replace(/^0x/, '');

interface HexToUtf8Options {
  // When set, the decoded text is only returned if it is entirely printable
  // ASCII; otherwise the original input is returned. Useful for best-effort
  // decoding of values that may not be human-readable text (e.g. error logs).
  printableAsciiOnly?: boolean;
}

// Decode a hex string as UTF-8 text using a real multibyte decoder. Returns the
// original input unchanged when it isn't valid even-length hex.
export const hexToUtf8 = (
  hex: string,
  { printableAsciiOnly = false }: HexToUtf8Options = {},
): string => {
  const clean = cleanHex(hex);
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2 !== 0) return hex;

  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

  if (printableAsciiOnly && !/^[\x20-\x7e]*$/.test(decoded)) return hex;
  return decoded;
};
