import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';

interface IValidatorsProps {
  validators: string[];
}

const Validators: React.FC<PropsWithChildren<IValidatorsProps>> = props => {
  const validators = props.validators;
  const requestBlockValidators: Promise<IPaginatedResponse> = Promise.resolve({
    data: { blockValidatorList: validators },
    pagination: undefined,
    code: '',
    error: '',
  });
  const { isMobile } = useMobile();
  const rowSections = (validatorHash: string): IRowSection[] => {
    const sections: IRowSection[] = [
      {
        element: props => (
          <span>
            {isMobile ? parseAddress(validatorHash, 36) : validatorHash}
          </span>
        ),
        span: 2,
      },
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
