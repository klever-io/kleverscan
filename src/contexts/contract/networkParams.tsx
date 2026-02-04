//create context

import { getParamsList } from '@/services/requests/proposals';
import { IParamList } from '@/types';
import { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';

interface INetworkParamsProvider {
  paramsList?: IParamList[];
}

export const NetworkParamsContext = createContext({} as INetworkParamsProvider);

export const NetworkParamsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { data: paramsList } = useQuery({
    queryKey: ['networkParamsProviderParamsList'],
    queryFn: getParamsList,
  });

  const values: INetworkParamsProvider = {
    paramsList,
  };

  return (
    <NetworkParamsContext.Provider value={values}>
      {children}
    </NetworkParamsContext.Provider>
  );
};

export const useNetworkParams = (): INetworkParamsProvider =>
  useContext(NetworkParamsContext);
