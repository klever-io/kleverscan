import React, { useState } from 'react';
import { cleanHex, hexToUtf8 } from '@/utils/hex';
import {
  Cell,
  DataCell,
  Empty,
  FormatSelect,
  HeaderRow,
  Mono,
  Row,
  Table,
  TopicCell,
} from './styles';

// A single smart-contract log event. Klever/MultiversX put the return value in a
// "ReturnData" event, with the payload split across `topics` and `data` as hex.
export interface ILogEvent {
  address?: string;
  identifier: string;
  topics?: (string | null)[];
  data?: (string | null)[];
  order?: number;
}

const RETURN_DATA_IDENTIFIER = 'ReturnData';

type ValueFormat = 'hex' | 'string' | 'number';

// Signed ABI integer types are encoded as two's-complement, so they must be
// sign-extended before rendering — an unsigned BigInt read would turn negative
// values into large positives.
const SIGNED_INT_TYPE = /^(bigint|i8|i16|i32|i64|isize)$/;

const isSignedType = (abiType?: string): boolean =>
  !!abiType && SIGNED_INT_TYPE.test(abiType.toLowerCase());

// Decode a hex value as a decimal integer, interpreting it as two's-complement
// (over its actual byte width) when the ABI type is signed.
const hexToDecimal = (hex: string, signed: boolean): string => {
  const value = BigInt(`0x${hex}`);
  if (!signed) return value.toString(10);
  const one = BigInt(1);
  const bits = BigInt(hex.length * 4);
  const signBit = one << (bits - one);
  return (value >= signBit ? value - (one << bits) : value).toString(10);
};

const formatValue = (
  hex: string,
  format: ValueFormat,
  abiType?: string,
): string => {
  if (hex === '') return '';
  switch (format) {
    case 'string':
      return hexToUtf8(hex);
    case 'number':
      try {
        return hexToDecimal(hex, isSignedType(abiType));
      } catch {
        return hex;
      }
    case 'hex':
    default:
      return hex;
  }
};

// Pick a sensible default visualization from an ABI type when one is available.
const inferFormat = (abiType?: string): ValueFormat => {
  if (!abiType) return 'hex';
  const t = abiType.toLowerCase();
  if (/^(biguint|bigint|u8|u16|u32|u64|usize|i8|i16|i32|i64|isize)$/.test(t)) {
    return 'number';
  }
  if (/tokenidentifier|managedbuffer|boxedbytes|bytes|utf-8|string/.test(t)) {
    return 'string';
  }
  return 'hex';
};

// True when the events include a ReturnData event that carries a value to show.
export const hasReturnData = (events?: ILogEvent[] | null): boolean =>
  (events ?? []).some(
    e =>
      e.identifier === RETURN_DATA_IDENTIFIER &&
      [...(e.topics ?? []), ...(e.data ?? [])].some(v => cleanHex(v) !== ''),
  );

// A single value with a dropdown to switch its visualization (hex/string/number).
const ValueCell: React.FC<{ value: string; abiType?: string }> = ({
  value,
  abiType,
}) => {
  const [format, setFormat] = useState<ValueFormat>(inferFormat(abiType));
  const hex = cleanHex(value);
  if (hex === '') return <Empty>—</Empty>;
  return (
    <Cell>
      <Mono>{formatValue(hex, format, abiType)}</Mono>
      <FormatSelect
        aria-label="Display format"
        value={format}
        onChange={e => setFormat(e.target.value as ValueFormat)}
      >
        <option value="hex">Hex</option>
        <option value="string">String</option>
        <option value="number">Number</option>
      </FormatSelect>
    </Cell>
  );
};

interface ReturnDataProps {
  events?: ILogEvent[] | null;
  // ABI output types (data[i] ↔ outputTypes[i]) used to infer each data value's
  // default visualization. Optional — the generic transaction page has no ABI.
  outputTypes?: string[];
}

// ReturnData renders only the contract's ReturnData events, one row per index as
// Topic[i] | Data[i] (framework events like totalConsumedGas/completedTxEvent are
// excluded). Each value has a dropdown to switch how it's shown; with an ABI the
// data column defaults to the inferred type.
const ReturnData: React.FC<ReturnDataProps> = ({
  events,
  outputTypes = [],
}) => {
  const returnEvents = (events ?? []).filter(
    e => e.identifier === RETURN_DATA_IDENTIFIER,
  );

  // Build rows per event so topic/data pairs from different ReturnData events
  // are never mixed into the same row. ABI output types are matched to data
  // values in overall order (data[n] ↔ outputTypes[n]).
  let dataCursor = 0;
  const rows: { topic: string; data: string; dataType?: string }[] = [];
  returnEvents.forEach(e => {
    const eventTopics = (e.topics ?? []).map(t => t ?? '');
    const eventData = (e.data ?? []).map(d => d ?? '');
    const rowCount = Math.max(eventTopics.length, eventData.length);
    for (let i = 0; i < rowCount; i++) {
      const hasData = i < eventData.length;
      rows.push({
        topic: eventTopics[i] ?? '',
        data: hasData ? eventData[i] : '',
        dataType: hasData ? outputTypes[dataCursor++] : undefined,
      });
    }
  });

  if (rows.length === 0) return null;

  return (
    <Table>
      <HeaderRow>
        <span>Topic</span>
        <span>Data</span>
      </HeaderRow>
      {rows.map((row, i) => (
        <Row key={i}>
          <TopicCell>
            <ValueCell value={row.topic} />
          </TopicCell>
          <DataCell>
            <ValueCell value={row.data} abiType={row.dataType} />
          </DataCell>
        </Row>
      ))}
    </Table>
  );
};

export default ReturnData;
