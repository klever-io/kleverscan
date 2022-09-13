import Table, { ITable } from '@/components/Table';
import React from 'react';

interface INetworkProps {
  networkParams: INetworkParams;
}

interface INetworkParams {
  [index: number]: INetworkParam;
}

interface INetworkParam {
  number: number;
  parameter: string;
  currentValue: string;
}

const NetworkParams: React.FC<INetworkProps> = ({ networkParams }) => {
  const rowSections = (props: INetworkParam): JSX.Element[] => {
    const { number, parameter, currentValue } = props;

    return [
      <strong key={String(number)}>#{number}</strong>,
      <p key={parameter}>{parameter}</p>,
      <p key={currentValue} className="currentValue">
        {currentValue}
      </p>,
    ];
  };

  const header = ['Number', 'Parameter', 'Current Value'];

  const tableProps: ITable = {
    rowSections,
    columnSpans: [1, 2, 1],
    data: networkParams as any[],
    header,
    type: 'networkParams',
  };

  return <Table {...tableProps} />;
};

export default NetworkParams;
