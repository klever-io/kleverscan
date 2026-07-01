import { NextApiRequest, NextApiResponse } from 'next';
import { EventEmitter } from 'events';

const CONTRACT_ADDRESS =
  'klv1qqqqqqqqqqqqqpgq0mkvrke3yjeyzafm0mwz6zqjsvppsel0veys5m7dwn';

import handler from '../check';

// Emits 'data' + 'end' on next tick so the handler's stream reader resolves.
function makeStreamReq(
  overrides: Record<string, unknown> = {},
): NextApiRequest {
  const emitter = new EventEmitter();
  setTimeout(() => {
    emitter.emit('data', Buffer.from('body'));
    emitter.emit('end');
  }, 0);
  return {
    method: 'POST',
    query: { address: CONTRACT_ADDRESS },
    headers: {
      'content-type': 'multipart/form-data; boundary=xyz',
    },
    on: emitter.on.bind(emitter),
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

describe('POST /api/contract-validator/[address]/check', () => {
  it('returns 405 for non-POST methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeStreamReq({ method: 'GET' }), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('returns 400 when address is not a valid klv1 address', async () => {
    const { res, status, json } = makeRes();
    await handler(makeStreamReq({ query: { address: 'notanaddress' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid contract address' });
  });

  it('returns 500 when validator URL is not configured', async () => {
    delete process.env.DEFAULT_CONTRACT_VALIDATOR_URL;
    const { res, status, json } = makeRes();
    await handler(makeStreamReq(), res);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Contract validator URL not configured',
    });
  });

  it('streams the body to the upstream /check endpoint with the API key', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 202,
      headers: { get: () => 'application/json' },
      json: async () => ({ jobId: 7, message: 'check queued' }),
    });
    const { res, status, json } = makeRes();
    await handler(makeStreamReq(), res);

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      `https://validator.example.com/contract/${CONTRACT_ADDRESS}/check`,
    );
    expect(options.method).toBe('POST');
    // X-API-KEY is forwarded (its value is read at module load, so we assert the
    // header is present rather than its env-dependent value).
    expect(options.headers).toHaveProperty('X-API-KEY');
    expect(status).toHaveBeenCalledWith(202);
    expect(json).toHaveBeenCalledWith({ jobId: 7, message: 'check queued' });
  });

  it('does not require any wallet signature header', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 202,
      headers: { get: () => 'application/json' },
      json: async () => ({ jobId: 1 }),
    });
    const { res, status } = makeRes();
    // No x-wallet-* headers provided.
    await handler(makeStreamReq(), res);
    expect(status).toHaveBeenCalledWith(202);
  });

  it('returns 504 when upstream times out', async () => {
    const abortErr = Object.assign(new Error('aborted'), { name: 'AbortError' });
    (global.fetch as jest.Mock).mockRejectedValueOnce(abortErr);
    const { res, status, json } = makeRes();
    await handler(makeStreamReq(), res);
    expect(status).toHaveBeenCalledWith(504);
    expect(json).toHaveBeenCalledWith({ message: 'Upstream validator timeout' });
  });

  it('returns 502 for other upstream errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));
    const { res, status, json } = makeRes();
    await handler(makeStreamReq(), res);
    expect(status).toHaveBeenCalledWith(502);
    expect(json).toHaveBeenCalledWith({
      message: 'Upstream validator request failed',
    });
  });
});
