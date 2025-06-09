import { PropsWithChildren } from 'react';
import { useExtension } from '@/contexts/extension';
import { getBestKLVRate } from '@/pages/ito';
import { IParsedITO } from '@/types';
import { useCountdown } from '@/utils/hooks';
import { secondsToMonthDayHourMinSec } from '@/utils/timeFunctions';
import { useMemo } from 'react';
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

interface AssetITOProps {
  ITO: IParsedITO | undefined;
  setOpenParticipateModal: (state: boolean) => void;
}

export const AssetITOSummary: React.FC<PropsWithChildren<AssetITOProps>> = ({
  ITO,
  setOpenParticipateModal,
}) => {
  const remainingTime = useCountdown((ITO?.endTime || 0) * 1000);
  const access =
    ITO?.whitelistEndTime && Date.now() < ITO?.whitelistEndTime
      ? 'Whitelist Only'
      : 'Public';

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

  const handleIsInWhitelist = (address: string) => {
    if (address) {
      const isInWhitelist = ITO?.whitelistInfo?.some(
        info => info.address === address,
      );

      return isInWhitelist;
    }
  };

  return (
    <>
      <CardContainer>
        <Title>
          Live {ITO?.ticker} ITO - {access}
        </Title>
        <Subtitle>
          You can participate in the {ITO?.ticker} ITO{' '}
          {(ITO?.maxAmount || ITO?.endTime) &&
            `and get an exclusive rate
          for ${ITO?.ticker}`}
          . To participate, click the button below and choose the amount you
          want to invest.
        </Subtitle>
        <TotalRaised>
          <Label>Total Raised</Label>
          <TotalRaisedValue>
            {(ITO?.mintedAmount || 0).toLocaleString()} {ITO?.ticker} /{' '}
            {ITO?.maxAmount
              ? `${(ITO?.maxAmount || 0).toLocaleString()} ${ITO?.ticker}`
              : '∞'}
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
                : `1  ${ITO?.ticker} = ${bestAssetKLVRate} KLV`}
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
        {handleIsInWhitelist(walletAddress) !== false && (
          <ParticipateButton
            type="button"
            onClick={() => handleParticipate()}
            disabled={!ITO}
            secondary={!walletAddress}
          >
            Participate
          </ParticipateButton>
        )}
      </CardContainer>
    </>
  );
};
