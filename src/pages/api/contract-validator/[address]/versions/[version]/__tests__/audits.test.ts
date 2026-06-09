import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../audits';

const VALID_ADDRESS = 'klv1' + 'a'.repeat(58);
const VALID_VERSION = 'a'.repeat(64);
const VALID_BODY = { link: 'https://audit.example.com/report', label: 'Audited by XYZ' };

const makeReq = (overrides: Partial<NextApiRequest> = {}): NextApiRequest =>
  ({
    method: 'POST',
    query: { address: VALID_ADDRESS, version: VALID_VERSION },
    body: VALID_BODY,
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

describe('POST /api/contract-validator/[address]/versions/[version]/audits', () => {
  it('returns 405 for non-POST methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ method: 'GET' }), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('returns 400 when address format is invalid', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ query: { address: 'invalid', version: VALID_VERSION } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when tx hash format is invalid (not 64 hex chars)', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ query: { address: VALID_ADDRESS, version: 'short' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid transaction hash format' });
  });

  it('returns 400 when link is missing', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ body: { label: 'Auditor' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Audit link is required' });
  });

  it('returns 400 when label is missing', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ body: { link: 'https://audit.example.com' } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Audit label is required' });
  });

  it('returns 400 when link exceeds 2048 characters', async () => {
    const { res, status, json } = makeRes();
    await handler(
      makeReq({ body: { link: 'https://x.com/' + 'a'.repeat(2040), label: 'Auditor' } }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Audit link too long (max 2048 chars)' });
  });

  it('returns 400 when label exceeds 255 characters', async () => {
    const { res, status, json } = makeRes();
    await handler(
      makeReq({ body: { link: 'https://audit.example.com', label: 'a'.repeat(256) } }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Audit label too long (max 255 chars)' });
  });

  it('returns 400 for non-http(s) link protocol', async () => {
    const { res, status, json } = makeRes();
    await handler(
      makeReq({ body: { link: 'ftp://files.example.com/report', label: 'Auditor' } }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Audit link must use http or https' });
  });

  it('forwards successful JSON response from upstream', async () => {
    const upstreamData = { data: { id: 42, link: VALID_BODY.link, label: VALID_BODY.label } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 201,
      headers: { get: () => 'application/json' },
      json: async () => upstreamData,
    });
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(upstreamData);
  });

  it('returns 504 on AbortError timeout', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(504);
    expect(json).toHaveBeenCalledWith({ message: 'Upstream validator timeout' });
  });

  it('returns 502 for other fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(502);
    expect(json).toHaveBeenCalledWith({ message: 'Upstream validator request failed' });
  });
});
