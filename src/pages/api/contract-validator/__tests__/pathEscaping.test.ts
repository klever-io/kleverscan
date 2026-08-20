/**
 * These three handlers forward a route param into an upstream URL that carries
 * the validator API key. Interpolated raw, a `..%2F` in that param walked out
 * of /contract/ and reached any GET endpoint of that service, with the body
 * returned to an anonymous caller.
 *
 * Five sibling handlers already escaped; these three validated only that the
 * param was a non-empty string, so the property is pinned here rather than left
 * to the next person noticing the inconsistency.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import infoHandler from '../[address]/info';
import latestJobHandler from '../[address]/jobs/latest';
import sourceHandler from '../[address]/versions/[version]/source';

const TRAVERSAL = '../../settings?';

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

describe('contract-validator proxies escape their route params', () => {
  it('info keeps a traversal payload inside its segment', async () => {
    await infoHandler(makeReq({ address: TRAVERSAL }), makeRes().res);

    expect(fetchedUrl()).toBe(
      'https://validator.example.com/contract/..%2F..%2Fsettings%3F/info',
    );
    expect(new URL(fetchedUrl()).pathname).toContain('/contract/');
  });

  it('latest job keeps a traversal payload inside its segment', async () => {
    await latestJobHandler(makeReq({ address: TRAVERSAL }), makeRes().res);

    expect(fetchedUrl()).toBe(
      'https://validator.example.com/contract/..%2F..%2Fsettings%3F/jobs/latest',
    );
  });

  it('source escapes both the address and the version', async () => {
    await sourceHandler(
      makeReq({ address: TRAVERSAL, version: '../../secrets' }),
      makeRes().res,
    );

    expect(fetchedUrl()).toBe(
      'https://validator.example.com/contract/..%2F..%2Fsettings%3F/versions/..%2F..%2Fsecrets/source',
    );
  });

  it('leaves an ordinary address untouched', async () => {
    const address = `klv1${'a'.repeat(58)}`;

    await infoHandler(makeReq({ address }), makeRes().res);

    expect(fetchedUrl()).toBe(
      `https://validator.example.com/contract/${address}/info`,
    );
  });
});
