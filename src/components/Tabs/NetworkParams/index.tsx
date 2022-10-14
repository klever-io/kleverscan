import Table, { ITable } from '@/components/Table';
import { IRowSection } from '@/types/index';
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
    data: networkParams as any[],
    header,
    type: 'networkParams',
  };

  return <Table {...tableProps} />;
};

export default NetworkParams;
