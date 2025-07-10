import { PropsWithChildren, useEffect, useState } from 'react';
import { IMultisignData } from '..';
import { IMultisignList } from '../MultiSignList';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  PassThresholdContainer,
  ProgressBar,
  ProgressBarContent,
  ProgressBarVotes,
} from '@/views/proposals/detail';
import Tooltip from '@/components/Tooltip';
import { OverviewDetails } from '@/pages/transaction/[hash]';

interface IMultisignOverview {
  multiSignData: IMultisignData;
  loading: boolean;
  MultiSignList: React.FC<PropsWithChildren<IMultisignList>>;
  hashs: string[];
  selectedHash: string;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
}
export const OverviewInfo: React.FC<PropsWithChildren<IMultisignOverview>> = ({
  multiSignData,
  loading,
  MultiSignList,
  hashs,
  selectedHash,
  setSelectedHash,
}) => {
  const [precision, SetPrecision] = useState(6);

  useEffect(() => {
    const fetchPrecision = async () => {
      if (multiSignData?.decodedTx?.kdaFee?.kda) {
        const responsePrecision = await getPrecision(
          multiSignData?.decodedTx?.kdaFee?.kda || 'KLV',
        );
        SetPrecision(responsePrecision);
      }
    };
    fetchPrecision();
  }, []);

  const multisignTotalWeight =
    multiSignData?.signers?.filter(e => e.signed)?.length || 0;
  const thresholdPercentage =
    (multisignTotalWeight / (multiSignData?.Threshold ?? 0)) * 100;

  const Progress: React.FC<PropsWithChildren> = () => {
    return (
      <ProgressBar>
        <ProgressBarContent
          widthPercentage={String(thresholdPercentage)}
          background={'#B039BF'}
        />
      </ProgressBar>
    );
  };
  const ThresholdComponent: React.FC<PropsWithChildren> = () => {
    return (
      <>
        <ProgressBarVotes width={'60%'} noMarginBottom>
          <PassThresholdContainer>
            <Progress />
          </PassThresholdContainer>
        </ProgressBarVotes>
        <span>
          {multisignTotalWeight}/{multiSignData?.Threshold ?? 0}
        </span>
        <Tooltip msg="The transaction below isn't processed yet, it must achieve the threshold" />
      </>
    );
  };

  const multiSignListProps = {
    hashs,
    selectedHash,
    setSelectedHash,
  };

  const overviewProps = {
    hash: multiSignData?.hash,
    nonce: multiSignData?.decodedTx?.nonce,
    sender: multiSignData?.decodedTx?.sender,
    bandwidthFee: multiSignData?.decodedTx?.bandwidthFee,
    kdaFee: {
      amount:
        multiSignData?.decodedTx?.kdaFee?.amount ||
        multiSignData?.decodedTx?.kAppFee,
      kda: multiSignData?.decodedTx?.kdaFee?.kda || 'KLV',
    },
    signature: multiSignData?.raw?.Signature,
    ThresholdComponent:
      multisignTotalWeight > 0 ? ThresholdComponent : undefined,
    precisionTransaction: precision,
    loading: loading,
    MultiSignList: () => <MultiSignList {...multiSignListProps} />,
  };

  return <OverviewDetails {...overviewProps} />;
};
