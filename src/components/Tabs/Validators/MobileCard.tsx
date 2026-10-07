import { MobileListCard } from '@/components/DataList/styles';
import React from 'react';
import { KeyCell, NameCell } from './cells';
import { IBlockValidatorRow } from './row';

interface IValidatorsMobileCardProps {
  item: IBlockValidatorRow;
  index: number;
}

const ValidatorsMobileCard: React.FC<IValidatorsMobileCardProps> = ({
  item,
  index,
}) => (
  <MobileListCard data-testid={`table-row-${index}`}>
    <NameCell row={item} />
    <KeyCell row={item} />
  </MobileListCard>
);

export default ValidatorsMobileCard;
