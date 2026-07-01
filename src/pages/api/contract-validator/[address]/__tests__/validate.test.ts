import { NextApiRequest, NextApiResponse } from 'next';
import { EventEmitter } from 'events';

const CONTRACT_ADDRESS =
  'klv1qqqqqqqqqqqqqpgq0mkvrke3yjeyzafm0mwz6zqjsvppsel0veys5m7dwn';
const WALLET_ADDRESS =
  'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc';
const SIG_HEX =
  '16136cd31025eec41c1fd0d5938a09cb29e098aa2c6449ccdf92d0f8b3f3bce98ff7e45d272931802c68e54187adb33acf50ee14a48242ac2116b8cceae47b04';
const SIG_B64 = Buffer.from(SIG_HEX, 'hex').toString('base64');

jest.mock('../../_verifySignature', () => ({
  verifyWindowedSignature: jest.fn(),
}));

import handler from '../validate';
import { verifyWindowedSignature } from '../../_verifySignature';

const mockedVerify = verifyWindowedSignature as jest.Mock;

// Emits 'data' + 'end' after all pending microtasks (crypto awaits) complete.
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
      'x-wallet-address': WALLET_ADDRESS,
      'x-wallet-signature': SIG_B64,
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
  mockedVerify.mockResolvedValue(true);
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

describe('POST /api/contract-validator/[address]/validate', () => {
  describe('pre-signature guards', () => {
    it('returns 405 for non-POST methods', async () => {
      const { res, status, json } = makeRes();
      await handler(makeStreamReq({ method: 'GET' }), res);
      expect(status).toHaveBeenCalledWith(405);
      expect(json).toHaveBeenCalledWith({ message: 'Method not allowed' });
    });

    it('returns 400 when address query param is missing', async () => {
      const { res, status, json } = makeRes();
      await handler(makeStreamReq({ query: {} }), res);
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
  });

  describe('wallet signature validation', () => {
    it('returns 401 when X-Wallet-Address header is missing', async () => {
      const { res, status, json } = makeRes();
      await handler(
        makeStreamReq({ headers: { 'x-wallet-signature': SIG_B64 } }),
        res,
      );
      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({
        message: 'Missing or invalid wallet address',
      });
    });

    it('returns 401 when X-Wallet-Address is not a valid klv1 address', async () => {
      const { res, status, json } = makeRes();
      await handler(
        makeStreamReq({
          headers: {
            'x-wallet-address': 'notakleveraddress',
            'x-wallet-signature': SIG_B64,
          },
        }),
        res,
      );
      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({
        message: 'Missing or invalid wallet address',
      });
    });

    it('returns 401 when X-Wallet-Signature header is missing', async () => {
      const { res, status, json } = makeRes();
      await handler(
        makeStreamReq({ headers: { 'x-wallet-address': WALLET_ADDRESS } }),
        res,
      );
      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({ message: 'Missing wallet signature' });
    });

    it('verifies using a time-windowed message tied to the contract address', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ jobId: 1 }),
      });
      const { res } = makeRes();
      await handler(makeStreamReq(), res);

      expect(mockedVerify).toHaveBeenCalledWith(
        SIG_B64,
        WALLET_ADDRESS,
        expect.any(Function),
      );
      // The builder reproduces the exact per-window message the wallet signs.
      const buildMessage = mockedVerify.mock.calls[0][2] as (ts: number) => string;
      expect(buildMessage(123)).toBe(
        `Submit validation for contract ${CONTRACT_ADDRESS} hideSource=false at 123`,
      );
    });

    it('binds hide_source=true from the query into the signed message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ jobId: 1 }),
      });
      const { res } = makeRes();
      await handler(
        makeStreamReq({
          query: { address: CONTRACT_ADDRESS, hide_source: 'true' },
        }),
        res,
      );

      // calls accumulate across tests in this file (module mocks aren't cleared
      // by restoreAllMocks), so read the most recent call's builder.
      const calls = mockedVerify.mock.calls;
      const buildMessage = calls[calls.length - 1][2] as (ts: number) => string;
      expect(buildMessage(123)).toBe(
        `Submit validation for contract ${CONTRACT_ADDRESS} hideSource=true at 123`,
      );
    });

    it('returns 401 when signature does not match', async () => {
      mockedVerify.mockResolvedValueOnce(false);
      const { res, status, json } = makeRes();
      await handler(makeStreamReq(), res);
      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid wallet signature' });
    });
  });

  describe('upstream proxy', () => {
    it('proxies to upstream and returns JSON response on valid signature', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => ({ jobId: 42, message: 'Queued' }),
      });
      const { res, status, json } = makeRes();
      await handler(makeStreamReq(), res);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ jobId: 42, message: 'Queued' });
    });

    it('forwards wallet signature headers to upstream for re-verification', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({}),
      });
      const { res } = makeRes();
      await handler(makeStreamReq(), res);

      const [, upstreamOptions] = (global.fetch as jest.Mock).mock.calls[0];
      expect(upstreamOptions.headers['X-Wallet-Address']).toBe(WALLET_ADDRESS);
      expect(upstreamOptions.headers['X-Wallet-Signature']).toBe(SIG_B64);
    });

    it('returns 504 when upstream times out', async () => {
      const abortErr = Object.assign(new Error('aborted'), {
        name: 'AbortError',
      });
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortErr);
      const { res, status, json } = makeRes();
      await handler(makeStreamReq(), res);
      expect(status).toHaveBeenCalledWith(504);
      expect(json).toHaveBeenCalledWith({
        message: 'Upstream validator timeout',
      });
    });

    it('returns 502 for other upstream errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('network error'),
      );
      const { res, status, json } = makeRes();
      await handler(makeStreamReq(), res);
      expect(status).toHaveBeenCalledWith(502);
      expect(json).toHaveBeenCalledWith({
        message: 'Upstream validator request failed',
      });
    });
  });
});
