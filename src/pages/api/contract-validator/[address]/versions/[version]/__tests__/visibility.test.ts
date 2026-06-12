import { NextApiRequest, NextApiResponse } from 'next';

const VALID_ADDRESS = 'klv1' + 'a'.repeat(58);
const VALID_VERSION = '1';
const SIG_B64 = Buffer.from('signature-bytes').toString('base64');

jest.mock('@/pages/api/contract-validator/_verifySignature', () => ({
  verifyWindowedSignature: jest.fn(),
}));

import handler from '../visibility';
import { verifyWindowedSignature } from '@/pages/api/contract-validator/_verifySignature';

const mockedVerify = verifyWindowedSignature as jest.Mock;

const makeReq = (overrides: Partial<NextApiRequest> = {}): NextApiRequest =>
  ({
    method: 'POST',
    query: { address: VALID_ADDRESS, version: VALID_VERSION },
    headers: {
      'x-wallet-address': VALID_ADDRESS,
      'x-wallet-signature': SIG_B64,
    },
    body: { hideSource: true },
    ...overrides,
  }) as unknown as NextApiRequest;

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
  mockedVerify.mockResolvedValue(true);
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe('POST /api/contract-validator/[address]/versions/[version]/visibility', () => {
  it('returns 405 for non-POST methods', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ method: 'GET' }), res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('returns 401 when wallet address is missing', async () => {
    const { res, status } = makeRes();
    await handler(makeReq({ headers: { 'x-wallet-signature': SIG_B64 } }), res);
    expect(status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when wallet signature is missing', async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq({ headers: { 'x-wallet-address': VALID_ADDRESS } }), res);
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ message: 'Missing wallet signature' });
  });

  it('returns 401 when the signature does not verify', async () => {
    mockedVerify.mockResolvedValueOnce(false);
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid wallet signature' });
  });

  it('verifies with a version-aware visibility message and forwards wallet headers', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'visibility updated' }),
    });
    const { res, status } = makeRes();
    await handler(makeReq(), res);

    expect(mockedVerify).toHaveBeenCalledWith(
      SIG_B64,
      VALID_ADDRESS,
      expect.any(Function),
    );
    const buildMessage = mockedVerify.mock.calls[0][2] as (ts: number) => string;
    expect(buildMessage(123)).toBe(
      `Change source visibility for contract ${VALID_ADDRESS} at 123`,
    );

    const [, upstreamOptions] = (global.fetch as jest.Mock).mock.calls[0];
    expect(upstreamOptions.headers['X-Wallet-Address']).toBe(VALID_ADDRESS);
    expect(upstreamOptions.headers['X-Wallet-Signature']).toBe(SIG_B64);
    expect(JSON.parse(upstreamOptions.body)).toEqual({ hideSource: true });
    expect(status).toHaveBeenCalledWith(200);
  });
});
