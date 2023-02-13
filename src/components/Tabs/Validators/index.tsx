import Table, { ITable } from '@/components/Table';
import { IRowSection, ITransaction } from '@/types/index';
import React from 'react';

interface IValidatorsProps {
  validators: string[];
}

const Validators: React.FC<IValidatorsProps> = props => {
  const requestBlockValidators = new Promise(resolve => {
    resolve({ data: { blockValidatorList: props.validators } });
  });
  const rowSections = (validatorHash: ITransaction): IRowSection[] => {
    const sections = [
      { element: <span key="validator">{validatorHash}</span>, span: 2 },
    ];
    return sections;
  };

  const header = ['Validator'];

  const tableProps: ITable = {
    rowSections,
    header,
    dataName: 'blockValidatorList',
    type: 'validatorsList',
    request: () => requestBlockValidators,
  };

  return <Table {...tableProps} />;
};

export default Validators;
