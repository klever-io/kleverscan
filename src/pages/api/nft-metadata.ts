import {
  PublicUrlValidationError,
  assertPublicHttpUrl,
} from '@/utils/server/publicUrl';
import { NextApiRequest, NextApiResponse } from 'next';

const MAX_METADATA_BYTES = 1024 * 1024;
const MAX_REDIRECTS = 3;

const isRedirectStatus = (status: number): boolean =>
  [301, 302, 303, 307, 308].includes(status);

const isJsonContentType = (contentType: string | null): boolean =>
  Boolean(contentType && /(^|[/+])json($|;)/i.test(contentType));

const fetchPublicUrl = async (
  rawUrl: string,
  signal: AbortSignal,
): Promise<Response> => {
  let currentUrl = await assertPublicHttpUrl(rawUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const response = await fetch(currentUrl.href, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'KleverScan/1.0',
      },
      signal,
      cache: 'no-store',
      redirect: 'manual',
    });

    if (!isRedirectStatus(response.status)) {
      return response;
    }

    const location = response.headers.get('location');

    if (!location) {
      throw new Error('Invalid metadata redirect');
    }

    currentUrl = await assertPublicHttpUrl(
      new URL(location, currentUrl).toString(),
    );
  }

  throw new Error('Too many metadata redirects');
};

const readJsonWithLimit = async (response: Response): Promise<unknown> => {
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('Metadata response body is empty');
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > MAX_METADATA_BYTES) {
      throw new Error('Metadata response is too large');
    }

    chunks.push(value);
  }

  const buffer = new Uint8Array(totalBytes);
  let offset = 0;

  chunks.forEach(chunk => {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  });

  return JSON.parse(new TextDecoder().decode(buffer));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 5_000);
    const response = await fetchPublicUrl(url, controller.signal);

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch metadata' });
    }

    if (!isJsonContentType(response.headers.get('content-type'))) {
      return res.status(415).json({ error: 'Metadata must be JSON' });
    }

    const data = await readJsonWithLimit(response);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);

    if (error instanceof PublicUrlValidationError) {
      return res.status(400).json({ error: 'Invalid metadata URL' });
    }

    if ((error as Error).name === 'AbortError') {
      return res.status(504).json({ error: 'Metadata request timeout' });
    }

    res.status(500).json({
      error: 'Internal server error',
    });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
