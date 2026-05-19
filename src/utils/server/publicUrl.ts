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

const isPrivateIPv6 = (address: string): boolean => {
  const parsed = parseIPv6(address);

  if (parsed === null) {
    return true;
  }

  const mappedIPv4 = address
    .toLowerCase()
    .match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedIPv4) {
    return isPrivateIPv4(mappedIPv4[1]);
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

  if (net.isIP(parsedUrl.hostname)) {
    if (isPrivateAddress(parsedUrl.hostname)) {
      throw new PublicUrlValidationError();
    }

    return parsedUrl;
  }

  let addresses: dns.LookupAddress[];

  try {
    addresses = await dnsLookup(parsedUrl.hostname, {
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
