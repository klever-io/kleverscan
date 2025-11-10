import Copy from '@/components/Copy';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { CardContent, Row, Status } from '@/styles/common';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import {
  ButtonExpand,
  CenteredRow,
  KdaFeeSpan,
  SignatureContainer,
  SignatureSpan,
} from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import Link from 'next/link';
import React, { PropsWithChildren, useState } from 'react';

import KappFee from './KappFee';
import TokenOperations from './TokenOperations';

interface IKdaFee {
  amount: number;
  kda: string;
}

interface IOverviewDetails {
  hash: string | undefined;
  StatusIcon?: any;
  status?: string;
  resultCode?: string;
  block?: any;
  blockNum?: number;
  nonce: number | undefined;
  sender: string | undefined;
  kAppFee?: number;
  bandwidthFee: number | undefined;
  kdaFee?: IKdaFee | undefined;
  precisionTransaction?: number | undefined;
  timestamp?: number;
  signature: string | string[] | undefined;
  ThresholdComponent?: React.FC<PropsWithChildren>;
  loading?: boolean;
  MultiSignList?: React.FC<PropsWithChildren>;
  receipts?: any[];
}

const OverviewDetails: React.FC<PropsWithChildren<IOverviewDetails>> = ({
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
  ThresholdComponent,
  loading = false,
  MultiSignList,
  receipts,
}) => {
  const [expandSignature, setExpandSignature] = useState(false);
  const handleExpandSignature = () => setExpandSignature(!expandSignature);

  return (
    <>
      <CardContent>
        {MultiSignList && <MultiSignList />}
        <Row>
          <span>
            <strong>Hash</strong>
          </span>
          {loading ? (
            <Skeleton />
          ) : (
            <CenteredRow>
              <span>{hash}</span>
              <ReceiveBackground isOverflow={true}>
                <QrCodeModal value={hash || ''} isOverflow={true} />
              </ReceiveBackground>
            </CenteredRow>
          )}
        </Row>

        <TokenOperations receipts={receipts || []} />

        {ThresholdComponent && (
          <Row>
            <span>
              <strong>Threshold</strong>
            </span>
            <CenteredRow>
              {loading ? <Skeleton /> : <ThresholdComponent />}
            </CenteredRow>
          </Row>
        )}

        {status && StatusIcon && (
          <Row>
            <span>
              <strong>Status</strong>
            </span>
            <Status status={status}>
              <StatusIcon />
              <span>{status}</span>
            </Status>
          </Row>
        )}

        {resultCode && (
          <Row>
            <span>
              <strong>Result Code</strong>
            </span>
            <span>
              <p>{resultCode}</p>
            </span>
          </Row>
        )}

        {block && (
          <Row>
            <span>
              <strong>Epoch</strong>
            </span>
            <span>
              <p>{block?.epoch}</p>
            </span>
          </Row>
        )}

        {blockNum && (
          <Row>
            <span>
              <strong>Block Number</strong>
            </span>
            <span>
              <p>{blockNum || 0}</p>
            </span>
          </Row>
        )}

        <Row>
          <span>
            <strong>Nonce</strong>
          </span>
          <span>{loading ? <Skeleton /> : <p>{nonce}</p>}</span>
        </Row>

        <Row>
          <span>
            <strong>From</strong>
          </span>
          {loading ? (
            <Skeleton />
          ) : (
            <span>
              <CenteredRow>
                <Link href={`/account/${sender || ''}`} legacyBehavior>
                  {sender || ''}
                </Link>
                <Copy data={sender} info="Sender" />
              </CenteredRow>
            </span>
          )}
        </Row>

        {kAppFee && (
          <Row>
            <span>
              <strong>kApp Fee</strong>
            </span>
            <KappFee status={status} kAppFee={kAppFee} />
          </Row>
        )}

        <Row>
          <span>
            <strong>Bandwidth Fee</strong>
          </span>
          <span>
            {loading ? (
              <Skeleton />
            ) : (
              <p>{toLocaleFixed((bandwidthFee ?? 0) / 1000000, 6)}</p>
            )}
          </span>
        </Row>

        <Row>
          <span>
            <strong>KDA Fee</strong>
          </span>
          <KdaFeeSpan>
            {loading ? (
              <Skeleton />
            ) : (
              <>
                <span>
                  {kdaFee &&
                    toLocaleFixed(
                      kdaFee?.amount / 10 ** (precisionTransaction || 0),
                      precisionTransaction || 0,
                    )}{' '}
                  {kdaFee?.kda || 'KLV'}
                </span>
                <Tooltip
                  msg={`Both kApp fee and bandwidth fee\n were payed with ${kdaFee?.kda || 'KLV'}`}
                />
              </>
            )}
          </KdaFeeSpan>
        </Row>

        {timestamp && (
          <Row>
            <span>
              <strong>Time</strong>
            </span>
            <span>
              <p suppressHydrationWarning>
                {formatDate(timestamp, {
                  showElapsedTime: true,
                })}
              </p>
            </span>
          </Row>
        )}

        <Row>
          <span>
            <strong>Signature</strong>
          </span>
          <CenteredRow>
            {loading ? (
              <Skeleton />
            ) : (
              <>
                <SignatureContainer isExpanded={expandSignature}>
                  {!!signature?.length &&
                    (signature as string[])?.map((item: string) => (
                      <>
                        <SignatureSpan isExpanded={expandSignature}>
                          {item}
                          {expandSignature && (
                            <Copy
                              data={item}
                              info="Signature"
                              style={{
                                display: 'inline-block',
                                margin: '0.2rem',
                                verticalAlign: 'middle',
                              }}
                            />
                          )}
                        </SignatureSpan>
                        {!expandSignature && (
                          <Copy data={item} info="Signature" />
                        )}
                      </>
                    ))}
                </SignatureContainer>
              </>
            )}
          </CenteredRow>
          {!!signature?.length && (
            <ButtonExpand onClick={handleExpandSignature}>
              {expandSignature ? 'Collapse' : 'Expand'}
            </ButtonExpand>
          )}
        </Row>
      </CardContent>
    </>
  );
};

export default OverviewDetails;
