import { NextApiRequest, NextApiResponse } from 'next';
import {
  verifyWalletSignedMessage,
  cryptoProvider,
} from '@klever/connect-crypto';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address } = req.query;
  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;

  if (typeof address !== 'string' || !address) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  const walletAddress = req.headers['x-wallet-address'];
  const walletSignature = req.headers['x-wallet-signature'];

  if (
    typeof walletAddress !== 'string' ||
    !/^klv1[0-9a-z]{58}$/.test(walletAddress)
  ) {
    res.status(401).json({ message: 'Missing or invalid wallet address' });
    return;
  }
  if (typeof walletSignature !== 'string' || !walletSignature) {
    res.status(401).json({ message: 'Missing wallet signature' });
    return;
  }

  const signatureBytes = new Uint8Array(Buffer.from(walletSignature, 'base64'));

  const windowMs = 2 * 60 * 1000;
  const now = Date.now();
  const currentWindow = Math.floor(now / windowMs) * windowMs;
  const previousWindow = currentWindow - windowMs;

  let signatureValid = false;
  try {
    const publicKeyBytes = await cryptoProvider.addressToBytes(walletAddress);
    for (const ts of [currentWindow, previousWindow]) {
      const sigMessage = `Submit validation for contract ${address} at ${ts}`;
      if (
        await verifyWalletSignedMessage(
          sigMessage,
          signatureBytes,
          publicKeyBytes,
        )
      ) {
        signatureValid = true;
        break;
      }
    }
  } catch {
    res.status(401).json({ message: 'Signature verification failed' });
    return;
  }

  if (!signatureValid) {
    res.status(401).json({ message: 'Invalid wallet signature' });
    return;
  }

  try {
    const body = await new Promise<Uint8Array>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      req.on('data', chunk => chunks.push(new Uint8Array(chunk)));
      req.on('end', () => {
        const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(result);
      });
      req.on('error', reject);
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    const response = await fetch(
      `${validatorUrl}/contract/${address}/validate`,
      {
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] as string,
          'content-length': body.byteLength.toString(),
          'X-API-KEY': API_KEY,
        },
        body: body.buffer as ArrayBuffer,
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
      return;
    }
    const text = await response.text();
    res.status(response.status).send(text || '');
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      res.status(504).json({ message: 'Upstream validator timeout' });
      return;
    }
    console.error('Contract validator proxy error:', error);
    res.status(502).json({ message: 'Upstream validator request failed' });
  }
}
