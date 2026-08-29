import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import { IdentityCell, RowActions } from '@/components/DataList/styles';
import { useContractName } from '@/components/TransactionsList/useContractName';
import { Mono } from '@/styles/common';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { deployerFilterHref } from './queryState';
import { shallowNavigate } from './shallowNavigate';
import {
  ContractIdentity,
  DeployerCellRow,
  DeployerCountLink,
  DeployerLink,
} from './styles';
import { useDeployerCount } from './useDeployerCount';

export interface IContractCellProps {
  address: string;
  /** The name `sc/list` sent along, when it managed to resolve one. */
  listName?: string;
  /** False while the table's own request is still in flight. */
  deferred: boolean;
}

/**
 * The contract's identity: its name when the chain has one, its address
 * otherwise, plus the row's copy and open-in-new-tab actions.
 *
 * The name is asked for separately only when the list did not carry one.
 * `sc/list` resolves names best-effort and gives up as the page grows:
 * measured on mainnet it named 9 of 10 rows at `limit=10`, 7 of 20, 4 of 50
 * and 0 to 2 of 100. So the gap is small on the default page size and most of
 * the list on a large one, and filling it per row is what keeps the column
 * meaning the same thing at every page size.
 */
export const ContractCell: React.FC<IContractCellProps> = ({
  address,
  listName,
  deferred,
}) => {
  const { t } = useTranslation(['smartContracts']);
  const resolved = useContractName(address, deferred && !listName);
  const raw = listName || resolved || '';
  const shown = raw ? safeContractName(raw) : '';

  return (
    <IdentityCell>
      {/* The title carries both readings, so the address stays reachable when
          a name covers it: contract names are owner-set and not unique. */}
      <ContractIdentity
        href={`/smart-contract/${address}`}
        data-testid="smart-contract-link"
        title={shown ? `${shown} · ${address}` : address}
      >
        {shown || <Mono>{parseAddress(address, 14)}</Mono>}
      </ContractIdentity>
      <RowActions>
        <CopyAction
          value={address}
          label={t('smartContracts:Common.CopyAddress', {
            defaultValue: 'Copy contract address',
          })}
          announcement={t('smartContracts:Common.AddressCopied', {
            defaultValue: 'Contract address copied to clipboard',
          })}
        />
        <ExplorerLink
          href={`/smart-contract/${address}`}
          label={t('smartContracts:Common.OpenContract', {
            defaultValue: 'Open contract',
          })}
          title={t('smartContracts:Common.OpenInNewTab', {
            defaultValue: 'Open in a new tab',
          })}
        />
      </RowActions>
    </IdentityCell>
  );
};

export interface IDeployerCellProps {
  deployer: string;
  deferred: boolean;
}

/**
 * Who deployed this contract, and how many it has deployed in total.
 *
 * The count is the entry point to the deployer-filtered list, which is why it
 * is a count and not a filter dropdown: 207 contracts on mainnet come from 33
 * deployers, and that list only grows.
 */
export const DeployerCell: React.FC<IDeployerCellProps> = ({
  deployer,
  deferred,
}) => {
  const { t } = useTranslation(['smartContracts']);
  const router = useRouter();
  const count = useDeployerCount(deployer, deferred);

  return (
    <DeployerCellRow>
      <DeployerLink href={`/account/${deployer}`} title={deployer}>
        <Mono>{parseAddress(deployer, 12)}</Mono>
      </DeployerLink>
      {/* Suppressed at 1: the filtered list would be the row already on
          screen. Undefined means the lookup has not answered, which is not
          the same as "one" and must not render as a dead control. */}
      {count !== undefined && count > 1 && (
        <DeployerCountLink
          href={deployerFilterHref(router.query, deployer)}
          onClick={shallowNavigate(
            router,
            deployerFilterHref(router.query, deployer),
          )}
          title={t('smartContracts:List.DeployerCountTitle', {
            defaultValue: 'Show the {{count}} contracts from this deployer',
            count,
          })}
        >
          {count}
        </DeployerCountLink>
      )}
    </DeployerCellRow>
  );
};
