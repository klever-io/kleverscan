import { TextDecoder, TextEncoder } from 'util';
import {
  bytesToHex,
  encodeByType,
  getJSType,
} from '@klever/connect-contracts';
import type { ContractABI } from '@klever/connect-contracts';

Object.assign(global, { TextEncoder, TextDecoder });

const emptyAbi = { types: {} } as ContractABI;

const encodeToHex = (
  value: unknown,
  type: string,
  abi: ContractABI = emptyAbi,
  nested = false,
): string => bytesToHex(encodeByType(value, type, abi, nested));

jest.mock('react-syntax-highlighter', () => ({}), { virtual: true });
jest.mock('react-syntax-highlighter/dist/cjs/prism-light', () => ({}), {
  virtual: true,
});
jest.mock('@/contexts/contract/multicontract', () => ({
  useMulticontract: jest.fn(() => ({ metadata: '', setMetadata: jest.fn() })),
}));
jest.mock('@/contexts/contract', () => ({
  useContract: jest.fn(() => ({
    payload: null,
    formSend: jest.fn(),
    resetFormsData: jest.fn(),
  })),
}));
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    handleSubmit: jest.fn(),
    watch: jest.fn(),
    getValues: jest.fn(),
  })),
  useFieldArray: jest.fn(() => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
    replace: jest.fn(),
  })),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));
jest.mock('next/dynamic', () => () => () => null);
jest.mock('@/utils/hooks', () => ({
  useDidUpdateEffect: jest.fn(),
}));
jest.mock('@/utils/networkFunctions', () => ({
  getNetwork: jest.fn(() => 'mainnet'),
}));
jest.mock(
  '@klever/sdk-web',
  () => {
    const contracts = jest.requireActual('@klever/connect-contracts');
    const emptySdkAbi = { types: {} };

    return {
      abiEncoder: {
        encodeABIValue: (
          value: unknown,
          type: string,
          nested = false,
        ): string => {
          try {
            return contracts.bytesToHex(
              contracts.encodeByType(value, type, emptySdkAbi, nested),
            );
          } catch {
            return '';
          }
        },
        encodeLengthPlusData: (value: string | string[], _innerType: string) => {
          if (Array.isArray(value)) {
            return value.length.toString(16).padStart(8, '0') + value.join('');
          }

          const bytes = new TextEncoder().encode(String(value));
          return (
            bytes.length.toString(16).padStart(8, '0') +
            contracts.bytesToHex(bytes)
          );
        },
      },
      utils: {
        getJSType: (type: string) => contracts.getJSType(type),
      },
    };
  },
  { virtual: true },
);

import { parseArgument } from '../index';
import type { ABIMap } from '../index';

describe('parseArgument', () => {
  it('encodes primitive values', () => {
    expect(parseArgument(100, 'u64', null)).toBe(encodeToHex(100, 'u64'));
    expect(parseArgument(42, 'u32', null)).toBe(encodeToHex(42, 'u32'));
    expect(parseArgument(5, 'u8', null)).toBe(encodeToHex(5, 'u8'));
    expect(parseArgument(1000000, 'BigUint', null)).toBe(
      encodeToHex(1000000, 'BigUint'),
    );
    expect(parseArgument('KLV', 'TokenIdentifier', null)).toBe(
      encodeToHex('KLV', 'TokenIdentifier'),
    );
    expect(parseArgument(true, 'bool', null)).toBe('01');
  });

  it('returns empty string for invalid primitive values', () => {
    expect(parseArgument(NaN, 'u64', null)).toBe('');
    expect(parseArgument(null, 'u64', null)).toBe('');
    expect(parseArgument(undefined, 'u64', null)).toBe('');
  });

  it('encodes Option<T> values with a single option prefix', () => {
    expect(parseArgument(42, 'Option<u64>', null)).toBe(
      `01${encodeToHex(42, 'u64', emptyAbi, true)}`,
    );
    expect(parseArgument(false, 'Option<bool>', null)).toBe('0100');
    expect(parseArgument(null, 'Option<u64>', null)).toBe('');
  });

  it('encodes structs from JSON input', () => {
    const abi = {
      types: {
        MyStruct: {
          type: 'struct',
          fields: [
            { name: 'amount', type: 'u64' },
            { name: 'flag', type: 'bool' },
          ],
        },
      },
    } as ABIMap;

    expect(
      parseArgument(
        JSON.stringify({ amount: 100, flag: true }),
        'MyStruct',
        abi,
        'object',
      ),
    ).toBe(
      encodeToHex(
        { amount: 100, flag: true },
        'MyStruct',
        abi as ContractABI,
      ),
    );
  });

  it('returns empty string for invalid struct input or missing ABI context', () => {
    const abi = {
      types: {
        MyStruct: {
          type: 'struct',
          fields: [{ name: 'amount', type: 'u64' }],
        },
      },
    } as ABIMap;

    expect(parseArgument('not json', 'MyStruct', abi, 'object')).toBe('');
    expect(parseArgument('{}', 'MyStruct', null, 'object')).toBe('');
  });

  it('encodes list arguments from JSON input', () => {
    expect(parseArgument(JSON.stringify([1, 2, 3]), 'List<u64>', emptyAbi as ABIMap, 'array')).toBe(
      encodeToHex([1, 2, 3], 'List<u64>'),
    );
    expect(
      parseArgument(
        JSON.stringify([1, 2]),
        'Option<List<u64>>',
        emptyAbi as ABIMap,
        'array',
      ),
    ).toBe(`01${encodeToHex([1, 2], 'List<u64>')}`);
  });

  it('returns empty string for invalid or empty list input', () => {
    expect(parseArgument('not an array', 'List<u64>', emptyAbi as ABIMap, 'array')).toBe('');
    expect(parseArgument('[]', 'List<u64>', emptyAbi as ABIMap, 'array')).toBe('');
    expect(
      parseArgument('{"amount":1}', 'List<u64>', emptyAbi as ABIMap, 'array'),
    ).toBe('');
  });

  it('maps enum inputs to their numeric discriminant encoding', () => {
    const abi = {
      types: {
        MyEnum: {
          type: 'enum',
          variants: [{ name: 'Ready', discriminant: 0, fields: [] }],
        },
      },
    } as ABIMap;

    expect(parseArgument(0, 'MyEnum', abi, 'MyEnum')).toBe('00');
  });

  it('preserves zero values and empty string encodings', () => {
    expect(parseArgument(0, 'u64', null)).toBe('00');
    expect(parseArgument('', 'TokenIdentifier', null)).toBe('');
  });

  it('keeps getJSType expectations aligned with the ABI helpers in use', () => {
    expect(getJSType('u64')).toBe('number');
    expect(getJSType('bool')).toBe('checkbox');
    expect(getJSType('List<u64>')).toBe('array');
    expect(getJSType('Option<Address>')).toBe('string');
  });
});
