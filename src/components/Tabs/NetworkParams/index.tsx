import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
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
  const TableBody: React.FC<INetworkParam> = ({
    number,
    parameter,
    currentValue,
  }) => {
    return (
      <Row type="networkParams">
        <span>
          <strong>#{number}</strong>
        </span>
        <span>
          <p>{parameter}</p>
        </span>
        <span>
          <p className="currentValue">{currentValue}</p>
        </span>
      </Row>
    );
  };

  const header = ['Number', 'Parameter', 'Current Value'];

  const tableProps: ITable = {
    body: TableBody,
    data: networkParams as any[],
    header,
    type: 'networkParams',
  };

  return <Table {...tableProps} />;
};

export default NetworkParams;
