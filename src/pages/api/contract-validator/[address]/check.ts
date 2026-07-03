import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

// Cap the buffered upload so an oversized body can't exhaust server memory.
const MAX_CHECK_UPLOAD_BYTES = 1 * 1024 * 1024; // 1 MiB

// This route proxies the multipart upload to the validator by streaming the raw
// request body. Next.js' default body parser would consume the stream before the
// handler reads it, leaving `req.on('data')` with nothing and the request hanging
// forever. Disable it so we can forward the bytes untouched.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Unlike the owner-gated /validate proxy, /check has no signature: the gate is
// the on-chain payment, whose tx hash rides inside the multipart body as the
// `payment_tx_hash` form field. The validator verifies the payment itself.
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

  if (typeof address !== 'string' || !/^klv1[0-9a-z]{58}$/.test(address)) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const body = await new Promise<Uint8Array>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      let received = 0;
      req.on('data', chunk => {
        const part = new Uint8Array(chunk);
        received += part.byteLength;
        if (received > MAX_CHECK_UPLOAD_BYTES) {
          req.destroy();
          reject(
            Object.assign(new Error('Payload too large'), {
              name: 'PayloadTooLargeError',
            }),
          );
          return;
        }
        chunks.push(part);
      });
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
    let response: Response;
    try {
      response = await fetch(`${validatorUrl}/contract/${address}/check`, {
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] as string,
          'content-length': body.byteLength.toString(),
          'X-API-KEY': API_KEY,
        },
        body: body.buffer as ArrayBuffer,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
      return;
    }
    const text = await response.text();
    res.status(response.status).send(text || '');
  } catch (error) {
    if ((error as Error).name === 'PayloadTooLargeError') {
      res.status(413).json({ message: 'Upload too large' });
      return;
    }
    if ((error as Error).name === 'AbortError') {
      res.status(504).json({ message: 'Upstream validator timeout' });
      return;
    }
    console.error('Contract validator proxy error:', error);
    res.status(502).json({ message: 'Upstream validator request failed' });
  }
}
