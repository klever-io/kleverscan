/**
 * ABI Encoding Tests
 *
 * Tests the encoding functions used by the SmartContract form and ContractRead/Write
 * to encode arguments for smart contract calls.
 *
 * These tests verify that encodeByType + bytesToHex produce correct hex-encoded output
 * for all supported ABI types (primitives, strings, BigUint, structs, enums, lists, options, etc.)
 */

// Polyfill TextEncoder/TextDecoder for jsdom environment
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import {
  encodeByType,
  bytesToHex,
  getJSType,
} from '@klever/connect-contracts';
import type { ContractABI } from '@klever/connect-contracts';

// Helper: encode a value and return hex string (mimics how kleverscan uses it)
const encodeToHex = (
  value: unknown,
  type: string,
  abi: ContractABI = { types: {} } as ContractABI,
  nested = false,
): string => {
  return bytesToHex(encodeByType(value, type, abi, nested));
};

describe('bytesToHex', () => {
  it('converts empty array to empty string', () => {
    expect(bytesToHex(new Uint8Array([]))).toBe('');
  });

  it('converts single byte', () => {
    expect(bytesToHex(new Uint8Array([0]))).toBe('00');
    expect(bytesToHex(new Uint8Array([255]))).toBe('ff');
    expect(bytesToHex(new Uint8Array([42]))).toBe('2a');
  });

  it('converts multiple bytes', () => {
    expect(bytesToHex(new Uint8Array([15, 66, 64]))).toBe('0f4240');
    expect(bytesToHex(new Uint8Array([1, 2, 3, 4]))).toBe('01020304');
  });
});

describe('encodeByType - unsigned integers (top-level, nested=false)', () => {
  it('encodes u8 values', () => {
    expect(encodeToHex(0, 'u8')).toBe('00');
    expect(encodeToHex(1, 'u8')).toBe('01');
    expect(encodeToHex(255, 'u8')).toBe('ff');
    expect(encodeToHex(42, 'u8')).toBe('2a');
  });

  it('encodes u8 from string', () => {
    expect(encodeToHex('0', 'u8')).toBe('00');
    expect(encodeToHex('255', 'u8')).toBe('ff');
    expect(encodeToHex('100', 'u8')).toBe('64');
  });

  it('encodes u16 values (leading zeros trimmed)', () => {
    expect(encodeToHex(0, 'u16')).toBe('00');
    expect(encodeToHex(1, 'u16')).toBe('01');
    expect(encodeToHex(256, 'u16')).toBe('0100');
    expect(encodeToHex(1000, 'u16')).toBe('03e8');
    expect(encodeToHex(65535, 'u16')).toBe('ffff');
  });

  it('encodes u32 values (leading zeros trimmed)', () => {
    expect(encodeToHex(0, 'u32')).toBe('00');
    expect(encodeToHex(1, 'u32')).toBe('01');
    expect(encodeToHex(1000000, 'u32')).toBe('0f4240');
    expect(encodeToHex(4294967295, 'u32')).toBe('ffffffff');
  });

  it('encodes u64 values (leading zeros trimmed)', () => {
    expect(encodeToHex(0, 'u64')).toBe('00');
    expect(encodeToHex(1, 'u64')).toBe('01');
    expect(encodeToHex(1000000, 'u64')).toBe('0f4240');
    expect(encodeToHex('1000000000000', 'u64')).toBe('e8d4a51000');
  });

  it('encodes u64 from string', () => {
    expect(encodeToHex('0', 'u64')).toBe('00');
    expect(encodeToHex('18446744073709551615', 'u64')).toBe('ffffffffffffffff');
  });
});

describe('encodeByType - unsigned integers (nested=true, fixed-size)', () => {
  it('encodes u8 nested as fixed 1 byte', () => {
    expect(encodeToHex(0, 'u8', undefined as any, true)).toBe('00');
    expect(encodeToHex(42, 'u8', undefined as any, true)).toBe('2a');
    expect(encodeToHex(255, 'u8', undefined as any, true)).toBe('ff');
  });

  it('encodes u16 nested as fixed 2 bytes', () => {
    const abi = { types: {} } as ContractABI;
    expect(encodeToHex(0, 'u16', abi, true)).toBe('0000');
    expect(encodeToHex(1, 'u16', abi, true)).toBe('0001');
    expect(encodeToHex(256, 'u16', abi, true)).toBe('0100');
    expect(encodeToHex(65535, 'u16', abi, true)).toBe('ffff');
  });

  it('encodes u32 nested as fixed 4 bytes', () => {
    const abi = { types: {} } as ContractABI;
    expect(encodeToHex(0, 'u32', abi, true)).toBe('00000000');
    expect(encodeToHex(1, 'u32', abi, true)).toBe('00000001');
    expect(encodeToHex(1000000, 'u32', abi, true)).toBe('000f4240');
  });

  it('encodes u64 nested as fixed 8 bytes', () => {
    const abi = { types: {} } as ContractABI;
    expect(encodeToHex(0, 'u64', abi, true)).toBe('0000000000000000');
    expect(encodeToHex(1, 'u64', abi, true)).toBe('0000000000000001');
    expect(encodeToHex(1000000, 'u64', abi, true)).toBe('00000000000f4240');
  });
});

describe('encodeByType - signed integers', () => {
  it('encodes i8 positive', () => {
    expect(encodeToHex(0, 'i8')).toBe('00');
    expect(encodeToHex(127, 'i8')).toBe('7f');
  });

  it('encodes i8 negative (two\'s complement)', () => {
    expect(encodeToHex(-1, 'i8')).toBe('ff');
    expect(encodeToHex(-128, 'i8')).toBe('80');
  });

  it('encodes i32 positive', () => {
    expect(encodeToHex(0, 'i32')).toBe('00');
    expect(encodeToHex(1, 'i32')).toBe('01');
    expect(encodeToHex(100, 'i32')).toBe('64');
  });

  it('encodes i32 negative', () => {
    expect(encodeToHex(-1, 'i32')).toBe('ffffffff');
    expect(encodeToHex(-100, 'i32')).toBe('ffffff9c');
  });

  it('encodes i64 positive', () => {
    expect(encodeToHex(0, 'i64')).toBe('00');
    expect(encodeToHex(1, 'i64')).toBe('01');
  });

  it('encodes i64 negative', () => {
    expect(encodeToHex(-1, 'i64')).toBe('ffffffffffffffff');
  });
});

describe('encodeByType - bool', () => {
  it('encodes true as 01', () => {
    expect(encodeToHex(true, 'bool')).toBe('01');
  });

  it('encodes false as 00', () => {
    expect(encodeToHex(false, 'bool')).toBe('00');
  });
});

describe('encodeByType - BigUint', () => {
  it('encodes zero', () => {
    expect(encodeToHex(0, 'BigUint')).toBe('00');
    expect(encodeToHex('0', 'BigUint')).toBe('00');
  });

  it('encodes small values', () => {
    expect(encodeToHex(1, 'BigUint')).toBe('01');
    expect(encodeToHex(255, 'BigUint')).toBe('ff');
    expect(encodeToHex(256, 'BigUint')).toBe('0100');
  });

  it('encodes large values from string', () => {
    expect(encodeToHex('1000000', 'BigUint')).toBe('0f4240');
    expect(encodeToHex('1000000000000000000', 'BigUint')).toBe('0de0b6b3a7640000');
  });

  it('encodes BigUint nested with 4-byte length prefix', () => {
    const abi = { types: {} } as ContractABI;
    // 0 nested: length=1, data=0x00
    expect(encodeToHex(0, 'BigUint', abi, true)).toBe('0000000100');
    // 1 nested: length=1, data=0x01
    expect(encodeToHex(1, 'BigUint', abi, true)).toBe('0000000101');
    // 256 nested: length=2, data=0x0100
    expect(encodeToHex(256, 'BigUint', abi, true)).toBe('000000020100');
    // 1000000 nested: length=3, data=0x0f4240
    expect(encodeToHex(1000000, 'BigUint', abi, true)).toBe('000000030f4240');
  });
});

describe('encodeByType - strings and TokenIdentifier', () => {
  it('encodes string top-level (no length prefix)', () => {
    // "Hello" = 48 65 6c 6c 6f
    expect(encodeToHex('Hello', 'utf-8 string')).toBe('48656c6c6f');
  });

  it('encodes empty string', () => {
    expect(encodeToHex('', 'utf-8 string')).toBe('');
  });

  it('encodes TokenIdentifier top-level', () => {
    // "KLV" = 4b 4c 56
    expect(encodeToHex('KLV', 'TokenIdentifier')).toBe('4b4c56');
  });

  it('encodes string nested with 4-byte length prefix', () => {
    const abi = { types: {} } as ContractABI;
    // "Hi" = 48 69, length = 2
    expect(encodeToHex('Hi', 'utf-8 string', abi, true)).toBe('000000024869');
    // "KLV" nested, length = 3
    expect(encodeToHex('KLV', 'TokenIdentifier', abi, true)).toBe('000000034b4c56');
  });
});

describe('encodeByType - Option<T>', () => {
  it('encodes None (null) as 00', () => {
    const abi = { types: {} } as ContractABI;
    expect(encodeToHex(null, 'Option<u64>', abi)).toBe('00');
    expect(encodeToHex(undefined, 'Option<u64>', abi)).toBe('00');
  });

  it('encodes Some(value) as 01 + encoded value', () => {
    const abi = { types: {} } as ContractABI;
    // Some(42) for Option<u64>: 01 + encodeByType(42, 'u64', abi, nested=true)
    // nested u64 is fixed 8 bytes: 000000000000002a
    expect(encodeToHex(42, 'Option<u64>', abi)).toBe('01000000000000002a');
  });

  it('encodes Option<bool>', () => {
    const abi = { types: {} } as ContractABI;
    expect(encodeToHex(null, 'Option<bool>', abi)).toBe('00');
    expect(encodeToHex(true, 'Option<bool>', abi)).toBe('0101');
    expect(encodeToHex(false, 'Option<bool>', abi)).toBe('0100');
  });
});

describe('encodeByType - List<T>', () => {
  it('encodes empty list', () => {
    const abi = { types: {} } as ContractABI;
    // count = 0 (4 bytes)
    expect(encodeToHex([], 'List<u32>', abi)).toBe('00000000');
  });

  it('encodes list of u32 values', () => {
    const abi = { types: {} } as ContractABI;
    // count=3 (00000003), then each u32 nested (fixed 4 bytes)
    // [1, 2, 3] => 00000003 00000001 00000002 00000003
    expect(encodeToHex([1, 2, 3], 'List<u32>', abi)).toBe(
      '00000003000000010000000200000003',
    );
  });

  it('encodes list of u8 values', () => {
    const abi = { types: {} } as ContractABI;
    // count=2, then each u8 nested (fixed 1 byte)
    // [10, 20] => 00000002 0a 14
    expect(encodeToHex([10, 20], 'List<u8>', abi)).toBe('000000020a14');
  });
});

describe('encodeByType - structs', () => {
  it('encodes a simple struct', () => {
    const abi = {
      types: {
        MyStruct: {
          type: 'struct',
          fields: [
            { name: 'amount', type: 'u32' },
            { name: 'flag', type: 'bool' },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    // struct fields are encoded nested:
    // amount=100 as nested u32 (4 bytes): 00000064
    // flag=true as bool (1 byte): 01
    const result = encodeToHex({ amount: 100, flag: true }, 'MyStruct', abi);
    expect(result).toBe('0000006401');
  });

  it('encodes struct with BigUint field', () => {
    const abi = {
      types: {
        TokenInfo: {
          type: 'struct',
          fields: [
            { name: 'id', type: 'u32' },
            { name: 'value', type: 'BigUint' },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    // id=1 nested u32: 00000001
    // value=1000000 nested BigUint: length(3)=00000003 + 0f4240
    const result = encodeToHex({ id: 1, value: 1000000 }, 'TokenInfo', abi);
    expect(result).toBe('00000001000000030f4240');
  });

  it('encodes struct with string field', () => {
    const abi = {
      types: {
        NamedValue: {
          type: 'struct',
          fields: [
            { name: 'name', type: 'utf-8 string' },
            { name: 'count', type: 'u8' },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    // name="AB" nested string: length(2)=00000002 + 4142
    // count=5 nested u8: 05
    const result = encodeToHex({ name: 'AB', count: 5 }, 'NamedValue', abi);
    expect(result).toBe('00000002414205');
  });
});

describe('encodeByType - enums', () => {
  it('encodes enum by discriminant number', () => {
    const abi = {
      types: {
        Status: {
          type: 'enum',
          variants: [
            { name: 'Active', discriminant: 0 },
            { name: 'Paused', discriminant: 1 },
            { name: 'Stopped', discriminant: 2 },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    expect(encodeToHex(0, 'Status', abi)).toBe('00');
    expect(encodeToHex(1, 'Status', abi)).toBe('01');
    expect(encodeToHex(2, 'Status', abi)).toBe('02');
  });

  it('encodes enum by variant name', () => {
    const abi = {
      types: {
        Status: {
          type: 'enum',
          variants: [
            { name: 'Active', discriminant: 0 },
            { name: 'Paused', discriminant: 1 },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    expect(encodeToHex('Active', 'Status', abi)).toBe('00');
    expect(encodeToHex('Paused', 'Status', abi)).toBe('01');
  });

  it('encodes enum by discriminant as string', () => {
    const abi = {
      types: {
        Status: {
          type: 'enum',
          variants: [
            { name: 'Active', discriminant: 0 },
            { name: 'Paused', discriminant: 1 },
          ],
        },
      },
      endpoints: [],
      constructor: { inputs: [], outputs: [] },
      name: 'test',
    } as unknown as ContractABI;

    expect(encodeToHex('0', 'Status', abi)).toBe('00');
    expect(encodeToHex('1', 'Status', abi)).toBe('01');
  });
});

describe('getJSType - type mapping', () => {
  it('maps numeric types to number', () => {
    expect(getJSType('u8')).toBe('number');
    expect(getJSType('u16')).toBe('number');
    expect(getJSType('u32')).toBe('number');
    expect(getJSType('u64')).toBe('number');
    expect(getJSType('i8')).toBe('number');
    expect(getJSType('i16')).toBe('number');
    expect(getJSType('i32')).toBe('number');
    expect(getJSType('i64')).toBe('number');
    expect(getJSType('BigUint')).toBe('number');
    expect(getJSType('BigInt')).toBe('number');
  });

  it('maps bool to checkbox', () => {
    expect(getJSType('bool')).toBe('checkbox');
  });

  it('maps string-like types to string', () => {
    expect(getJSType('Address')).toBe('string');
    expect(getJSType('ManagedBuffer')).toBe('string');
    expect(getJSType('TokenIdentifier')).toBe('string');
    expect(getJSType('String')).toBe('string');
    expect(getJSType('&str')).toBe('string');
    expect(getJSType('BoxedBytes')).toBe('string');
    expect(getJSType('bytes')).toBe('string');
  });

  it('maps list types to array', () => {
    expect(getJSType('List<u32>')).toBe('array');
    // Vec<u8> is mapped to 'string' (byte array), Vec<T> for other T stays as-is
    expect(getJSType('Vec<u8>')).toBe('string');
  });

  it('maps Option types by unwrapping inner', () => {
    expect(getJSType('Option<u64>')).toBe('number');
    expect(getJSType('Option<bool>')).toBe('checkbox');
    expect(getJSType('Option<Address>')).toBe('string');
  });

  it('returns the type itself for unknown/custom types', () => {
    expect(getJSType('MyCustomStruct')).toBe('MyCustomStruct');
  });
});

describe('encodeByType - error handling', () => {
  it('throws on unsupported type', () => {
    const abi = { types: {} } as ContractABI;
    expect(() => encodeByType('test', 'UnknownType', abi)).toThrow();
  });

  it('throws on invalid u8 value', () => {
    expect(() => encodeToHex(256, 'u8')).toThrow();
    expect(() => encodeToHex(-1, 'u8')).toThrow();
  });

  it('throws on invalid u16 value', () => {
    expect(() => encodeToHex(65536, 'u16')).toThrow();
    expect(() => encodeToHex(-1, 'u16')).toThrow();
  });

  it('throws on non-numeric string for number type', () => {
    expect(() => encodeToHex('abc', 'u32')).toThrow();
  });
});

describe('encoding round-trip consistency', () => {
  it('produces consistent output for same input regardless of input type', () => {
    // Number 100 should produce the same result whether passed as number or string
    expect(encodeToHex(100, 'u32')).toBe(encodeToHex('100', 'u32'));
    expect(encodeToHex(100, 'u64')).toBe(encodeToHex('100', 'u64'));
    expect(encodeToHex(100, 'BigUint')).toBe(encodeToHex('100', 'BigUint'));
  });

  it('nested encoding always produces fixed-size for fixed types', () => {
    const abi = { types: {} } as ContractABI;
    // u32 nested is always 4 bytes
    expect(encodeToHex(0, 'u32', abi, true)).toHaveLength(8); // 4 bytes = 8 hex chars
    expect(encodeToHex(1, 'u32', abi, true)).toHaveLength(8);
    expect(encodeToHex(4294967295, 'u32', abi, true)).toHaveLength(8);

    // u64 nested is always 8 bytes
    expect(encodeToHex(0, 'u64', abi, true)).toHaveLength(16); // 8 bytes = 16 hex chars
    expect(encodeToHex(1, 'u64', abi, true)).toHaveLength(16);
  });
});
