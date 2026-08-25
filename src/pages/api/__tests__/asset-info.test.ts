/**
 * This route forwards `asset_id` into an upstream URL that carries the
 * Kleverscan API key. `encodeURIComponent` leaves `.` and `..` alone and URL
 * parsing then walks up a level, so `?asset_id=..` resolved to the collection
 * endpoint rather than a single record, on an anonymous request.
 *
 * There was no spec for this file, so deleting or weakening the guard failed
 * nothing.
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Read at module load in the handler, so they are set before it is required.
process.env.DEFAULT_KLEVERSCAN_API_URL = 'https://info.example.com';
process.env.DEFAULT_KLEVERSCAN_API_KEY = 'test-key';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const handler = require('../asset-info').default as (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

const makeReq = (query: Record<string, string>): NextApiRequest =>
  ({ method: 'GET', query }) as unknown as NextApiRequest;

const makeRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { res: { status } as unknown as NextApiResponse, json, status };
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ data: {} }),
  });
});

afterEach(() => jest.restoreAllMocks());

const fetchedUrl = (): string =>
  (global.fetch as jest.Mock).mock.calls[0][0] as string;

describe('asset-info rejects a dot segment before calling upstream', () => {
  it.each(['.', '..'])('rejects %s', async asset_id => {
    const { res, status, json } = makeRes();

    await handler(makeReq({ asset_id }), res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'Invalid asset identifier',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each(['', '   '])('still rejects an empty identifier (%s)', async id => {
    const { res, status } = makeRes();

    await handler(makeReq({ asset_id: id }), res);

    expect(status).toHaveBeenCalledWith(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('asset-info builds the upstream URL from the identifier', () => {
  it('passes an ordinary asset id straight through', async () => {
    await handler(makeReq({ asset_id: 'KLV' }), makeRes().res);

    expect(fetchedUrl()).toBe(
      'https://info.example.com/api/v1/asset-info/asset/KLV',
    );
  });

  it('keeps the nonce form inside one segment', async () => {
    await handler(makeReq({ asset_id: 'KID-36W3/1' }), makeRes().res);

    expect(fetchedUrl()).toContain('KID-36W3%2F1');
    expect(new URL(fetchedUrl()).pathname).toBe(
      '/api/v1/asset-info/asset/KID-36W3%2F1',
    );
  });

  it('does not let a crafted id leave the asset path', async () => {
    await handler(makeReq({ asset_id: '../../settings?' }), makeRes().res);

    expect(new URL(fetchedUrl()).pathname).toContain('/asset-info/asset/');
  });
});
