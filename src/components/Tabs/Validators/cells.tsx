import CopyAction from '@/components/DataList/CopyAction';
import { useMiddleFit } from '@/components/FittedText/useMiddleFit';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';
import { IBlockValidatorRow } from './row';
import {
  LeaderBadge,
  NameLine,
  ValidatorAddress,
  ValidatorKeyLink,
  ValidatorKeyText,
  ValidatorLine,
  ValidatorNameLink,
} from './styles';

const FittedKey: React.FC<{ value: string; href?: string }> = ({
  value,
  href,
}) => {
  const { ref, shown } = useMiddleFit<HTMLElement>(value);

  if (href) {
    return (
      <ValidatorKeyLink
        ref={node => {
          ref.current = node;
        }}
        href={href}
        title={value}
      >
        {shown}
      </ValidatorKeyLink>
    );
  }

  return (
    <ValidatorKeyText
      ref={node => {
        ref.current = node;
      }}
      title={value}
    >
      {shown}
    </ValidatorKeyText>
  );
};

const labelFor = (row: IBlockValidatorRow): string =>
  row.name ||
  (row.ownerAddress ? parseAddress(row.ownerAddress, 16) : 'Unknown');

export const NameCell: React.FC<{ row: IBlockValidatorRow }> = ({ row }) => {
  const label = labelFor(row);
  return (
    <NameLine>
      {row.ownerAddress ? (
        <ValidatorNameLink
          href={`/validator/${row.ownerAddress}`}
          title={row.name || row.ownerAddress}
          data-testid="validator-link"
        >
          {label}
        </ValidatorNameLink>
      ) : (
        <ValidatorAddress title={row.blsKey}>{label}</ValidatorAddress>
      )}
      {row.leader && (
        <LeaderBadge $variant="accent" data-testid="block-leader">
          Leader
        </LeaderBadge>
      )}
    </NameLine>
  );
};

export const KeyCell: React.FC<{ row: IBlockValidatorRow }> = ({ row }) => (
  <ValidatorLine>
    <FittedKey
      value={row.blsKey}
      href={row.ownerAddress ? `/validator/${row.ownerAddress}` : undefined}
    />
    <CopyAction
      value={row.blsKey}
      label="Copy BLS key"
      announcement="BLS key copied to clipboard"
    />
  </ValidatorLine>
);
