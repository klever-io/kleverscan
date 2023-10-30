//create context

import { getParamsList } from '@/services/requests/proposals';
import { paramContractMap } from '@/utils/contracts';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';

interface IFees {
  getKappFee: (contractType: string) => number;
  bandwidthFeeMultiplier: number;
}

export const FeeContext = createContext({} as IFees);

export const FeesProvider: React.FC = ({ children }) => {
  const { data: paramsList } = useQuery(
    'feesProviderParamsList',
    getParamsList,
  );

  const getKappFee = (contractType: string) => {
    return (
      Number(
        paramsList?.find(
          item => item.parameterLabel === paramContractMap[contractType],
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
  };

  return <FeeContext.Provider value={values}>{children}</FeeContext.Provider>;
};

export const useFees = (): IFees => useContext(FeeContext);
