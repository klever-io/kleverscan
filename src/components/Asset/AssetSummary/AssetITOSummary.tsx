import { IPackInfo } from '@/types/contracts';
import { useCountdown } from '@/utils/hooks';
import { secondsToMonthDayHourMinSec } from '@/utils/timeFunctions';
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
} from './styles';

export function getBestKLVRateWintoutPrecision(
  packData: IPackInfo[],
): number | undefined {
  let bestKLVRate: number | undefined = undefined;
  if (packData) {
    packData.forEach(pack => {
      if (pack.key === 'KLV') {
        pack.packs.forEach(p => {
          const rate = p.price / p.amount;
          if (!bestKLVRate || rate < bestKLVRate) {
            bestKLVRate = rate;
          }
        });
      }
    });
  }
  return bestKLVRate;
}

interface AssetITOProps extends AssetSummaryProps {
  setOpenParticipateModal: (state: boolean) => void;
}

export const AssetITOSummary: React.FC<AssetITOProps> = ({
  asset,
  ITO,
  setOpenParticipateModal,
}) => {
  const remainingTime = useCountdown((ITO?.endTime || 0) * 1000);

  const bestAssetKLVRate = useMemo(
    () => getBestKLVRateWintoutPrecision(ITO?.packData || []),
    [ITO?.packData],
  );

  return (
    <>
      <CardContainer>
        <Title>Live ITO</Title>
        <Subtitle>
          Time for action! This guide enlights you on your blockchain gaming
          path
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
                fillWidth={
                  (ITO?.mintedAmount || 0) > ITO?.maxAmount
                    ? 1
                    : (ITO?.mintedAmount || 0) / ITO?.maxAmount
                }
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
            <Label>Remaining Time</Label>
            <DetailsValue>
              {secondsToMonthDayHourMinSec(remainingTime)}
            </DetailsValue>
          </EndTime>
        </DetailsRow>

        <ParticipateButton
          type="button"
          onClick={() => setOpenParticipateModal(true)}
          disabled={!asset || !ITO}
        >
          Participate
        </ParticipateButton>
      </CardContainer>
    </>
  );
};
