import { PropsWithChildren } from 'react';
//create context

import { getParamsList } from '@/services/requests/proposals';
import { IParamList } from '@/types';
import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';

interface INetwokParamsProvider {
  paramsList?: IParamList[];
}

export const NetworkParamsContext = createContext({} as INetwokParamsProvider);

export const NetworkParamsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { data: paramsList } = useQuery(
    'networkParamsProviderParamsList',
    getParamsList,
  );

  const values: INetwokParamsProvider = {
    paramsList,
  };

  return (
    <NetworkParamsContext.Provider value={values}>
      {children}
    </NetworkParamsContext.Provider>
  );
};

export const useNetworkParams = (): INetwokParamsProvider =>
  useContext(NetworkParamsContext);
