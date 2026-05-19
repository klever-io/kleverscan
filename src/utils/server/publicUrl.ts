import dns from 'dns';
import net from 'net';

const PRIVATE_IPV4_RANGES: Array<[number, number]> = [
  [0x00000000, 0xff000000],
  [0x0a000000, 0xff000000],
  [0x64400000, 0xffc00000],
  [0x7f000000, 0xff000000],
  [0xa9fe0000, 0xffff0000],
  [0xac100000, 0xfff00000],
  [0xc0000000, 0xffffff00],
  [0xc0000200, 0xffffff00],
  [0xc0a80000, 0xffff0000],
  [0xc6120000, 0xfffe0000],
  [0xc6336400, 0xffffff00],
  [0xcb007100, 0xffffff00],
  [0xe0000000, 0xf0000000],
  [0xf0000000, 0xf0000000],
  [0xffffffff, 0xffffffff],
];

const IPV6_SPECIAL_RANGES: Array<[bigint, bigint]> = [
  [BigInt(0), BigInt(128)],
  [BigInt(1), BigInt(128)],
  [BigInt('0x2001') << BigInt(112), BigInt(32)], // Teredo 2001::/32
  [BigInt('0x2002') << BigInt(112), BigInt(16)], // 6to4 2002::/16
  [BigInt('0xfc00') << BigInt(112), BigInt(7)],
  [BigInt('0xfe80') << BigInt(112), BigInt(10)],
  [BigInt('0xff00') << BigInt(112), BigInt(8)],
  [BigInt('0x20010db8') << BigInt(96), BigInt(32)],
];

export class PublicUrlValidationError extends Error {
  constructor(message = 'Invalid URL') {
    super(message);
    this.name = 'PublicUrlValidationError';
  }
}

const dnsLookup = dns.promises.lookup;

const ipv4ToNumber = (address: string): number =>
  address.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>>
  0;

const isPrivateIPv4 = (address: string): boolean => {
  const value = ipv4ToNumber(address);
  return PRIVATE_IPV4_RANGES.some(
    ([range, mask]) => (value & mask) === (range & mask),
  );
};

const parseIPv6 = (address: string): bigint | null => {
  const normalizedAddress = address.toLowerCase();
  const ipv4Match = normalizedAddress.match(/(.+):(\d+\.\d+\.\d+\.\d+)$/);
  const ipv4Part = ipv4Match?.[2];
  const ipv6Part = ipv4Match ? ipv4Match[1] : normalizedAddress;
  const [left, right = ''] = ipv6Part.split('::');
  const leftParts = left ? left.split(':') : [];
  const rightParts = right ? right.split(':') : [];
  const ipv4Groups = ipv4Part
    ? [
        Math.floor(ipv4ToNumber(ipv4Part) / 0x10000).toString(16),
        (ipv4ToNumber(ipv4Part) & 0xffff).toString(16),
      ]
    : [];
  const missingGroups =
    8 - leftParts.length - rightParts.length - ipv4Groups.length;

  if (missingGroups < 0 || (!ipv6Part.includes('::') && missingGroups !== 0)) {
    return null;
  }

  const groups = [
    ...leftParts,
    ...Array(missingGroups).fill('0'),
    ...rightParts,
    ...ipv4Groups,
  ];

  if (
    groups.length !== 8 ||
    groups.some(group => !/^[0-9a-f]{1,4}$/.test(group))
  ) {
    return null;
  }

  return groups.reduce(
    (acc, group) => (acc << BigInt(16)) + BigInt(parseInt(group, 16)),
    BigInt(0),
  );
};

const isInIPv6Range = (
  address: bigint,
  range: bigint,
  prefixLength: bigint,
): boolean => {
  const shift = BigInt(128) - prefixLength;
  return address >> shift === range >> shift;
};

const bigintToIPv4 = (value: bigint): string => {
  const n = Number(value & BigInt(0xffffffff));
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join('.');
};

const isPrivateIPv6 = (address: string): boolean => {
  const parsed = parseIPv6(address);

  if (parsed === null) {
    return true;
  }

  // ::ffff:d.d.d.d — IPv4-mapped dotted-quad form
  const mappedIPv4Dotted = address
    .toLowerCase()
    .match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedIPv4Dotted) {
    return isPrivateIPv4(mappedIPv4Dotted[1]);
  }

  // ::ffff:0:0/96 — IPv4-mapped hex form (e.g. ::ffff:7f00:1 = 127.0.0.1)
  // group 5 (bits 32-47) = 0xffff, prefix 96 → range BigInt('0xffff') << 32n
  if (isInIPv6Range(parsed, BigInt('0xffff') << BigInt(32), BigInt(96))) {
    return isPrivateIPv4(bigintToIPv4(parsed));
  }

  // 64:ff9b::/96 — NAT64 (embeds IPv4 in low 32 bits)
  if (isInIPv6Range(parsed, BigInt('0x0064ff9b') << BigInt(96), BigInt(96))) {
    return isPrivateIPv4(bigintToIPv4(parsed));
  }

  return IPV6_SPECIAL_RANGES.some(([range, prefixLength]) =>
    isInIPv6Range(parsed, range, prefixLength),
  );
};

const isPrivateAddress = (address: string): boolean => {
  if (net.isIP(address) === 4) {
    return isPrivateIPv4(address);
  }

  if (net.isIP(address) === 6) {
    return isPrivateIPv6(address);
  }

  return true;
};

export const assertPublicHttpUrl = async (rawUrl: string): Promise<URL> => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl);
  } catch (_) {
    throw new PublicUrlValidationError();
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new PublicUrlValidationError();
  }

  if (!parsedUrl.hostname || parsedUrl.username || parsedUrl.password) {
    throw new PublicUrlValidationError();
  }

  // WHATWG URL returns "[::1]" for IPv6 literals; strip brackets before net.isIP
  const host = parsedUrl.hostname.replace(/^\[|\]$/g, '');

  if (net.isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new PublicUrlValidationError();
    }

    return parsedUrl;
  }

  let addresses: dns.LookupAddress[];

  try {
    addresses = await dnsLookup(host, {
      all: true,
      verbatim: true,
    });
  } catch (_) {
    throw new PublicUrlValidationError();
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isPrivateAddress(address))
  ) {
    throw new PublicUrlValidationError();
  }

  return parsedUrl;
};
