import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Server-side proxy for node heartbeatstatus.
 * Avoids flaky browser → node CORS/size issues and keeps NODE_HOST server-side.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const nodeHost = (
    process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.org'
  ).replace(/\/$/, '');

  const url = `${nodeHost}/node/heartbeatstatus`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      return res.status(response.status).json({
        data: null,
        error: `Heartbeat upstream failed with ${response.status}`,
        code: 'upstream_error',
      });
    }

    const data = await response.json();
    // Cache briefly — heartbeats change slowly; reduces reload pressure.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60',
    );
    return res.status(200).json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Heartbeat request failed';
    return res.status(502).json({
      data: null,
      error: message,
      code: 'proxy_error',
    });
  } finally {
    clearTimeout(timeout);
  }
}
