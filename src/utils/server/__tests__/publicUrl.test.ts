import dns from 'dns';
import { PublicUrlValidationError, assertPublicHttpUrl } from '../publicUrl';

const mockLookup = (addresses: dns.LookupAddress[]) =>
  jest
    .spyOn(dns.promises, 'lookup')
    .mockResolvedValue(addresses as unknown as dns.LookupAddress);

const mockLookupReject = (error: Error) =>
  jest.spyOn(dns.promises, 'lookup').mockRejectedValue(error);

const rejects = (url: string) =>
  expect(assertPublicHttpUrl(url)).rejects.toBeInstanceOf(
    PublicUrlValidationError,
  );

const resolves = (url: string) =>
  expect(assertPublicHttpUrl(url)).resolves.toBeInstanceOf(URL);

afterEach(() => jest.restoreAllMocks());

describe('assertPublicHttpUrl', () => {
  describe('protocol guard', () => {
    it('rejects file:// URLs', async () => {
      await rejects('file:///etc/passwd');
    });

    it('rejects javascript: URLs', async () => {
      await rejects('javascript:alert(1)');
    });

    it('rejects gopher:// URLs', async () => {
      await rejects('gopher://example.com/');
    });

    it('rejects ftp:// URLs', async () => {
      await rejects('ftp://example.com/');
    });

    it('rejects malformed URLs', async () => {
      await rejects('not-a-url');
    });

    it('accepts http://', async () => {
      mockLookup([{ address: '8.8.8.8', family: 4 }]);
      await resolves('http://example.com/');
    });

    it('accepts https://', async () => {
      mockLookup([{ address: '8.8.8.8', family: 4 }]);
      await resolves('https://example.com/');
    });
  });

  describe('credential guard', () => {
    it('rejects URLs with username', async () => {
      await rejects('http://user@example.com/');
    });

    it('rejects URLs with password', async () => {
      await rejects('http://user:pass@example.com/');
    });
  });

  describe('literal IPv4 — private ranges rejected', () => {
    const cases = [
      ['loopback', 'http://127.0.0.1/'],
      ['private 10.x', 'http://10.0.0.1/'],
      ['private 172.16.x', 'http://172.16.0.1/'],
      ['private 192.168.x', 'http://192.168.1.1/'],
      ['link-local 169.254.x', 'http://169.254.0.1/'],
      ['unspecified 0.x', 'http://0.0.0.0/'],
      ['broadcast', 'http://255.255.255.255/'],
    ];

    test.each(cases)('%s', async (_label, url) => {
      await rejects(url);
    });

    it('allows public IPv4 (8.8.8.8)', async () => {
      await resolves('http://8.8.8.8/');
    });
  });

  describe('literal IPv6 — private ranges rejected (finding #1: bracket fix)', () => {
    it('rejects [::1] loopback', async () => {
      await rejects('http://[::1]/');
    });

    it('rejects [::] unspecified', async () => {
      await rejects('http://[::]/');
    });

    it('rejects [fe80::1] link-local', async () => {
      await rejects('http://[fe80::1]/');
    });

    it('rejects [fc00::1] unique-local', async () => {
      await rejects('http://[fc00::1]/');
    });

    it('rejects [ff00::1] multicast', async () => {
      await rejects('http://[ff00::1]/');
    });

    it('rejects [2001:db8::1] documentation', async () => {
      await rejects('http://[2001:db8::1]/');
    });

    it('allows [2001:4860:4860::8888] (Google DNS public IPv6)', async () => {
      await resolves('http://[2001:4860:4860::8888]/');
    });
  });

  describe('IPv4-mapped IPv6 (finding #2: hex bypass fix)', () => {
    it('rejects [::ffff:127.0.0.1] dotted-quad loopback', async () => {
      await rejects('http://[::ffff:127.0.0.1]/');
    });

    it('rejects [::ffff:7f00:1] hex loopback (127.0.0.1)', async () => {
      await rejects('http://[::ffff:7f00:1]/');
    });

    it('rejects [::ffff:a00:1] hex private (10.0.0.1)', async () => {
      await rejects('http://[::ffff:a00:1]/');
    });

    it('rejects [::ffff:c0a8:1] hex private (192.168.0.1)', async () => {
      await rejects('http://[::ffff:c0a8:1]/');
    });

    it('rejects [::ffff:ac10:0] hex private (172.16.0.0)', async () => {
      await rejects('http://[::ffff:ac10:0]/');
    });

    it('rejects [::ffff:a9fe:1] hex link-local (169.254.0.1)', async () => {
      await rejects('http://[::ffff:a9fe:1]/');
    });

    it('allows [::ffff:808:808] hex public (8.8.8.8)', async () => {
      await resolves('http://[::ffff:808:808]/');
    });
  });

  describe('NAT64 range 64:ff9b::/96 (finding #2: NAT64 fix)', () => {
    it('rejects [64:ff9b::a00:1] NAT64 → 10.0.0.1', async () => {
      await rejects('http://[64:ff9b::a00:1]/');
    });

    it('rejects [64:ff9b::7f00:1] NAT64 → 127.0.0.1', async () => {
      await rejects('http://[64:ff9b::7f00:1]/');
    });

    it('allows [64:ff9b::808:808] NAT64 → 8.8.8.8', async () => {
      await resolves('http://[64:ff9b::808:808]/');
    });
  });

  describe('DNS resolution path', () => {
    it('allows hostnames that resolve to public IPs', async () => {
      mockLookup([{ address: '8.8.8.8', family: 4 }]);
      await resolves('https://example.com/');
    });

    it('rejects hostnames that resolve to a private IP', async () => {
      mockLookup([{ address: '192.168.1.1', family: 4 }]);
      await rejects('https://internal.example.com/');
    });

    it('rejects if any resolved address is private (mixed)', async () => {
      mockLookup([
        { address: '8.8.8.8', family: 4 },
        { address: '10.0.0.1', family: 4 },
      ]);
      await rejects('https://mixed.example.com/');
    });

    it('rejects when DNS returns empty address list', async () => {
      mockLookup([]);
      await rejects('https://nxdomain.example.com/');
    });

    it('rejects when DNS lookup throws (ENOTFOUND)', async () => {
      mockLookupReject(
        Object.assign(new Error('getaddrinfo ENOTFOUND'), {
          code: 'ENOTFOUND',
        }),
      );
      await rejects('https://nxdomain.example.com/');
    });

    it('rejects when DNS lookup throws (ETIMEDOUT)', async () => {
      mockLookupReject(
        Object.assign(new Error('queryA ETIMEDOUT'), { code: 'ETIMEDOUT' }),
      );
      await rejects('https://slow.example.com/');
    });
  });
});
