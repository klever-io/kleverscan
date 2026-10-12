import CopyAction from '@/components/DataList/CopyAction';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { Status } from '@/styles/common';
import { formatDateWithSeconds, toLocaleFixed } from '@/utils/formatFunctions';
import { ReceiveBackground } from '@/views/validator';
import React, { PropsWithChildren } from 'react';
import KappFee from '../TransactionDetails/KappFee';
import TokenOperations from '../TransactionDetails/TokenOperations';
import FittedHash from './FittedHash';
import { signatureList } from './signatures';
import {
  FactLabel,
  FactRow,
  FactValue,
  FactValueRow,
  FactWrap,
  FeeValue,
  SignatureList,
  TokenSlot,
  WideFactRow,
} from './styles';

interface IKdaFee {
  amount: number;
  kda: string;
}

export interface ITransactionOverview {
  hash: string | undefined;
  StatusIcon?: React.FC;
  status?: string;
  resultCode?: string;
  block?: { epoch?: number };
  blockNum?: number;
  nonce: number | undefined;
  sender: string | undefined;
  kAppFee?: number;
  bandwidthFee: number | undefined;
  kdaFee?: IKdaFee | undefined;
  precisionTransaction?: number | undefined;
  timestamp?: number;
  signature: string | string[] | undefined;
  loading?: boolean;
  receipts?: any[];
}

const klvFee = (raw: number | undefined): string =>
  toLocaleFixed((raw ?? 0) / 1000000, 6);

const Overview: React.FC<PropsWithChildren<ITransactionOverview>> = ({
  hash,
  StatusIcon,
  status,
  resultCode,
  block,
  blockNum,
  nonce,
  sender,
  kAppFee,
  bandwidthFee,
  kdaFee,
  precisionTransaction,
  timestamp,
  signature,
  loading = false,
  receipts,
}) => {
  const signatures = signatureList(signature);

  return (
    <>
      <WideFactRow>
        <FactLabel>Hash</FactLabel>
        <FactValueRow>
          {loading || !hash ? (
            <Skeleton />
          ) : (
            <>
              <FittedHash value={hash} />
              <CopyAction
                value={hash}
                label="Copy hash"
                announcement="Hash copied to clipboard"
              />
              <ReceiveBackground isOverflow>
                <QrCodeModal value={hash} isOverflow />
              </ReceiveBackground>
            </>
          )}
        </FactValueRow>
      </WideFactRow>

      <TokenSlot>
        <TokenOperations receipts={receipts || []} />
      </TokenSlot>

      {status && StatusIcon && (
        <FactRow>
          <FactLabel>Status</FactLabel>
          <FactValueRow>
            <Status status={status}>
              <StatusIcon />
              <span>{status}</span>
            </Status>
          </FactValueRow>
        </FactRow>
      )}

      {resultCode && (
        <FactRow>
          <FactLabel>Result Code</FactLabel>
          <FactValueRow>
            <FactWrap>{resultCode}</FactWrap>
          </FactValueRow>
        </FactRow>
      )}

      {block && (
        <FactRow>
          <FactLabel>Epoch</FactLabel>
          <FactValueRow>
            <FactValue>{block.epoch ?? ''}</FactValue>
          </FactValueRow>
        </FactRow>
      )}

      {blockNum ? (
        <FactRow>
          <FactLabel>Block Number</FactLabel>
          <FactValueRow>
            <FactValue>{blockNum}</FactValue>
          </FactValueRow>
        </FactRow>
      ) : null}

      <FactRow>
        <FactLabel>Nonce</FactLabel>
        <FactValueRow>
          {loading ? <Skeleton /> : <FactValue>{nonce}</FactValue>}
        </FactValueRow>
      </FactRow>

      <WideFactRow>
        <FactLabel>From</FactLabel>
        <FactValueRow>
          {loading || !sender ? (
            <Skeleton />
          ) : (
            <>
              <FittedHash value={sender} href={`/account/${sender}`} />
              <CopyAction
                value={sender}
                label="Copy address"
                announcement="Address copied to clipboard"
              />
            </>
          )}
        </FactValueRow>
      </WideFactRow>

      {kAppFee ? (
        <FactRow $start>
          <FactLabel>kApp Fee</FactLabel>
          <FeeValue>
            <KappFee status={status} kAppFee={kAppFee} />
          </FeeValue>
        </FactRow>
      ) : null}

      <FactRow>
        <FactLabel>Bandwidth Fee</FactLabel>
        <FactValueRow>
          {loading ? (
            <Skeleton />
          ) : (
            <FactValue>{klvFee(bandwidthFee)}</FactValue>
          )}
        </FactValueRow>
      </FactRow>

      <FactRow>
        <FactLabel>KDA Fee</FactLabel>
        <FeeValue>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <FactValue>
                {kdaFee
                  ? toLocaleFixed(
                      kdaFee.amount / 10 ** (precisionTransaction || 0),
                      precisionTransaction || 0,
                    )
                  : ''}{' '}
                {kdaFee?.kda || 'KLV'}
              </FactValue>
              <Tooltip
                msg={`Both kApp fee and bandwidth fee\n were payed with ${kdaFee?.kda || 'KLV'}`}
              />
            </>
          )}
        </FeeValue>
      </FactRow>

      {timestamp ? (
        <FactRow>
          <FactLabel>Time</FactLabel>
          <FactValueRow>
            <FactValue>{formatDateWithSeconds(timestamp)}</FactValue>
          </FactValueRow>
        </FactRow>
      ) : null}

      <WideFactRow>
        <FactLabel>Signature</FactLabel>
        <SignatureList>
          {loading ? (
            <Skeleton />
          ) : (
            signatures.map(item => (
              <FactValueRow key={item}>
                <FittedHash value={item} />
                <CopyAction
                  value={item}
                  label="Copy signature"
                  announcement="Signature copied to clipboard"
                />
              </FactValueRow>
            ))
          )}
        </SignatureList>
      </WideFactRow>
    </>
  );
};

export default Overview;
