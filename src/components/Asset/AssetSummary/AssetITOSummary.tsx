import { getBestKLVRate } from '@/pages/launchpad';
import { useMemo } from 'react';
import { AssetSummaryProps } from '.';
import {
  CardContainer,
  DetailsRow,
  DetailsValue,
  EndTime,
  Label,
  ParticipateButton,
  Progress,
  ProgressBar,
  ProgressFill,
  Rate,
  Subtitle,
  Title,
  TotalRaised,
  TotalRaisedValue,
} from './style';

export const AssetITOSummary: React.FC<AssetSummaryProps> = ({
  asset,
  ITO,
}) => {
  const bestAssetKLVRate = useMemo(
    () => getBestKLVRate(ITO?.packData || []),
    [ITO?.packData],
  );

  return (
    <CardContainer>
      <Title>Live ITO</Title>
      <Subtitle>
        Time for action! This guide enlights you on your blockchain gaming path
      </Subtitle>
      <TotalRaised>
        <Label>Total Raised</Label>
        <TotalRaisedValue>
          {(ITO?.mintedAmount || 0) / 10 ** (asset?.precision ?? 0)}{' '}
          {asset?.ticker} /{' '}
          {ITO?.maxAmount ? `${ITO?.maxAmount} ${asset?.ticker}` : '∞'}
        </TotalRaisedValue>
      </TotalRaised>

      {ITO?.maxAmount ? (
        <Progress>
          <Label>Progress</Label>
          <ProgressBar>
            <ProgressFill
              fillWidth={(ITO?.mintedAmount || 0) / ITO?.maxAmount}
            />
          </ProgressBar>
        </Progress>
      ) : null}
      <DetailsRow>
        <Rate>
          <Label>Best KLV Rate</Label>
          <DetailsValue>
            {!bestAssetKLVRate
              ? '--'
              : `1  ${asset?.ticker} = ${bestAssetKLVRate} KLV`}
          </DetailsValue>
        </Rate>
        <EndTime>
          <Label>End Time</Label>
          <DetailsValue>
            {ITO?.endTime
              ? new Date(ITO?.endTime * 1000).toLocaleString()
              : '--'}
          </DetailsValue>
        </EndTime>
      </DetailsRow>

      <ParticipateButton>Participate</ParticipateButton>
    </CardContainer>
  );
};
