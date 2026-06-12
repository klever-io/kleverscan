import { verifySignature, cryptoProvider } from '@klever/connect-crypto';
import { keccak_256 } from '@noble/hashes/sha3';

// Klever wallet message-signing protocol (matches kos-rs KLV::prepare_message and
// the klever-go-sdk signableMessage):
//   keccak256("\x17Klever Signed Message:\n" + byteLength + messageBytes)
// NOTE: this intentionally differs from connect-crypto's verifyWalletSignedMessage,
// which omits the leading \x17 byte and does NOT match real extension signatures.
const KLV_MSG_PREFIX = '\x17Klever Signed Message:\n';

// signatureWindowMs is the validity window for a signed request. The frontend
// rounds the signing timestamp down to this window; we accept the current,
// previous, and next window to tolerate clock skew in either direction and
// window boundaries.
export const SIGNATURE_WINDOW_MS = 2 * 60 * 1000;

export function prepareKlvMessage(message: string): Uint8Array {
  const msgBytes = Buffer.from(message, 'utf8');
  const prepared = Buffer.concat([
    Buffer.from(KLV_MSG_PREFIX, 'utf8'),
    Buffer.from(String(msgBytes.length), 'utf8'),
    msgBytes,
  ]);
  return keccak_256(prepared);
}

// signatureWindows returns the timestamps (ms) to try when verifying: the
// current, previous, and next window. Mirrors the frontend's rounding in
// ContractVerification and the Go validator's accepted windows.
export function signatureWindows(now = Date.now()): number[] {
  const current = Math.floor(now / SIGNATURE_WINDOW_MS) * SIGNATURE_WINDOW_MS;
  return [
    current,
    current - SIGNATURE_WINDOW_MS,
    current + SIGNATURE_WINDOW_MS,
  ];
}

// verifyKleverSignature reports whether signatureB64 is a valid Klever wallet
// signature of `message` by `walletAddress`, using the \x17 keccak256 scheme.
export async function verifyKleverSignature(
  message: string,
  signatureB64: string,
  walletAddress: string,
): Promise<boolean> {
  try {
    const signatureBytes = new Uint8Array(Buffer.from(signatureB64, 'base64'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(walletAddress);
    return await verifySignature(
      prepareKlvMessage(message),
      signatureBytes,
      publicKeyBytes,
    );
  } catch {
    return false;
  }
}

// verifyWindowedSignature verifies a signature against a per-endpoint message for
// the current and previous time windows. `buildMessage(ts)` must reproduce the
// exact string the frontend signed.
export async function verifyWindowedSignature(
  signatureB64: string,
  walletAddress: string,
  buildMessage: (ts: number) => string,
): Promise<boolean> {
  for (const ts of signatureWindows()) {
    if (
      await verifyKleverSignature(buildMessage(ts), signatureB64, walletAddress)
    ) {
      return true;
    }
  }
  return false;
}
