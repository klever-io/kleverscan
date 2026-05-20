import { NextApiResponse } from 'next';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

export async function proxyToValidator(
  res: NextApiResponse,
  url: string,
  options: RequestInit = {},
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { 'X-API-KEY': API_KEY, ...(options.headers ?? {}) },
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      res.status(response.status).json(await response.json());
      return;
    }
    const text = await response.text();
    res.status(response.status).json({
      message: text || 'Upstream validator returned non-JSON response',
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      res.status(504).json({ message: 'Upstream validator timeout' });
      return;
    }
    console.error('Contract validator proxy error:', error);
    res.status(502).json({ message: 'Upstream validator request failed' });
  } finally {
    clearTimeout(timeoutId);
  }
}
