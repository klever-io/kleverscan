import { NUMBER_LOCALE } from '@/components/DataList/format';
import {
  AddressLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
} from '@/components/DataList/styles';
import { useContractName } from '@/components/TransactionsList/useContractName';
import { SmartContractsList } from '@/types/smart-contract';
import { safeContractName } from '@/utils/contractName';
import { formatDate, formatDateWithSeconds } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { CONTRACT_COLUMNS, ContractColumnKey } from './columns';
import { MobileContractLink } from './styles';

export interface IContractsMobileCardExtras {
  deferred: boolean;
}

export interface IContractsMobileCardProps extends IContractsMobileCardExtras {
  item: SmartContractsList;
  index: number;
}

/**
 * Replaces the bordered card the old page drew, which set its colours by hand
 * and so rendered white text on the light theme's near-white page (1,10:1).
 * This one takes them from the shared card, which cannot make that mistake.
 */
const ContractsMobileCard: React.FC<IContractsMobileCardProps> = ({
  item,
  index,
  deferred,
}) => {
  const { t } = useTranslation(['smartContracts']);
  const label = (key: ContractColumnKey): string => {
    const column = CONTRACT_COLUMNS.find(c => c.key === key);
    return column ? t(column.i18nKey, { defaultValue: column.header }) : key;
  };

  const {
    name,
    contractAddress,
    deployer,
    deployTxHash,
    timestamp,
    upgrades,
    totalTransactions,
  } = item;

  const resolved = useContractName(contractAddress, deferred && !name);
  const raw = name || resolved || '';
  const shown = raw ? safeContractName(raw) : '';
  const elapsed = formatDate(timestamp, { showElapsedTime: true }).split(
    ' (',
  )[0];
  const upgradeCount = Array.isArray(upgrades) ? upgrades.length : 0;

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <MobileContractLink
          href={`/smart-contract/${contractAddress}`}
          data-testid="smart-contract-link"
          title={shown ? `${shown} · ${contractAddress}` : contractAddress}
          $isName={Boolean(shown)}
        >
          {shown || parseAddress(contractAddress, 14)}
        </MobileContractLink>
        <MobileMetaItem title={formatDateWithSeconds(timestamp)}>
          {elapsed}
        </MobileMetaItem>
      </MobileTopRow>

      <MobileTotalRow>
        <MobileMetaItem>{label('transactions')}</MobileMetaItem>
        <strong>
          {(totalTransactions ?? 0).toLocaleString(NUMBER_LOCALE)}
        </strong>
      </MobileTotalRow>

      <MobileMetaRow>
        <AddressLink href={`/account/${deployer}`} title={deployer}>
          {parseAddress(deployer, 12)}
        </AddressLink>
        <MobileMetaItem>
          {label('upgrades')}{' '}
          {upgradeCount > 0
            ? upgradeCount.toLocaleString(NUMBER_LOCALE)
            : '- -'}
        </MobileMetaItem>
      </MobileMetaRow>

      <MobileMetaRow>
        <MobileMetaItem>{label('deployTx')}</MobileMetaItem>
        <AddressLink href={`/transaction/${deployTxHash}`} title={deployTxHash}>
          {parseAddress(deployTxHash, 12)}
        </AddressLink>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default ContractsMobileCard;
