import React, { useState } from 'react';
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

const cleanHex = (value?: string | null): string =>
  (value ?? '').replace(/^0x/, '');

const hexToUtf8 = (hex: string): string => {
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) return hex;
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return out;
};

const formatValue = (hex: string, format: ValueFormat): string => {
  if (hex === '') return '';
  switch (format) {
    case 'string':
      return hexToUtf8(hex);
    case 'number':
      try {
        return BigInt(`0x${hex}`).toString(10);
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
      <Mono>{formatValue(hex, format)}</Mono>
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

  const topics: string[] = [];
  const data: string[] = [];
  returnEvents.forEach(e => {
    (e.topics ?? []).forEach(t => topics.push(t ?? ''));
    (e.data ?? []).forEach(d => data.push(d ?? ''));
  });

  const rowCount = Math.max(topics.length, data.length);
  if (rowCount === 0) return null;

  return (
    <Table>
      <HeaderRow>
        <span>Topic</span>
        <span>Data</span>
      </HeaderRow>
      {Array.from({ length: rowCount }).map((_, i) => (
        <Row key={i}>
          <TopicCell>
            <ValueCell value={topics[i] ?? ''} />
          </TopicCell>
          <DataCell>
            <ValueCell value={data[i] ?? ''} abiType={outputTypes[i]} />
          </DataCell>
        </Row>
      ))}
    </Table>
  );
};

export default ReturnData;
