import CopyAction from '@/components/DataList/CopyAction';
import { MobileListCard } from '@/components/DataList/styles';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';
import { IBlockValidatorRow } from './row';
import {
  LeaderBadge,
  NameLine,
  ValidatorAddress,
  ValidatorKeyLink,
  ValidatorLine,
  ValidatorNameLink,
} from './styles';

interface IValidatorsMobileCardProps {
  item: IBlockValidatorRow;
  index: number;
}

const ValidatorsMobileCard: React.FC<IValidatorsMobileCardProps> = ({
  item,
  index,
}) => {
  const label =
    item.name ||
    (item.ownerAddress ? parseAddress(item.ownerAddress, 16) : 'Unknown');
  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <NameLine>
        {item.ownerAddress ? (
          <ValidatorNameLink
            href={`/validator/${item.ownerAddress}`}
            title={item.name || item.ownerAddress}
            data-testid="validator-link"
          >
            {label}
          </ValidatorNameLink>
        ) : (
          <ValidatorAddress title={item.blsKey}>{label}</ValidatorAddress>
        )}
        {item.leader && (
          <LeaderBadge $variant="accent" data-testid="block-leader">
            Leader
          </LeaderBadge>
        )}
      </NameLine>
      <ValidatorLine>
        {item.ownerAddress ? (
          <ValidatorKeyLink
            href={`/validator/${item.ownerAddress}`}
            title={item.blsKey}
          >
            {item.blsKey}
          </ValidatorKeyLink>
        ) : (
          <ValidatorAddress title={item.blsKey}>{item.blsKey}</ValidatorAddress>
        )}
        <CopyAction
          value={item.blsKey}
          label="Copy BLS key"
          announcement="BLS key copied to clipboard"
        />
      </ValidatorLine>
    </MobileListCard>
  );
};

export default ValidatorsMobileCard;
