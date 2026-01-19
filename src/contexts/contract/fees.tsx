import { PropsWithChildren } from 'react';
//create context

import { IParamList } from '@/types';
import { paramContractMap } from '@/utils/contracts';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { createContext, useContext } from 'react';
import { useNetworkParams } from './networkParams';

interface IFees {
  getKappFee: (contractType: string) => number;
  bandwidthFeeMultiplier: number;
  paramsList?: IParamList[];
}

export const FeeContext = createContext({} as IFees);

export const FeesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { paramsList } = useNetworkParams();

  const getKappFee = (contractType: string) => {
    return (
      Number(
        paramsList?.find(
          item =>
            item.parameterLabel ===
            paramContractMap[contractType as keyof typeof paramContractMap],
        )?.currentValue,
      ) /
      10 ** KLV_PRECISION
    );
  };

  const bandwidthFeeMultiplier =
    Number(
      paramsList?.find(item => item.parameterLabel === 'FeePerDataByte')
        ?.currentValue,
    ) /
    10 ** KLV_PRECISION;

  const values: IFees = {
    getKappFee,
    bandwidthFeeMultiplier,
    paramsList,
  };

  return <FeeContext.Provider value={values}>{children}</FeeContext.Provider>;
};

export const useFees = (): IFees => useContext(FeeContext);
