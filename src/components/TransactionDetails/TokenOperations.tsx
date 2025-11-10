import React, { useState } from 'react';
import Link from 'next/link';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { usePrecision } from '@/utils/hooks';
import { FlexSpan, FrozenContainer, Row, RowContent } from '@/styles/common';
import { ButtonExpand } from '@/views/transactions/detail';
import { parseAddress } from '@/utils/parseValues';
import { BalanceContainer } from '@/views/accounts/detail';
import Copy from '../Copy';

interface Props {
  receipts: any[];
}

const copyStyle = {
  padding: '0',
  marginLeft: '0.5rem',
  marginRight: '1rem',
  border: 'none',
};

const TokenOperations: React.FC<Props> = ({ receipts }) => {
  const [expanded, setExpanded] = useState(false);

  if (!receipts || receipts.length === 0) return null;

  // receipts coming from node are often typeString === 'Transfer' for most value ops
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
        <strong>Tx</strong>
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
              const rawAmount =
                Number(op.value ?? op.amount ?? op.amountDelegated ?? 0) || 0;
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
                        Mint to
                        <Link href={`/account/${to}`}>
                          {parseAddress(to, 16)}
                        </Link>{' '}
                        <Copy data={to} info="Address" style={copyStyle} />
                      </>
                    ) : isBurn ? (
                      <>
                        Burn from{' '}
                        <Link href={`/account/${from}`}>
                          {parseAddress(from, 16)}
                        </Link>
                        <Copy data={from} info="Address" style={copyStyle} />
                      </>
                    ) : (
                      <>
                        Transfer from{' '}
                        <Link href={`/account/${from}`}>
                          {parseAddress(from, 16)}
                        </Link>{' '}
                        to{' '}
                        <Link href={`/account/${to}`}>
                          {parseAddress(to, 16)}
                        </Link>{' '}
                      </>
                    )}
                    {amount}
                    <Link href={`/asset/${assetId}`}>{assetId}</Link>
                    <Copy data={assetId} info="Asset ID" style={copyStyle} />
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
