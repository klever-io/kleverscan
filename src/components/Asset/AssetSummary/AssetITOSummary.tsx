import { useExtension } from '@/contexts/extension';
import { getBestKLVRate } from '@/pages/ito';
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
  Rate,
  Subtitle,
  Title,
  TotalRaised,
  TotalRaisedValue,
} from './styles';

interface AssetITOProps extends AssetSummaryProps {
  setOpenParticipateModal: (state: boolean) => void;
}

export const AssetITOSummary: React.FC<AssetITOProps> = ({
  asset,
  ITO,
  setOpenParticipateModal,
}) => {
  const remainingTime = useCountdown((ITO?.endTime || 0) * 1000);
  const { setOpenDrawer, extensionInstalled, walletAddress, connectExtension } =
    useExtension();

  const bestAssetKLVRate = useMemo(
    () => getBestKLVRate(ITO?.packData || []),
    [ITO?.packData],
  );

  const handleParticipate = async () => {
    if (!extensionInstalled) {
      setOpenDrawer(true);
      return;
    }
    if (!walletAddress) {
      await connectExtension();
    }

    setOpenParticipateModal(true);
  };

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
            <ProgressBar
              fillWidth={
                (ITO?.mintedAmount || 0) > ITO?.maxAmount
                  ? 1
                  : (ITO?.mintedAmount || 0) / ITO?.maxAmount
              }
            />
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
          {ITO?.endTime && (
            <EndTime>
              <Label>Remaining Time</Label>
              <DetailsValue>
                {secondsToMonthDayHourMinSec(remainingTime)}
              </DetailsValue>
            </EndTime>
          )}
        </DetailsRow>

        <ParticipateButton
          type="button"
          onClick={() => handleParticipate()}
          disabled={!asset || !ITO}
          secondary={!walletAddress}
        >
          Participate
        </ParticipateButton>
      </CardContainer>
    </>
  );
};
