import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  MobileListCard,
  MobileMetaItem,
  MobileTopRow,
  RowActions,
  VisuallyHidden,
} from '@/components/DataList/styles';
import { Mono } from '@/styles/common';
import { ITransaction } from '@/types';
import { ContractsName } from '@/types/contracts';
import {
  contractTypes,
  filteredSections,
  getLabelForTableField,
} from '@/utils/contracts';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  InOutBadge,
  MultiContractBadge,
  TransactionStatusBadge,
} from './badges';
import { showsInOut } from './columns';
import ContractTargetLabel from './ContractTargetLabel';
import { getTransactionRowDetails, valueDirection } from './rowDetails';
import { CardHashLink, CardLabel, CardRow, CardValue } from './styles';

export interface ITransactionsMobileCardProps {
  item: ITransaction;
  index: number;
}

/**
 * Card layout for mobile and tablet: the hash with its status on top, then
 * the same facts the desktop columns carry, one labeled line each. Replaces
 * the generic heading-per-cell card the shared Table falls back to.
 */
const TransactionsMobileCard: React.FC<ITransactionsMobileCardProps> = ({
  item,
  index,
}) => {
  const { t } = useTranslation(['transactions']);
  const router = useRouter();
  const {
    hash,
    blockNum,
    timestamp,
    sender,
    receipts,
    contract,
    kAppFee,
    bandwidthFee,
    status,
    precision,
    data,
  } = item;

  const contractType = contractTypes(contract);
  // Same source as the desktop To column, so the card and the table cannot
  // disagree about a row's counterparty (contract address for invokes, the
  // claimer for claims and withdrawals).
  const { target } = getTransactionRowDetails({
    contract,
    contractType,
    data,
    sender,
    receipts,
  });
  const direction = valueDirection({
    account:
      typeof router?.query?.account === 'string'
        ? router.query.account
        : undefined,
    sender,
    contractType,
    receipts,
  });
  // Undefined is an answer: a delegation aimed at this validator moves nothing
  // into it, and a badge either way would be a claim the transaction does not
  // make.
  const showDirection = showsInOut(router) && direction !== undefined;

  const typeLabel =
    contractType === 'Multi contract'
      ? contractType
      : // Same fallback as the desktop badge: a future contract type shows
        // its raw name instead of an empty value.
        (ContractsName[contractType as keyof typeof ContractsName] ??
        contractType);

  const customFields = filteredSections(
    contract,
    contractType,
    receipts,
    precision,
    data,
  );
  const customLabels = getLabelForTableField(contractType) ?? [];

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <CardHashLink
          href={`/transaction/${hash}`}
          data-testid="transaction-link"
        >
          <Mono>{parseAddress(hash, 16)}</Mono>
        </CardHashLink>
        <TransactionStatusBadge status={status} />
        {showDirection && <InOutBadge direction={direction} />}
        <RowActions>
          <CopyAction
            value={hash}
            label={t('transactions:Table.CopyHash', {
              defaultValue: 'Copy transaction hash',
            })}
            announcement={t('transactions:Table.HashCopied', {
              defaultValue: 'Transaction hash copied to clipboard',
            })}
            large
          />
          <ExplorerLink
            href={`/transaction/${hash}`}
            label={t('transactions:Table.OpenTransaction', {
              defaultValue: 'Open transaction in a new tab',
            })}
            title={t('transactions:Table.OpenInNewTab', {
              defaultValue: 'Open in a new tab',
            })}
            large
          />
        </RowActions>
      </MobileTopRow>
      <CardRow>
        <CardLabel>
          {t('transactions:Table.Type', { defaultValue: 'Type' })}
        </CardLabel>
        <CardValue>
          {contractType === 'Multi contract' ? (
            <MultiContractBadge contract={contract} />
          ) : (
            typeLabel
          )}
        </CardValue>
      </CardRow>
      <CardRow>
        <CardLabel>
          {t('transactions:From', { defaultValue: 'From' })}
        </CardLabel>
        <CardValue>
          <Link href={`/account/${sender}`}>
            <Mono>{parseAddress(sender, 16)}</Mono>
          </Link>
        </CardValue>
      </CardRow>
      <CardRow>
        <CardLabel>{t('transactions:To', { defaultValue: 'To' })}</CardLabel>
        <CardValue>
          {target ? (
            <Link
              href={`${target.isContract ? '/smart-contract' : '/account'}/${
                target.address
              }`}
            >
              <ContractTargetLabel
                address={target.address}
                isContract={target.isContract}
                truncateTo={16}
              />
            </Link>
          ) : (
            <>
              <Mono aria-hidden="true">--</Mono>
              <VisuallyHidden>
                {t('transactions:Table.NotApplicable', {
                  defaultValue: 'Not applicable',
                })}
              </VisuallyHidden>
            </>
          )}
        </CardValue>
      </CardRow>
      <CardRow>
        <CardLabel>
          {t('transactions:Table.BlockFees', { defaultValue: 'Block/Fees' })}
        </CardLabel>
        <CardValue>
          <Link href={`/block/${blockNum || 0}`}>{blockNum || 0}</Link>
          <MobileMetaItem>
            {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
          </MobileMetaItem>
        </CardValue>
      </CardRow>
      {customLabels.map((label, fieldIndex) =>
        customFields[fieldIndex] ? (
          <CardRow key={label}>
            <CardLabel>
              {label === 'Type'
                ? // Several label sets (Smart Contract, ITO Trigger) name
                  // their first field "Type" too; on desktop the column
                  // headings disambiguate, on one card the same label twice
                  // with different values reads as a contradiction.
                  t('transactions:Table.ActionType', {
                    defaultValue: 'Action type',
                  })
                : label}
            </CardLabel>
            <CardValue>{customFields[fieldIndex]}</CardValue>
          </CardRow>
        ) : null,
      )}
      <CardRow>
        <MobileMetaItem>
          {formatDate(timestamp || Date.now(), { showElapsedTime: true })}
        </MobileMetaItem>
      </CardRow>
    </MobileListCard>
  );
};

export default TransactionsMobileCard;
