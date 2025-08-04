import Copy from '@/components/Copy';
import { getStatusIcon } from '@/assets/status';
import Skeleton from '@/components/Skeleton';
import { useMobile } from '@/contexts/mobile';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  InvokeMethodBagde,
  Row,
  Status,
} from '@/styles/common';
import { SmartContractTransactionData } from '@/types/smart-contract';
import { capitalizeString, hexToString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress, parseJson } from '@/utils/parseValues';
import { getAge } from '@/utils/timeFunctions';
import { fromUnixTime } from 'date-fns';
import React from 'react';
import { ExpandCenteredRow, DivDataJson } from '@/views/transactions/detail';
import ReactJson from 'react-json-view';
import { getRawTxTheme } from '@/pages/transaction/[hash]';
import dynamic from 'next/dynamic';
import Link from 'next/link';

interface SCTransactionDetailsProps {
  transactionData: SmartContractTransactionData;
}

const SCTransactionDetails: React.FC<SCTransactionDetailsProps> = ({
  transactionData,
}) => {
  const {
    blockNum,
    sender,
    nonce,
    timestamp,
    kAppFee,
    bandwidthFee,
    status,
    contract = [],
    data = [],
  } = transactionData || {};
  const { isMobile } = useMobile();
  const ReactJson = dynamic(
    () => import('react-json-view').then(mod => mod.default),
    { ssr: false },
  );
  const StatusIcon = getStatusIcon(status || 'unknown');

  const processMetadata = (data: string, index: number) => {
    const formatData = (hexData: any) => <span>{hexToString(hexData)}</span>;
    if (!data || data.length === 0) {
      return <span>No metadata available</span>;
    }

    try {
      const jsonData = JSON.parse(parseJson(hexToString(data)));
      if (jsonData && typeof jsonData === 'object') {
        return (
          <DivDataJson>
            <ReactJson
              src={jsonData}
              name={false}
              displayObjectSize={false}
              enableClipboard={true}
              displayDataTypes={false}
              theme={getRawTxTheme(false)}
            />
          </DivDataJson>
        );
      }
      return formatData(data);
    } catch (error) {
      return formatData(data);
    }
  };

  return (
    <CardTabContainer>
      <CardHeader>
        <CardHeaderItem selected={true}>
          <span>Transaction</span>
        </CardHeaderItem>
      </CardHeader>
      <CardContent>
        <Row>
          <span>Status</span>
          <CenteredRow>
            {status && (
              <Status status={status}>
                <StatusIcon />
                <span>{capitalizeString(status)}</span>
              </Status>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>Age</span>
          <CenteredRow>
            {timestamp && (
              <span>
                {getAge(fromUnixTime(timestamp), undefined)}(
                {formatDate(timestamp)})
              </span>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>Block</span>
          <CenteredRow>{blockNum && <span>{blockNum}</span>}</CenteredRow>
        </Row>
        <Row>
          <span>From</span>
          <CenteredRow>
            {sender && (
              <>
                <Link href={`/account/${sender}`}>
                  <span>{parseAddress(sender, isMobile ? 35 : NaN)}</span>
                </Link>
                <Copy data={sender} info="sender" />
              </>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>To</span>
          <CenteredRow>
            {contract &&
              contract.length > 0 &&
              contract[0].parameter?.address && (
                <>
                  <Link href={`/account/${contract[0].parameter?.address}`}>
                    <span>
                      {parseAddress(
                        contract[0].parameter?.address,
                        isMobile ? 35 : NaN,
                      )}
                    </span>
                  </Link>
                  <Copy data={contract[0].parameter?.address} info="address" />
                </>
              )}
          </CenteredRow>
        </Row>
        <Row>
          <span>SC Type</span>
          <CenteredRow>
            {contract &&
              contract.length > 0 &&
              contract[0].parameter?.type &&
              contract?.map((item, index) => (
                <InvokeMethodBagde key={index}>
                  {item?.parameter?.type ? item.parameter.type.slice(2) : ''}
                </InvokeMethodBagde>
              ))}
          </CenteredRow>
        </Row>
        <Row>
          <span>Bandwidth Fee</span>
          <CenteredRow>
            {bandwidthFee && (
              <span>
                {formatAmount(bandwidthFee / 10 ** KLV_PRECISION)} KLV
              </span>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>KApp Fee</span>
          <CenteredRow>
            {kAppFee && kAppFee > 0 && (
              <span>{formatAmount(kAppFee / 10 ** KLV_PRECISION)} KLV</span>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>Nonce</span>
          <CenteredRow>
            {nonce !== undefined && nonce !== null && <span>{nonce}</span>}
          </CenteredRow>
        </Row>
        <Row>
          <span>Metadata</span>
          <ExpandCenteredRow>
            {data && data.length > 0 && (
              <>
                {processMetadata(data[0], 0)}
                <Copy data={hexToString(data[0])} info="Data" />
              </>
            )}
          </ExpandCenteredRow>
        </Row>
      </CardContent>
    </CardTabContainer>
  );
};

export default SCTransactionDetails;
