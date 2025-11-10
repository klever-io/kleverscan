import React, { useState } from 'react';
import Link from 'next/link';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { usePrecision } from '@/utils/hooks';
import { FlexSpan, FrozenContainer, Row, RowContent } from '@/styles/common';
import { ButtonExpand } from '@/views/transactions/detail';
import { parseAddress } from '@/utils/parseValues';
import { BalanceContainer } from '@/views/accounts/detail';
import Copy from '../Copy';
import { isValidContractAddress } from '@klever/connect';
import { useQuery } from 'react-query';
import api from '@/services/api';

interface Props {
  receipts: any[];
}

interface ContractNameDisplayProps {
  address: string;
  displayName: string;
}

const ContractNameDisplay: React.FC<ContractNameDisplayProps> = ({
  address,
  displayName,
}) => {
  const isContract = isValidContractAddress(address);

  const { data: contractData } = useQuery(
    ['smartContract', address],
    async () => {
      if (!isContract) return null;
      const res = await api.get({
        route: `sc/${address}`,
      });
      if (!res.error && res.data?.sc) {
        return res.data.sc;
      }
      return null;
    },
    {
      enabled: isContract,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  );

  const contractName = contractData?.name;

  return (
    <Link
      href={isContract ? `/smart-contract/${address}` : `/account/${address}`}
    >
      {contractName || displayName}
    </Link>
  );
};

const copyStyle = {
  padding: '0',
  marginRight: '0.25rem',
  border: 'none',
};

const TokenOperations: React.FC<Props> = ({ receipts }) => {
  const [expanded, setExpanded] = useState(false);

  if (!receipts || receipts.length === 0) return null;

  const operations = receipts.filter((r: any) =>
    ['Transfer'].includes(r.typeString),
  );

  if (!operations.length) return null;

  const assetIdsToSearch = Array.from(
    new Set(
      operations
        .map((r: any) =>
          r.assetId && typeof r.assetId === 'string'
            ? r.assetId.split('/')[0]
            : 'KLV',
        )
        .filter(Boolean),
    ),
  );

  const precisions = usePrecision(assetIdsToSearch as string[]);

  const visible = expanded ? operations : operations.slice(0, 2);

  const SPECIAL_BURN_ADDRESS =
    'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

  return (
    <Row>
      <span>
        <strong>Token Transfers</strong>
      </span>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            {visible.map((op: any, i: number) => {
              const assetId =
                (op.assetId &&
                  typeof op.assetId === 'string' &&
                  op.assetId.split('/')[0]) ||
                'KLV';
              const prec = (precisions && (precisions as any)[assetId]) || 0;
              const rawAmount = Number(op.value ?? 0);
              const amount = toLocaleFixed(rawAmount / 10 ** prec, prec);

              // Determine whether this transfer is a mint or burn by convention
              const from = op.from || '';
              const to = op.to || '';
              const isMint = from.includes(SPECIAL_BURN_ADDRESS);
              const isBurn = to.includes(SPECIAL_BURN_ADDRESS);

              return (
                <div key={`op-${i}`}>
                  <FlexSpan>
                    {isMint ? (
                      <>
                        Mint to{' '}
                        <ContractNameDisplay
                          address={to}
                          displayName={parseAddress(to, 16)}
                        />{' '}
                      </>
                    ) : isBurn ? (
                      <>
                        Burn from{' '}
                        <ContractNameDisplay
                          address={from}
                          displayName={parseAddress(from, 16)}
                        />
                      </>
                    ) : (
                      <>
                        Transfer from{' '}
                        <ContractNameDisplay
                          address={from}
                          displayName={parseAddress(from, 16)}
                        />{' '}
                        to{' '}
                        <ContractNameDisplay
                          address={to}
                          displayName={parseAddress(to, 16)}
                        />{' '}
                      </>
                    )}
                    {amount}
                    <Link href={`/asset/${assetId}`}>{assetId}</Link>
                  </FlexSpan>
                </div>
              );
            })}
            {operations.length > 2 && !expanded && <div> ... </div>}
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>

      {operations.length > 2 && (
        <ButtonExpand onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Collapse' : 'Expand'}
        </ButtonExpand>
      )}
    </Row>
  );
};

export default TokenOperations;
