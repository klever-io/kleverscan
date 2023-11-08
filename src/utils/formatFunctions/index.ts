import { ISelectedDays } from '@/components/DateFilter';
import { IFilterDater } from '@/types';
import { bech32 } from 'bech32';
import { format } from 'date-fns';
import { contractsList } from '../contracts';

/**
 * given a timestamp returns a human readable date string in the format MM/dd/yyyy HH:mm
 * @param timestamp number
 * @returns a formatted date in a string type
 */
export const formatDate = (timestamp: number): string => {
  while (new Date(timestamp).getFullYear() < 2000) {
    timestamp = timestamp * 10 ** 3;
  }

  while (new Date(timestamp).getFullYear() > 3000) {
    timestamp = timestamp / 10 ** 3;
  }

  return format(new Date(timestamp), 'MM/dd/yyyy HH:mm');
};

/**
 * Formats a number and returns it's string representation in short scale (Million, Billion...) with 2 decimals points when number is not integer.
 * Example: 8874165276.908615 --> "8.87 Bi"
 * @param number
 * @returns string
 */
export const formatAmount = (number: number): string => {
  if (number <= 0) {
    return '0';
  }

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'Mi' },
    { value: 1e9, symbol: 'Bi' },
    { value: 1e12, symbol: 'Tri' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];

  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item =
    lookup
      .slice()
      .reverse()
      .find(i => number >= i.value) || lookup[0];

  return `${(number / item.value).toFixed(2).replace(regex, '$1')} ${
    item.symbol
  }`;
};

/**
 * Throws a string into a switch case statement to return the hardcoded parsed version of this string. In case none of the cases matches, function will execute default parse mode, which it splits the string by it's capital letters and join all words by empty spaces.
 * @param str
 * @returns string
 */
export const formatLabel = (str: string): string => {
  switch (str) {
    case 'assetID':
      return 'AssetID';
    case 'assetId':
      return 'AssetID';
    case 'bucketID':
      return 'BucketID';
    case 'isNFTMintStopped':
      return 'Is NFT Mint Stopped';
    case 'APR':
      return 'APR';
    case 'BLSPublicKey':
      return 'BLS Public Key';
    case 'marketplaceID':
      return 'MarketplaceID';
    default:
      break;
  }

  if (str === 'assetID') {
    return 'AssetID';
  }

  const formatedstr = str.charAt(0).toUpperCase() + str.slice(1);
  let label = '';
  formatedstr?.split(/(?=[A-Z])/).forEach((item: string, index: number) => {
    label += item;
    if (index < formatedstr?.split(/(?=[A-Z])/).length - 1) {
      label += ' ';
    }
  });

  return label;
};

/**
 * Validates URL extension with regex. Accepted formats: gif|jpg|jpeg|tiff|png|webp
 * @param url
 * @returns boolean
 */
export const regexImgUrl = (url: string): boolean => {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png|webp|svg)$/i;
  if (regex.test(url)) {
    return true;
  }
  return false;
};

/**
 * Receive selectedDays
 * @param selectedDays is required to format the date filter
 * @returns return the filter as object with "startdate" and "enddate"
 */
export const filterDate = (selectedDays: ISelectedDays): IFilterDater => {
  return {
    startdate: selectedDays.start.getTime().toString(),
    enddate: selectedDays.end
      ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
      : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
  };
};

/**
 * Shorthand version of toLocaleString for passing precision and always using user locale. It receives a number that will be formatted having a minimal precision according to the precision arg passed.
 * @param value
 * @param precision
 * @returns string
 */
export const toLocaleFixed = (value: number, precision: number): string => {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: precision,
  });
};

export const isHex = (str: string): boolean => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(str);
};

export const base64ToHex = (str: string): string => {
  if (isHex(str)) {
    return str;
  } else {
    const decodedBytes: Uint8Array = Buffer.from(str, 'base64');
    const hexString: string = Array.from(decodedBytes, byte =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    return hexString;
  }
};

export const invertBytes = (hex: string): string => {
  let newHex = '';
  for (let i = 0; i < hex.length; i += 2) {
    newHex = hex.slice(i, i + 2) + newHex;
  }
  return newHex;
};

export const hexToBinary = (hex: string): string => {
  if (!isHex(hex)) {
    return '';
  }
  const binary = parseInt(hex, 16).toString(2);

  return binary.padStart(hex.length * 4, '0');
};

export const filterOperations = (filterString: string): boolean[] => {
  const reverseFilterString = filterString.split('').reverse().join('');
  let paddedString: string = reverseFilterString;
  if (paddedString.length !== contractsList.length) {
    paddedString = reverseFilterString.padEnd(contractsList.length, '0');
  }
  const filteredContracts = contractsList.map((_contract, index) => {
    if (paddedString[index] === '1') {
      return true;
    }
    return false;
  });

  return filteredContracts;
};

export const utf8ToBase64 = (utf8String: string): string => {
  const encodedString = Buffer.from(utf8String, 'utf8').toString('base64');
  return encodedString;
};

export const base64ToUtf8 = (base64String: string): string => {
  const decodedString = Buffer.from(base64String, 'base64').toString('utf8');
  return decodedString;
};

export const hexToUtf8 = (hexString: string): string => {
  const utf8Character = decodeURIComponent(
    hexString.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'),
  );
  return utf8Character;
};

export const utf8ToHex = (utf8String: string): string => {
  const utf8encoder = new TextEncoder();
  const decimalValue = utf8encoder.encode(utf8String);
  let hexValue = '';
  for (let i = 0; i < decimalValue.length; i++) {
    hexValue += ('0' + decimalValue[i].toString(16)).slice(-2);
  }
  return hexValue;
};

export const publicKeyToAddress = (publicKey: string): string => {
  const words = bech32.toWords(Buffer.from(publicKey, 'hex'));
  const encodedPBK = bech32.encode('klv', words);
  return encodedPBK;
};

export const addressToPublicKey = (address: string): string => {
  const decode = bech32.decode(address);
  const publicKey = Buffer.from(bech32.fromWords(decode.words)).toString('hex');
  return publicKey;
};

export const formatNumberDecimal = (value: string): string => {
  // Remove any characters that are not digits
  const cleanNumber = value.replace(/\D/g, '');

  let formattedNumber = '';
  for (let i = 0; i < cleanNumber.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedNumber = ',' + formattedNumber;
    }
    formattedNumber =
      cleanNumber.charAt(cleanNumber.length - 1 - i) + formattedNumber;
  }

  return formattedNumber;
};
