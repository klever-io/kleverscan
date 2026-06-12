import { NextApiRequest, NextApiResponse } from 'next';
import { verifyWindowedSignature } from '../_verifySignature';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

const validateMessage = (
  address: string,
  hideSource: boolean,
  ts: number,
): string =>
  `Submit validation for contract ${address} hideSource=${hideSource} at ${ts}`;

// This route proxies the multipart upload to the validator by streaming the raw
// request body. Next.js' default body parser would consume the stream before
// the handler reads it, leaving `req.on('data')` with nothing and the request
// hanging forever. Disable it so we can forward the bytes untouched.
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  // This route streams the multipart body raw (bodyParser disabled), so the
  // proxy can't read the hide_source form field. It arrives as a query param so
  // we can reconstruct the signed message; the validator re-reads hide_source
  // from the multipart body and reconstructs the same string.
  const hideSource = req.query.hide_source === 'true';

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

  const signatureValid = await verifyWindowedSignature(
    walletSignature,
    walletAddress,
    ts => validateMessage(address, hideSource, ts),
  );

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
          // Forward wallet auth so the validator re-verifies (defense in depth).
          'X-Wallet-Address': walletAddress,
          'X-Wallet-Signature': walletSignature,
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
