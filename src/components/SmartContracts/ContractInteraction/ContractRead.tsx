import api from '@/services/api';
import { Service } from '@/types/index';
import { ABI } from '@/types/contracts';
import { ContractInfo } from '@/types/smart-contract';
import { abiEncoder } from '@klever/sdk-web';
import React, { useMemo, useState } from 'react';
import {
  InteractionSection,
  EndpointCard,
  EndpointHeader,
  EndpointBody,
  InputGroup,
  InputLabel,
  InputField,
  QueryButton,
  ResultBox,
  ResultLabel,
  EmptyState,
  Spinner,
  OutputRow,
} from './styles';

interface EndpointInput {
  name: string;
  type: string;
}

interface Endpoint {
  name: string;
  mutability: 'mutable' | 'readonly';
  inputs: EndpointInput[];
  outputs: EndpointInput[];
}

const parseAbi = (
  abiString: string,
): { endpoints: Endpoint[]; types: Record<string, any> } | null => {
  try {
    const parsed: ABI = JSON.parse(abiString);
    return {
      endpoints: parsed.endpoints as Endpoint[],
      types: parsed.types || {},
    };
  } catch {
    return null;
  }
};

const hexToString = (hex: string): string => {
  try {
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) ?? [],
    );
    return new TextDecoder().decode(bytes);
  } catch {
    return hex;
  }
};

const hexToInt = (hex: string): string => {
  if (!hex || hex === '') return '0';
  try {
    return BigInt('0x' + hex).toString();
  } catch {
    return hex;
  }
};

const decodeOutput = (hexValue: string, outputType: string): string => {
  if (!hexValue || hexValue === '') return '(empty)';

  const t = outputType.toLowerCase();
  if (
    t.includes('u64') ||
    t.includes('u32') ||
    t.includes('u16') ||
    t.includes('u8') ||
    t.includes('i64') ||
    t.includes('i32') ||
    t.includes('i16') ||
    t.includes('i8') ||
    t.includes('biguint') ||
    t.includes('bigint') ||
    t.includes('usize') ||
    t.includes('isize')
  ) {
    return hexToInt(hexValue);
  }

  if (t === 'bool') {
    return hexValue === '01' ? 'true' : 'false';
  }

  if (
    t.includes('address') ||
    t.includes('managedbuffer') ||
    t.includes('string') ||
    t.includes('tokenidentifier') ||
    t.includes('bytes') ||
    t.includes('boxedbytes') ||
    t.includes('&str')
  ) {
    const decoded = hexToString(hexValue);
    if (/^[a-zA-Z0-9_\-./: ]+$/.test(decoded)) return decoded;
    return `0x${hexValue}`;
  }

  return `0x${hexValue}`;
};

const encodeArg = (
  abiTypes: Record<string, any>,
  value: string,
  rawType: string,
): string => {
  return abiEncoder.encodeWithABI({ types: abiTypes }, value, rawType);
};

export function ContractReadTab({
  contractAddress,
  contractInfo,
}: {
  contractAddress: string;
  contractInfo: ContractInfo;
}) {
  const versions = contractInfo.contractVersions ?? [];
  const latestVersion = versions[versions.length - 1];

  const abi = useMemo(() => {
    if (!latestVersion?.abi) return null;
    return parseAbi(latestVersion.abi);
  }, [latestVersion]);

  const readonlyEndpoints = useMemo(() => {
    if (!abi) return [];
    return abi.endpoints.filter(e => e.mutability === 'readonly');
  }, [abi]);

  if (!abi || readonlyEndpoints.length === 0) {
    return (
      <EmptyState>
        No readable functions available for this contract.
      </EmptyState>
    );
  }

  return (
    <InteractionSection>
      {readonlyEndpoints.map(endpoint => (
        <ReadEndpointCard
          key={endpoint.name}
          contractAddress={contractAddress}
          endpoint={endpoint}
          abiTypes={abi.types}
        />
      ))}
    </InteractionSection>
  );
}

function ReadEndpointCard({
  contractAddress,
  endpoint,
  abiTypes,
}: {
  contractAddress: string;
  endpoint: Endpoint;
  abiTypes: Record<string, any>;
}) {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    const missingRequired = endpoint.inputs.filter(
      input => !args[input.name]?.trim(),
    );
    if (missingRequired.length > 0) {
      setError(
        `Missing required arguments: ${missingRequired.map(i => i.name).join(', ')}`,
      );
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const encodedArgs: string[] = endpoint.inputs.map(input =>
        encodeArg(abiTypes, args[input.name], input.type),
      );

      const res = await api.post({
        route: 'vm/hex',
        service: Service.NODE,
        body: {
          scAddress: contractAddress,
          funcName: endpoint.name,
          args: encodedArgs,
        },
      });

      if (res.error && res.error !== '') {
        setError(
          typeof res.error === 'string' ? res.error : JSON.stringify(res.error),
        );
        return;
      }

      const data = res.data?.data;

      if (data === undefined || data === null) {
        setResult('(no data returned)');
        return;
      }

      if (typeof data === 'string') {
        const outputType = endpoint.outputs?.[0]?.type ?? 'hex';
        setResult(decodeOutput(data, outputType));
      } else if (Array.isArray(data)) {
        const outputs = endpoint.outputs ?? [];
        const decoded = data.map((hex: string, i: number) => {
          const outputType = outputs[i]?.type ?? 'hex';
          const label = outputs[i]?.name || `[${i}]`;
          return `${label}: ${decodeOutput(hex, outputType)}`;
        });
        setResult(decoded.join('\n'));
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setError(err.message || 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard>
      <EndpointHeader open={open} onClick={() => setOpen(o => !o)}>
        {endpoint.name}
      </EndpointHeader>
      {open && (
        <EndpointBody>
          {endpoint.inputs.map(input => (
            <InputGroup key={input.name}>
              <InputLabel>
                {input.name} <span>({input.type})</span>
              </InputLabel>
              <InputField
                placeholder={input.type}
                value={args[input.name] || ''}
                onChange={e =>
                  setArgs(prev => ({ ...prev, [input.name]: e.target.value }))
                }
              />
            </InputGroup>
          ))}

          <QueryButton onClick={handleQuery} disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Querying...' : 'Query'}
          </QueryButton>

          {result !== null && (
            <OutputRow>
              <ResultLabel>Result</ResultLabel>
              <ResultBox>{result}</ResultBox>
            </OutputRow>
          )}

          {error && (
            <OutputRow>
              <ResultLabel>Error</ResultLabel>
              <ResultBox isError>{error}</ResultBox>
            </OutputRow>
          )}
        </EndpointBody>
      )}
    </EndpointCard>
  );
}
