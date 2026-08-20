import { NextApiRequest, NextApiResponse } from 'next';
import { proxyToValidator } from '@/pages/api/contract-validator/_proxy';
import { verifyWindowedSignature } from '@/pages/api/contract-validator/_verifySignature';

const visibilityMessage = (
  address: string,
  version: string,
  hideSource: boolean,
  ts: number,
): string =>
  `Change source visibility for contract ${address} version ${version} hideSource=${hideSource} at ${ts}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address, version } = req.query;
  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;

  // Same shape checks as the sibling handlers. This request carries the API
  // key, so both segments are pinned rather than merely escaped.
  if (typeof address !== 'string' || !/^klv1[0-9a-z]{58}$/.test(address)) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }
  // Not pinned to a format: the sibling audits handler expects a 64-char hex
  // hash, but this endpoint's own spec exercises '1', so the shape is not
  // established. Escaped below, with dot segments rejected here.
  if (
    typeof version !== 'string' ||
    !version ||
    version === '.' ||
    version === '..'
  ) {
    res.status(400).json({ message: 'Invalid version' });
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

  // hideSource is required and bound into the signed message; reject anything
  // but an explicit boolean so it can't be defaulted on the way through.
  const hideSource = (req.body as { hideSource?: unknown } | undefined)
    ?.hideSource;
  if (typeof hideSource !== 'boolean') {
    res.status(400).json({ message: 'hideSource is required' });
    return;
  }

  const signatureValid = await verifyWindowedSignature(
    walletSignature,
    walletAddress,
    ts => visibilityMessage(address, version, hideSource, ts),
  );
  if (!signatureValid) {
    res.status(401).json({ message: 'Invalid wallet signature' });
    return;
  }

  await proxyToValidator(
    res,
    `${validatorUrl}/contract/${encodeURIComponent(
      address,
    )}/versions/${encodeURIComponent(version)}/visibility`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // Forward wallet auth so the validator re-verifies (defense in depth).
        'X-Wallet-Address': walletAddress,
        'X-Wallet-Signature': walletSignature,
      },
      body: JSON.stringify(req.body ?? {}),
    },
  );
}
