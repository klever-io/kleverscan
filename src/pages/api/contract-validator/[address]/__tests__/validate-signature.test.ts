/**
 * @jest-environment node
 */
import { verifySignature, cryptoProvider } from '@klever/connect-crypto';
import { keccak_256 } from '@noble/hashes/sha3';

const CONTRACT_ADDRESS =
  'klv1qqqqqqqqqqqqqpgq0mkvrke3yjeyzafm0mwz6zqjsvppsel0veys5m7dwn';
const MESSAGE = `Submit validation for contract ${CONTRACT_ADDRESS}`;

// Real signature produced by the Klever browser extension for MESSAGE.
const WALLET_ADDRESS =
  'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc';
const SIG_HEX =
  '16136cd31025eec41c1fd0d5938a09cb29e098aa2c6449ccdf92d0f8b3f3bce98ff7e45d272931802c68e54187adb33acf50ee14a48242ac2116b8cceae47b04';

// KLV signing protocol mirrors kos-rs KLV::prepare_message:
//   keccak256("\x17Klever Signed Message:\n" + byteLength + messageBytes)
const KLV_MSG_PREFIX = '\x17Klever Signed Message:\n';

function prepareKlvMessage(message: string): Uint8Array {
  const msgBytes = Buffer.from(message, 'utf8');
  const prepared = Buffer.concat([
    Buffer.from(KLV_MSG_PREFIX, 'utf8'),
    Buffer.from(String(msgBytes.length), 'utf8'),
    msgBytes,
  ]);
  return keccak_256(prepared);
}

describe('contract validation signature verification (KLV protocol)', () => {
  const messageBytes = prepareKlvMessage(MESSAGE);

  it('produces a 32-byte keccak256 digest from the KLV message protocol', () => {
    expect(messageBytes).toBeInstanceOf(Uint8Array);
    expect(messageBytes.byteLength).toBe(32);
  });

  it('resolves the public key from the wallet address', async () => {
    const publicKeyBytes = await cryptoProvider.addressToBytes(WALLET_ADDRESS);
    expect(publicKeyBytes).toBeInstanceOf(Uint8Array);
    expect(publicKeyBytes.byteLength).toBe(32);
  });

  it('verifies the real wallet signature decoded from hex', async () => {
    const signatureBytes = new Uint8Array(Buffer.from(SIG_HEX, 'hex'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(WALLET_ADDRESS);
    const valid = await verifySignature(messageBytes, signatureBytes, publicKeyBytes);
    expect(valid).toBe(true);
  });

  it('verifies the real wallet signature decoded from base64 (server-side decode path)', async () => {
    const sigBase64 = Buffer.from(SIG_HEX, 'hex').toString('base64');
    const signatureBytes = new Uint8Array(Buffer.from(sigBase64, 'base64'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(WALLET_ADDRESS);
    const valid = await verifySignature(messageBytes, signatureBytes, publicKeyBytes);
    expect(valid).toBe(true);
  });

  it('rejects a tampered signature', async () => {
    const tampered =
      SIG_HEX.slice(0, -2) + (SIG_HEX.endsWith('04') ? '05' : '04');
    const signatureBytes = new Uint8Array(Buffer.from(tampered, 'hex'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(WALLET_ADDRESS);
    const valid = await verifySignature(messageBytes, signatureBytes, publicKeyBytes);
    expect(valid).toBe(false);
  });

  it('rejects a signature against a different message', async () => {
    const wrongBytes = prepareKlvMessage(
      `Submit validation for contract klv1${'b'.repeat(58)}`,
    );
    const signatureBytes = new Uint8Array(Buffer.from(SIG_HEX, 'hex'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(WALLET_ADDRESS);
    const valid = await verifySignature(wrongBytes, signatureBytes, publicKeyBytes);
    expect(valid).toBe(false);
  });

  it('rejects a signature against the wrong address', async () => {
    // CONTRACT_ADDRESS is a valid address but not the signer's
    const wrongAddress = CONTRACT_ADDRESS;
    const signatureBytes = new Uint8Array(Buffer.from(SIG_HEX, 'hex'));
    const publicKeyBytes = await cryptoProvider.addressToBytes(wrongAddress);
    const valid = await verifySignature(messageBytes, signatureBytes, publicKeyBytes);
    expect(valid).toBe(false);
  });
});
