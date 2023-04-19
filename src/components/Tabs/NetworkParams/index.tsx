import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import React from 'react';
import { proposalsMessages } from './proposalMessages';

interface INetworkParams extends IPaginatedResponse {
  data: {
    parameters: INetworkParam[];
  };
}

interface INetworkParam {
  number: number;
  parameter: string;
  currentValue: string;
}

const requestNetworkParams = async (): Promise<INetworkParams> => {
  const { data } = await api.get({ route: 'network/network-parameters' });

  const networkParams: INetworkParams = {
    data: { parameters: [] },
    pagination: undefined,
    code: '',
    error: '',
  };

  if (data) {
    networkParams.data.parameters = Object.keys(proposalsMessages).map(
      (key, index) => {
        return {
          number: index,
          parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
          currentValue: data.parameters[key].value,
        };
      },
    );
  }

  return networkParams;
};

const NetworkParams: React.FC = () => {
  const rowSections = (props: INetworkParam): IRowSection[] => {
    const { number, parameter, currentValue } = props;

    return [
      { element: <strong key={String(number)}>#{number}</strong>, span: 2 },
      { element: <p key={parameter}>{parameter}</p>, span: 2 },
      {
        element: (
          <p key={currentValue} className="currentValue">
            {currentValue}
          </p>
        ),
        span: 1,
      },
    ];
  };

  const header = ['Number', 'Parameter', 'Current Value'];

  const tableProps: ITable = {
    rowSections,
    dataName: 'parameters',
    header,
    type: 'networkParams',
    request: () => requestNetworkParams(),
  };

  return <Table {...tableProps} />;
};

export default NetworkParams;
