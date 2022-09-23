import Table, { ITable } from '@/components/Table';
import { ITransaction } from '@/types/index';
import React from 'react';

interface IValidatorsProps {
  validators: string[];
}

const Validators: React.FC<IValidatorsProps> = props => {
  const rowSections = (validatorHash: ITransaction): JSX.Element[] => {
    const sections = [<span key="validator">{validatorHash}</span>];
    return sections;
  };

  const header = ['Validator '];

  const tableProps: ITable = {
    rowSections: rowSections,
    data: Object.values(props.validators) as any[],
    header,
    type: 'validatorsList',
    columnSpans: [2, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  };

  return <Table {...tableProps} />;
};

export default Validators;
