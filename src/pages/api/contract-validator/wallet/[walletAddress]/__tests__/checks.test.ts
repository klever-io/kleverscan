import { NextApiRequest, NextApiResponse } from 'next';

const WALLET = 'klv1qqqqqqqqqqqqqpgq0mkvrke3yjeyzafm0mwz6zqjsvppsel0veys5m7dwn';

import handler from '../checks';

function makeReq(overrides: Record<string, unknown> = {}): NextApiRequest {
  return {
    method: 'GET',
    query: { walletAddress: WALLET },
    ...overrides,
  } as unknown as NextApiRequest;
}

function makeRes() {
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn(() => ({ json, send }));
  return { res: { status } as unknown as NextApiResponse, json, send, status };
}

const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    DEFAULT_CONTRACT_VALIDATOR_URL: 'https://validator.example.com',
    DEFAULT_CONTRACT_VALIDATOR_KEY: 'test-key',
  };
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe('GET /api/contract-validator/wallet/[walletAddress]/checks', () => {
  it('returns 405 for non-GET methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ method: 'POST' }), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('returns 400 for an invalid wallet address', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ query: { walletAddress: 'nope' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid wallet address' });
  });

  it('returns 500 when validator URL is not configured', async () => {
    delete process.env.DEFAULT_CONTRACT_VALIDATOR_URL;
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Contract validator URL not configured',
    });
  });

  it('forwards to the upstream /wallet/:addr/checks endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ checks: [{ id: 1, status: 'completed' }] }),
    });
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`https://validator.example.com/wallet/${WALLET}/checks`);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ checks: [{ id: 1, status: 'completed' }] });
  });
});
