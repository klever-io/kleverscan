import { useExtension } from '@/contexts/extension';
import { ABI, ABIType } from '@/types/contracts';
import { ContractInfo } from '@/types/smart-contract';
import { parseArgument } from '@/components/TransactionForms/CustomForms/SmartContract';
import { getPrecision } from '@/utils/precisionFunctions';
import { utils } from '@klever/sdk-web';

import { buildTransaction } from '@/components/Contract/utils';
import { web } from '@klever/sdk-web';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  InteractionSection,
  EndpointCard,
  EndpointHeader,
  EndpointBody,
  InputGroup,
  InputLabel,
  InputField,
  WriteButton,
  ResultBox,
  ResultLabel,
  EmptyState,
  ConnectWalletMessage,
  TxHashLink,
  Spinner,
  OutputRow,
  CallValueSection,
  CallValueRow,
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
  payableInTokens?: string[];
}

const parseAbi = (
  abiString: string,
): {
  endpoints: Endpoint[];
  types: Record<string, ABIType>;
} | null => {
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

const buildEncodedArgs = (
  inputs: EndpointInput[],
  args: Record<string, string>,
  abiTypes: Record<string, ABIType>,
): string[] => {
  const abi = { types: abiTypes };
  return inputs
    .map(input => {
      const val = args[input.name] || '';
      if (!val) return '';
      return parseArgument(val, input.type, abi);
    })
    .filter(a => a !== '');
};

export function ContractWriteTab({
  contractAddress,
  contractInfo,
}: {
  contractAddress: string;
  contractInfo: ContractInfo;
}) {
  const { walletAddress } = useExtension();
  const versions = contractInfo.contractVersions ?? [];
  const latestVersion = versions[versions.length - 1];

  const abi = useMemo(() => {
    if (!latestVersion?.abi) return null;
    return parseAbi(latestVersion.abi);
  }, [latestVersion]);

  const mutableEndpoints = useMemo(() => {
    if (!abi) return [];
    return abi.endpoints.filter(e => e.mutability === 'mutable');
  }, [abi]);

  if (!abi || mutableEndpoints.length === 0) {
    return (
      <EmptyState>
        No writable functions available for this contract.
      </EmptyState>
    );
  }

  if (!walletAddress) {
    return (
      <ConnectWalletMessage>
        Connect your wallet to interact with contract functions.
      </ConnectWalletMessage>
    );
  }

  return (
    <InteractionSection>
      {mutableEndpoints.map(endpoint => (
        <WriteEndpointCard
          key={endpoint.name}
          contractAddress={contractAddress}
          endpoint={endpoint}
          abiTypes={abi.types}
        />
      ))}
    </InteractionSection>
  );
}

function WriteEndpointCard({
  contractAddress,
  endpoint,
  abiTypes,
}: {
  contractAddress: string;
  endpoint: Endpoint;
  abiTypes: Record<string, ABIType>;
}) {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<Record<string, string>>({});
  const [callValue, setCallValue] = useState<{
    assetId: string;
    amount: string;
  }>({
    assetId: 'KLV',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasPayable =
    endpoint.payableInTokens && endpoint.payableInTokens.length > 0;

  const handleWrite = async () => {
    setLoading(true);
    setTxHash(null);
    setError(null);

    try {
      const encodedArgs = buildEncodedArgs(endpoint.inputs, args, abiTypes);

      const metadata =
        encodedArgs.length > 0
          ? `${endpoint.name}@${encodedArgs.join('@')}`
          : endpoint.name;

      const parsedCallValue: Record<string, number> = {};
      if (hasPayable && callValue.amount && Number(callValue.amount) > 0) {
        const assetId = callValue.assetId || 'KLV';
        const precision = await getPrecision(assetId);
        parsedCallValue[assetId] = Math.round(
          Number(callValue.amount) * 10 ** precision,
        );
      }

      const encodedMetadata = Buffer.from(metadata, 'utf-8').toString('base64');

      const unsignedTx = await buildTransaction(
        [
          {
            type: 63, // SmartContract
            payload: {
              scType: 0, // Invoke
              address: contractAddress,
              callValue: parsedCallValue,
            },
          },
        ],
        [encodedMetadata],
      );

      const signedTx = await web.signTransaction(unsignedTx.result);
      const response = await web.broadcastTransactions([signedTx]);

      if (response.error) {
        throw new Error(response.error);
      }

      const hash = response?.data?.txsHashes?.[0] || unsignedTx.txHash;
      setTxHash(hash);
      toast.success('Transaction sent successfully');
    } catch (err: any) {
      const msg = err?.message || err?.toString() || 'Transaction failed';
      setError(msg);
      toast.error(msg);
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

          {hasPayable && (
            <CallValueSection>
              <InputLabel>Call Value</InputLabel>
              <CallValueRow>
                <InputGroup>
                  <InputLabel>
                    Asset ID <span>(token to send)</span>
                  </InputLabel>
                  <InputField
                    placeholder="KLV"
                    value={callValue.assetId}
                    onChange={e =>
                      setCallValue(prev => ({
                        ...prev,
                        assetId: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel>Amount</InputLabel>
                  <InputField
                    placeholder="0"
                    type="number"
                    value={callValue.amount}
                    onChange={e =>
                      setCallValue(prev => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </CallValueRow>
            </CallValueSection>
          )}

          <WriteButton onClick={handleWrite} disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Sending...' : 'Write'}
          </WriteButton>

          {txHash && (
            <OutputRow>
              <ResultLabel>Transaction Hash</ResultLabel>
              <ResultBox>
                <Link href={`/transaction/${txHash}`} legacyBehavior>
                  <TxHashLink href={`/transaction/${txHash}`}>
                    {txHash}
                  </TxHashLink>
                </Link>
              </ResultBox>
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
