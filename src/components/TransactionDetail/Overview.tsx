import { useIsoLayoutEffect } from '@/components/BlockDetail/urlEffect';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/ExplorerLink';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { Status } from '@/styles/common';
import {
  formatDate,
  formatDateWithSeconds,
  toLocaleFixed,
} from '@/utils/formatFunctions';
import { ReceiveBackground } from '@/views/validator';
import React, { PropsWithChildren, useRef, useState } from 'react';
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

/* Right edge of the value cell's content, after its padding. The string
   may not sit in that padding. */
const contentRight = (node: HTMLElement): number => {
  const cell = node.parentElement;
  if (!cell) return node.getBoundingClientRect().right;
  const pad = parseFloat(getComputedStyle(cell).paddingRight) || 0;
  return cell.getBoundingClientRect().right - pad;
};

/* Width of the full timestamp, measured on a detached clone so React keeps
   the text it rendered. */
const textEnd = (node: HTMLElement, text: string): number => {
  const probe = node.cloneNode(false) as HTMLSpanElement;
  probe.textContent = text;
  probe.setAttribute('data-time-probe', 'true');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.left = '0';
  probe.style.top = '0';
  probe.style.width = 'max-content';
  probe.style.maxWidth = 'none';
  (node.parentElement ?? node).appendChild(probe);
  try {
    return (
      node.getBoundingClientRect().left + probe.getBoundingClientRect().width
    );
  } finally {
    probe.remove();
  }
};

/* Seconds stay when the full timestamp ends on or before the value cell's
   content edge. The short form, without seconds, is the floor. */
const TimeValue: React.FC<{ timestamp: number }> = ({ timestamp }) => {
  const full = formatDateWithSeconds(timestamp);
  const short = formatDate(timestamp);
  const ref = useRef<HTMLSpanElement>(null);
  const [withSeconds, setWithSeconds] = useState(true);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const node = ref.current;
      if (!node) return;
      const card = node.closest('section');
      if (!card) {
        setWithSeconds(true);
        return;
      }
      const next = textEnd(node, full) - contentRight(node) <= 1;
      setWithSeconds(current => (current === next ? current : next));
    };

    fit();
    const fonts = document.fonts;
    if (fonts) {
      fonts.ready.then(fit).catch(() => undefined);
    }
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        cancelled = true;
      };
    }
    const observer = new ResizeObserver(fit);
    const card = el.closest('section');
    if (card) observer.observe(card);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [full]);

  return <FactValue ref={ref}>{withSeconds ? full : short}</FactValue>;
};

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
          {loading ? (
            <Skeleton />
          ) : hash ? (
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
          ) : (
            <FactValue>--</FactValue>
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

      {block?.epoch !== undefined && (
        <FactRow>
          <FactLabel>Epoch</FactLabel>
          <FactValueRow>
            <FactValue>{block.epoch}</FactValue>
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
          {loading ? (
            <Skeleton />
          ) : sender ? (
            <ExplorerLink type="account" value={sender} />
          ) : (
            <FactValue>--</FactValue>
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
        <FeeValue $keepIcon>
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

      {loading ? (
        <FactRow>
          <FactLabel>Time</FactLabel>
          <FactValueRow>
            <Skeleton />
          </FactValueRow>
        </FactRow>
      ) : timestamp ? (
        <FactRow>
          <FactLabel>Time</FactLabel>
          <FactValueRow>
            {/* Seconds when the value cell can hold them. The elapsed
                suffix depends on the clock, so it stays off. */}
            <TimeValue timestamp={timestamp} />
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
