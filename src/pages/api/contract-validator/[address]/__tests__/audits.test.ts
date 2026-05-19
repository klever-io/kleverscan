import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../audits';

const VALID_ADDRESS = 'klv1' + 'a'.repeat(58);

const makeReq = (overrides: Partial<NextApiRequest> = {}): NextApiRequest =>
  ({
    method: 'GET',
    query: { address: VALID_ADDRESS },
    ...overrides,
  }) as NextApiRequest;

const makeRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { res: { status } as unknown as NextApiResponse, json, status };
};

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

describe('GET /api/contract-validator/[address]/audits', () => {
  it('returns 405 for non-GET methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ method: 'POST' }), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('returns 400 when address is missing', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ query: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid contract address' });
  });

  it('returns 400 when address format is invalid', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ query: { address: 'notakleveraddress' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Invalid contract address format',
    });
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

  it('forwards JSON response from upstream', async () => {
    const upstreamData = { audits: [{ id: 1 }] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => upstreamData,
    });
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(upstreamData);
  });

  it('wraps non-JSON upstream response in message field', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      headers: { get: () => 'text/plain' },
      text: async () => 'plain text body',
    });
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: 'plain text body' });
  });

  it('returns 504 when upstream times out (AbortError)', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(504);
    expect(json).toHaveBeenCalledWith({ message: 'Upstream validator timeout' });
  });

  it('returns 502 for other fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('network error'),
    );
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(502);
    expect(json).toHaveBeenCalledWith({
      message: 'Upstream validator request failed',
    });
  });
});
