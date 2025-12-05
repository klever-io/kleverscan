import {
  isValidHex,
  isValidBinary,
  invertBytes,
  hexToBinary,
  binaryToHex,
  getEnabledContracts,
  getContractStates,
  parsePermissionOperations,
  binaryOperationsToHex,
} from './index';

describe('Permission Utils', () => {
  describe('isValidHex', () => {
    it('should return true for valid hex strings', () => {
      expect(isValidHex('0f')).toBe(true);
      expect(isValidHex('FF')).toBe(true);
      expect(isValidHex('0123456789abcdef')).toBe(true);
      expect(isValidHex('ABCDEF')).toBe(true);
    });

    it('should return false for invalid hex strings', () => {
      expect(isValidHex('')).toBe(false);
      expect(isValidHex('0g')).toBe(false);
      expect(isValidHex('xyz')).toBe(false);
      expect(isValidHex(null as unknown as string)).toBe(false);
      expect(isValidHex(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidBinary', () => {
    it('should return true for valid binary strings', () => {
      expect(isValidBinary('0')).toBe(true);
      expect(isValidBinary('1')).toBe(true);
      expect(isValidBinary('01010101')).toBe(true);
      expect(isValidBinary('1111111100000000')).toBe(true);
    });

    it('should return false for invalid binary strings', () => {
      expect(isValidBinary('')).toBe(false);
      expect(isValidBinary('2')).toBe(false);
      expect(isValidBinary('012')).toBe(false);
      expect(isValidBinary(null as unknown as string)).toBe(false);
      expect(isValidBinary(undefined as unknown as string)).toBe(false);
    });
  });

  describe('invertBytes', () => {
    it('should invert byte order correctly', () => {
      expect(invertBytes('0102')).toBe('0201');
      expect(invertBytes('aabbccdd')).toBe('ddccbbaa');
      expect(invertBytes('ff')).toBe('ff');
      expect(invertBytes('0300000000000000')).toBe('0000000000000003');
    });

    it('should handle empty string', () => {
      expect(invertBytes('')).toBe('');
    });

    it('should handle single byte', () => {
      expect(invertBytes('ab')).toBe('ab');
    });
  });

  describe('hexToBinary', () => {
    it('should convert hex to binary correctly', () => {
      expect(hexToBinary('0f')).toBe('00001111');
      expect(hexToBinary('ff')).toBe('11111111');
      expect(hexToBinary('00')).toBe('00000000');
      expect(hexToBinary('01')).toBe('00000001');
    });

    it('should handle large 64-bit values (BigInt)', () => {
      // 0x8000000000000000 = 2^63
      expect(hexToBinary('8000000000000000')).toBe(
        '1000000000000000000000000000000000000000000000000000000000000000',
      );
    });

    it('should return empty string for invalid hex', () => {
      expect(hexToBinary('')).toBe('');
      expect(hexToBinary('gg')).toBe('');
      expect(hexToBinary('xyz')).toBe('');
    });

    it('should pad binary to match hex length * 4', () => {
      expect(hexToBinary('0001')).toBe('0000000000000001');
      expect(hexToBinary('0000')).toBe('0000000000000000');
    });
  });

  describe('binaryToHex', () => {
    it('should convert binary to hex correctly', () => {
      expect(binaryToHex('00001111')).toBe('0f');
      expect(binaryToHex('11111111')).toBe('ff');
      expect(binaryToHex('00000000')).toBe('00');
      expect(binaryToHex('00000001')).toBe('01');
    });

    it('should handle large 64-bit values (BigInt)', () => {
      // 2^63 in binary
      const binary63bit =
        '1000000000000000000000000000000000000000000000000000000000000000';
      expect(binaryToHex(binary63bit)).toBe('8000000000000000');
    });

    it('should return empty string for invalid binary', () => {
      expect(binaryToHex('')).toBe('');
      expect(binaryToHex('012')).toBe('');
      expect(binaryToHex('abc')).toBe('');
    });

    it('should pad hex to even length', () => {
      expect(binaryToHex('1')).toBe('01');
      expect(binaryToHex('111')).toBe('07');
    });
  });

  describe('hexToBinary and binaryToHex roundtrip', () => {
    it('should roundtrip correctly for various values', () => {
      const testCases = ['0f', 'ff', '00', 'abcd', '0123456789abcdef'];
      testCases.forEach(hex => {
        const binary = hexToBinary(hex);
        const backToHex = binaryToHex(binary);
        expect(backToHex).toBe(hex);
      });
    });

    it('should roundtrip correctly for 64-bit values', () => {
      const hex64bit = 'ffffffffffffffff';
      const binary = hexToBinary(hex64bit);
      const backToHex = binaryToHex(binary);
      expect(backToHex).toBe(hex64bit);
    });
  });

  describe('getEnabledContracts', () => {
    it('should return enabled contracts from hex operations', () => {
      // 0x03 with bytes inverted = first 2 contracts enabled
      const result = getEnabledContracts('0300000000000000');
      expect(result).toContain('Transfer');
      expect(result).toContain('Create Asset');
    });

    it('should return empty array for invalid hex', () => {
      expect(getEnabledContracts('')).toEqual([]);
      expect(getEnabledContracts('xyz')).toEqual([]);
    });

    it('should handle shouldInvertBytes parameter', () => {
      // Without byte inversion
      const withoutInvert = getEnabledContracts('03', false);
      expect(withoutInvert).toContain('Transfer');
      expect(withoutInvert).toContain('Create Asset');
    });
  });

  describe('getContractStates', () => {
    it('should return boolean array for contract states', () => {
      const result = getContractStates('0300000000000000');
      expect(result[0]).toBe(true); // Transfer
      expect(result[1]).toBe(true); // Create Asset
      expect(result[2]).toBe(false); // Create Validator
    });

    it('should return all false for invalid hex', () => {
      const result = getContractStates('');
      expect(result.every(state => state === false)).toBe(true);
    });

    it('should handle shouldInvertBytes parameter', () => {
      const result = getContractStates('03', false);
      expect(result[0]).toBe(true);
      expect(result[1]).toBe(true);
    });
  });

  describe('parsePermissionOperations', () => {
    it('should return all permission data', () => {
      const result = parsePermissionOperations('0300000000000000');
      expect(result.binary).toBeTruthy();
      expect(result.enabledContracts.length).toBeGreaterThan(0);
      expect(result.contractStates.length).toBeGreaterThan(0);
    });

    it('should return empty data for invalid hex', () => {
      const result = parsePermissionOperations('');
      expect(result.binary).toBe('');
      expect(result.enabledContracts).toEqual([]);
      expect(result.contractStates.every(s => !s)).toBe(true);
    });
  });

  describe('binaryOperationsToHex', () => {
    it('should convert binary operations to hex', () => {
      const binary64 =
        '0000000000000000000000000000000000000000000000000000000000000011';
      const result = binaryOperationsToHex(binary64);
      expect(result).toBe('0300000000000000');
    });

    it('should return empty string for invalid binary', () => {
      expect(binaryOperationsToHex('')).toBe('');
      expect(binaryOperationsToHex('abc')).toBe('');
    });

    it('should handle shouldInvertBytes parameter', () => {
      // Use 16-bit binary (2 bytes) so inversion makes a difference
      const binary = '0000000000000011'; // 16 bits -> "0003" hex
      const withInvert = binaryOperationsToHex(binary, true);
      const withoutInvert = binaryOperationsToHex(binary, false);
      expect(withoutInvert).toBe('0003');
      expect(withInvert).toBe('0300'); // bytes inverted
      expect(withInvert).not.toBe(withoutInvert);
    });
  });

  describe('Round-trip encoding/decoding', () => {
    it('should encode and decode specific contracts correctly', () => {
      /**
       * Test contracts:
       * - Transfer (0)
       * - Create Validator (2)
       * - Config Validator (3)
       * - Freeze (4)
       * - Delegate (6)
       * - Undelegate (7)
       * - Claim (9)
       * - Unjail (10)
       * - Smart Contract (63)
       */
      const expectedContracts = [
        'Transfer',
        'Create Validator',
        'Config Validator',
        'Freeze',
        'Delegate',
        'Undelegate',
        'Claim',
        'Unjail',
        'Smart Contract',
      ];

      // Bits to set: 0, 2, 3, 4, 6, 7, 9, 10, 63
      // Binary string: bit 63 at position 0, bit 0 at position 63
      // Pattern: 1 + (52 zeros) + 11011011101
      const binaryOperations =
        '1' +
        '0'.repeat(52) +
        '1' + // bit 10
        '1' + // bit 9
        '0' + // bit 8
        '1' + // bit 7
        '1' + // bit 6
        '0' + // bit 5
        '1' + // bit 4
        '1' + // bit 3
        '1' + // bit 2
        '0' + // bit 1
        '1'; // bit 0

      expect(binaryOperations.length).toBe(64);

      // Expected hex values:
      // Big-endian: 0x800000000006DD (bit 63 + bits 0,2,3,4,6,7,9,10 = 0x6DD)
      // Little-endian (with inversion): dd06000000000080
      const expectedHexWithInversion = 'dd06000000000080';
      const expectedHexWithoutInversion = '800000000006dd';

      // Test encoding
      const hexWithInversion = binaryOperationsToHex(binaryOperations, true);
      const hexWithoutInversion = binaryOperationsToHex(binaryOperations, false);

      expect(hexWithInversion).toBe(expectedHexWithInversion);
      expect(hexWithoutInversion).toBe(expectedHexWithoutInversion);

      // Test decoding - should get back the same contracts
      const decodedContracts = getEnabledContracts(hexWithInversion, true);

      expect(decodedContracts).toHaveLength(expectedContracts.length);
      expectedContracts.forEach(contract => {
        expect(decodedContracts).toContain(contract);
      });

      // Verify no extra contracts are included
      decodedContracts.forEach(contract => {
        expect(expectedContracts).toContain(contract);
      });
    });

    it('should handle all contracts enabled (max permissions)', () => {
      // All bits set except unused ones
      const allEnabled = '1'.repeat(64);
      const hex = binaryOperationsToHex(allEnabled, true);

      // Decode and verify we get all contracts
      const decoded = getEnabledContracts(hex, true);

      // Should include at least Transfer, Create Asset, and Smart Contract
      expect(decoded).toContain('Transfer');
      expect(decoded).toContain('Create Asset');
      expect(decoded).toContain('Smart Contract');
    });

    it('should handle no contracts enabled', () => {
      const noneEnabled = '0'.repeat(64);
      const hex = binaryOperationsToHex(noneEnabled, true);

      expect(hex).toBe('0'.repeat(16)); // All zeros

      const decoded = getEnabledContracts(hex, true);
      expect(decoded).toHaveLength(0);
    });
  });
});
