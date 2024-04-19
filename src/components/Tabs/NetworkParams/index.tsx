import Table, { ITable } from '@/components/TableV2';
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
    networkParams.data.parameters = Object.keys(proposalsMessages)
      .map((key, index) => {
        return {
          number: index,
          parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
          currentValue: data.parameters[key]?.value
            ? data.parameters[key].value
            : '',
        };
      })
      .filter(param => param.parameter !== '' && param.currentValue !== '');
  }

  return networkParams;
};

const NetworkParams: React.FC = () => {
  const rowSections = (props: INetworkParam): IRowSection[] => {
    const { number, parameter, currentValue } = props;

    return [
      {
        element: props => <span key={String(number)}>#{number}</span>,
        span: 2,
        width: 100,
      },
      { element: props => <p key={parameter}>{parameter}</p>, span: 2 },
      {
        element: props => (
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
