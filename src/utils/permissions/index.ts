import {
  ContractsIndex,
  contractIndices,
  contractsList,
} from '@/types/contracts';

/**
 * Validates if a string is a valid hexadecimal value.
 * @param hex - String to validate
 * @returns True if valid hex string, false otherwise
 */
export const isValidHex = (hex: string): boolean => {
  if (!hex || typeof hex !== 'string') {
    return false;
  }
  return /^[0-9A-Fa-f]+$/g.test(hex);
};

/**
 * Validates if a string is a valid binary value.
 * @param binary - String to validate
 * @returns True if valid binary string, false otherwise
 */
export const isValidBinary = (binary: string): boolean => {
  if (!binary || typeof binary !== 'string') {
    return false;
  }
  return /^[01]+$/.test(binary);
};

/**
 * Inverts the byte order of a hex string (little-endian to big-endian or vice versa).
 * @param hex - Hex string to invert
 * @returns Hex string with inverted byte order
 * @example
 * invertBytes("0102") // "0201"
 * invertBytes("aabbccdd") // "ddccbbaa"
 */
export const invertBytes = (hex: string): string => {
  let newHex = '';
  for (let i = 0; i < hex.length; i += 2) {
    newHex = hex.slice(i, i + 2) + newHex;
  }
  return newHex;
};

/**
 * Converts a hexadecimal string to binary representation.
 * Uses BigInt internally to support values up to 64 bits.
 * @param hex - Hexadecimal string to convert
 * @returns Binary string representation, padded to match hex length * 4 bits
 * @example
 * hexToBinary("0f") // "00001111"
 * hexToBinary("ff") // "11111111"
 */
export const hexToBinary = (hex: string): string => {
  if (!isValidHex(hex)) {
    return '';
  }
  const binary = BigInt('0x' + hex).toString(2);
  return binary.padStart(hex.length * 4, '0');
};

/**
 * Converts a binary string to hexadecimal representation.
 * Uses BigInt internally to support values up to 64 bits.
 * @param binary - Binary string to convert
 * @returns Hexadecimal string representation, padded to even length
 * @example
 * binaryToHex("00001111") // "0f"
 * binaryToHex("11111111") // "ff"
 */
export const binaryToHex = (binary: string): string => {
  if (!isValidBinary(binary)) {
    return '';
  }
  const hex = BigInt(`0b${binary}`).toString(16);
  return hex.length % 2 !== 0 ? '0' + hex : hex;
};

/**
 * Converts a hex-encoded operations bitmask into a list of allowed contract type names.
 * Each bit position in the binary representation corresponds to a contract type index.
 * Handles byte inversion automatically (API returns little-endian format).
 * @param hexOperations - Hex string representing the permission bitmask (supports up to 64-bit values)
 * @param shouldInvertBytes - Whether to invert bytes before processing (default: true for API data)
 * @returns Array of contract type names that are enabled (bit set to 1)
 * @example
 * getEnabledContracts("0300000000000000") // ["Transfer", "Create Asset"]
 */
export const getEnabledContracts = (
  hexOperations: string,
  shouldInvertBytes = true,
): string[] => {
  if (!isValidHex(hexOperations)) {
    return [];
  }

  const processedHex = shouldInvertBytes
    ? invertBytes(hexOperations)
    : hexOperations;
  const binaryOperations = hexToBinary(processedHex);
  const enabledContracts: string[] = [];

  const reversedBinaryArray = binaryOperations.split('').reverse();
  reversedBinaryArray.forEach((char, index) => {
    if (char === '1' && ContractsIndex[index]) {
      enabledContracts.push(ContractsIndex[index]);
    }
  });

  return enabledContracts;
};

/**
 * Converts a hex-encoded operations bitmask into a boolean array parallel to contractsList.
 * Each element indicates whether the corresponding contract type is enabled.
 * Handles byte inversion automatically (API returns little-endian format).
 * @param hexOperations - Hex string representing the permission bitmask (supports up to 64-bit values)
 * @param shouldInvertBytes - Whether to invert bytes before processing (default: true for API data)
 * @returns Boolean array where each index corresponds to contractsList[index]
 * @example
 * getContractStates("0300000000000000") // [true, true, false, false, ...]
 */
export const getContractStates = (
  hexOperations: string,
  shouldInvertBytes = true,
): boolean[] => {
  if (!isValidHex(hexOperations)) {
    return contractsList.map(() => false);
  }

  const processedHex = shouldInvertBytes
    ? invertBytes(hexOperations)
    : hexOperations;
  const binaryOperations = hexToBinary(processedHex);

  const reversedBinary = binaryOperations.split('').reverse().join('');
  const maxIndex = 64;
  const paddedString = reversedBinary.padEnd(maxIndex, '0');

  return contractsList.map((_contract, arrayIndex) => {
    const actualIndex = contractIndices[arrayIndex];
    return paddedString[actualIndex] === '1';
  });
};

/**
 * Parses a hex-encoded operations bitmask and returns all relevant information.
 * Combines getEnabledContracts and getContractStates for convenience.
 * @param hexOperations - Hex string representing the permission bitmask
 * @param shouldInvertBytes - Whether to invert bytes before processing (default: true)
 * @returns Object containing binary representation, enabled contract names, and contract states
 */
export const parsePermissionOperations = (
  hexOperations: string,
  shouldInvertBytes = true,
): {
  binary: string;
  enabledContracts: string[];
  contractStates: boolean[];
} => {
  if (!isValidHex(hexOperations)) {
    return {
      binary: '',
      enabledContracts: [],
      contractStates: contractsList.map(() => false),
    };
  }

  const processedHex = shouldInvertBytes
    ? invertBytes(hexOperations)
    : hexOperations;

  return {
    binary: hexToBinary(processedHex),
    enabledContracts: getEnabledContracts(hexOperations, shouldInvertBytes),
    contractStates: getContractStates(hexOperations, shouldInvertBytes),
  };
};

/**
 * Converts a binary operations string to hex format for API submission.
 * Handles byte inversion automatically (API expects little-endian format).
 * Preserves the full byte length based on input binary string length.
 * @param binaryOperations - 64-character binary string representing enabled operations
 * @param shouldInvertBytes - Whether to invert bytes after conversion (default: true for API)
 * @returns Hex string ready for API submission (padded to correct byte length)
 * @example
 * binaryOperationsToHex("0000...0011") // "0300000000000000" (64-bit input -> 16 hex chars)
 */
export const binaryOperationsToHex = (
  binaryOperations: string,
  shouldInvertBytes = true,
): string => {
  if (!isValidBinary(binaryOperations)) {
    return '';
  }

  const hex = binaryToHex(binaryOperations);
  // Pad to preserve full byte length (4 bits per hex char)
  const expectedHexLength = Math.ceil(binaryOperations.length / 4);
  const paddedHex = hex.padStart(expectedHexLength, '0');

  return shouldInvertBytes ? invertBytes(paddedHex) : paddedHex;
};
