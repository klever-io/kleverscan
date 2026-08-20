/**
 * These handlers forward a route param into an upstream URL that carries the
 * validator API key. Interpolated raw, a `..%2F` in that param walked out of
 * /contract/ and reached any GET endpoint of that service, with the body
 * returned to an anonymous caller.
 *
 * The param is now pinned to a shape rather than merely escaped, because
 * escaping leaves the request depending on how the upstream normalises a
 * percent-encoded path, and that behaviour is not established here. `validate`
 * and `visibility` were found raw by the same audit and pin `address` the same
 * way; `check` already did.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import infoHandler from '../[address]/info';
import latestJobHandler from '../[address]/jobs/latest';
import sourceHandler from '../[address]/versions/[version]/source';

const VALID_ADDRESS = `klv1${'a'.repeat(58)}`;

const makeReq = (query: Record<string, string>): NextApiRequest =>
  ({ method: 'GET', query }) as unknown as NextApiRequest;

const makeRes = () => {
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn(() => ({ json, send }));
  return { res: { status } as unknown as NextApiResponse, json, status };
};

const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    DEFAULT_CONTRACT_VALIDATOR_URL: 'https://validator.example.com',
    DEFAULT_CONTRACT_VALIDATOR_KEY: 'test-key',
  };
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => ({}),
    text: async () => '',
  });
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

const fetchedUrl = (): string =>
  (global.fetch as jest.Mock).mock.calls[0][0] as string;

const HOSTILE_ADDRESSES = [
  '../../settings?',
  '..%2F..%2Fsettings',
  '..',
  '.',
  '../settings#',
  `klv1${'a'.repeat(57)}`,
  `${VALID_ADDRESS}/extra`,
];

describe('the proxies reject an address that is not an address', () => {
  it.each(
    HOSTILE_ADDRESSES.flatMap(address => [
      [address, 'info', infoHandler] as const,
      [address, 'jobs/latest', latestJobHandler] as const,
    ]),
  )(
    'rejects %s on %s without calling upstream',
    async (address, _route, handler) => {
      const { res, status, json } = makeRes();

      await handler(makeReq({ address }), res);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        message: 'Invalid contract address',
      });
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

  it.each(HOSTILE_ADDRESSES)(
    'rejects %s on versions/source without calling upstream',
    async address => {
      const { res, status } = makeRes();

      await sourceHandler(makeReq({ address, version: '1' }), res);

      expect(status).toHaveBeenCalledWith(400);
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );
});

describe('the source handler pins its version too', () => {
  it.each(['..', '.', '../../secrets', 'abc', '1a', ''])(
    'rejects version %s',
    async version => {
      const { res, status } = makeRes();

      await sourceHandler(makeReq({ address: VALID_ADDRESS, version }), res);

      expect(status).toHaveBeenCalledWith(400);
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

  it('accepts a numeric version, which is what the client sends', async () => {
    await sourceHandler(
      makeReq({ address: VALID_ADDRESS, version: '12' }),
      makeRes().res,
    );

    expect(fetchedUrl()).toBe(
      `https://validator.example.com/contract/${VALID_ADDRESS}/versions/12/source`,
    );
  });
});

describe('an ordinary address still reaches upstream unchanged', () => {
  it('builds the info URL from the address as given', async () => {
    await infoHandler(makeReq({ address: VALID_ADDRESS }), makeRes().res);

    expect(fetchedUrl()).toBe(
      `https://validator.example.com/contract/${VALID_ADDRESS}/info`,
    );
    expect(new URL(fetchedUrl()).pathname).toContain('/contract/');
  });

  it('builds the latest-job URL from the address as given', async () => {
    await latestJobHandler(makeReq({ address: VALID_ADDRESS }), makeRes().res);

    expect(fetchedUrl()).toBe(
      `https://validator.example.com/contract/${VALID_ADDRESS}/jobs/latest`,
    );
  });
});
