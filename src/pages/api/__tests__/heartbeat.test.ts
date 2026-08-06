import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../heartbeat';

function makeReq(method = 'GET'): NextApiRequest {
  return { method } as unknown as NextApiRequest;
}

function makeRes() {
  const json = jest.fn();
  const setHeader = jest.fn();
  const status = jest.fn(() => ({ json }));
  return {
    res: { status, setHeader } as unknown as NextApiResponse,
    json,
    status,
    setHeader,
  };
}

const originalFetch = global.fetch;
const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    DEFAULT_NODE_HOST: 'https://node.mainnet.example/',
  };
  global.fetch = jest.fn();
  jest.useFakeTimers();
});

afterEach(() => {
  process.env = originalEnv;
  global.fetch = originalFetch;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('GET /api/heartbeat', () => {
  it('returns 405 for non-GET methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq('POST'), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('proxies successful upstream heartbeat and sets cache headers', async () => {
    const payload = { data: { heartbeats: [{ publicKey: 'a' }] }, error: '' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => payload,
    });

    const { res, status, json, setHeader } = makeRes();
    await handler(makeReq('GET'), res);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://node.mainnet.example/node/heartbeatstatus',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    );
    expect(setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60',
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(payload);
  });

  it('forwards upstream non-ok status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const { res, status, json } = makeRes();
    await handler(makeReq('GET'), res);

    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith({
      data: null,
      error: 'Heartbeat upstream failed with 503',
      code: 'upstream_error',
    });
  });

  it('returns 502 when upstream fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('timeout'));

    const { res, status, json } = makeRes();
    await handler(makeReq('GET'), res);

    expect(status).toHaveBeenCalledWith(502);
    expect(json).toHaveBeenCalledWith({
      data: null,
      error: 'timeout',
      code: 'proxy_error',
    });
  });

  it('uses testnet default when DEFAULT_NODE_HOST is unset', async () => {
    delete process.env.DEFAULT_NODE_HOST;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { heartbeats: [] } }),
    });

    const { res } = makeRes();
    await handler(makeReq('GET'), res);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://node.testnet.klever.org/node/heartbeatstatus',
      expect.any(Object),
    );
  });
});
