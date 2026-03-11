import { NextApiRequest, NextApiResponse } from 'next';

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
  const validatorUrl = process.env.CONTRACT_VALIDATOR_URL;

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', chunk => chunks.push(Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    const response = await fetch(
      `${validatorUrl}/contract/${address}/validate`,
      {
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] as string,
          'content-length': body.length.toString(),
        },
        body,
      },
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal error', error: String(error) });
  }
}
