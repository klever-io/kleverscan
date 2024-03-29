import Table, { ITable } from '@/components/TableV2';
import { IPaginatedResponse, IRowSection, ITransaction } from '@/types/index';
import React from 'react';

interface IValidatorsProps {
  validators: string[];
}

const Validators: React.FC<IValidatorsProps> = props => {
  const validators = props.validators;
  const requestBlockValidators: Promise<IPaginatedResponse> = Promise.resolve({
    data: { blockValidatorList: validators },
    pagination: undefined,
    code: '',
    error: '',
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
