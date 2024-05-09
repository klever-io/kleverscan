import Table, { ITable } from '@/components/TableV2';
import api from '@/services/api';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import React from 'react';
import { proposalsMap } from './proposalsMap';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { useContractModal } from '@/contexts/contractModal';

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
    networkParams.data.parameters = Object.keys(proposalsMap)
      .map((key, index) => {
        return {
          number: index,
          parameter: proposalsMap[key].message ? proposalsMap[key].message : '',
          currentValue: data.parameters[key]?.value
            ? `${(Number(data.parameters[key].value) / 10 ** proposalsMap[key].precision).toLocaleString()} ${proposalsMap[key].unit}`
            : '',
        };
      })
      .filter(param => param.parameter !== '' && param.currentValue !== '');
  }

  return networkParams;
};

const NetworkParams: React.FC = () => {
  const { getInteractionsButtons } = useContractModal();

  const rowSections = (props: INetworkParam): IRowSection[] => {
    const { number, parameter, currentValue } = props;

    const [ProposalButton] = getInteractionsButtons([
      {
        title: 'Propose Change',
        contractType: 'ProposalContract',
        defaultValues: {
          parameters: [{ label: number, value: '' }],
        },
        buttonStyle: 'primary',
      },
    ]);
    return [
      {
        element: props => <span key={String(number)}>#{number}</span>,
        span: 2,
        width: 100,
      },
      { element: props => <p key={parameter}>{parameter}</p>, span: 1 },
      {
        element: props => (
          <p key={currentValue} className="currentValue">
            {currentValue}
          </p>
        ),
        span: 1,
      },
      {
        element: props => <ProposalButton />,
        span: 2,
        width: 200,
      },
    ];
  };

  const header = ['Number', 'Parameter', 'Current Value', 'Change'];

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
