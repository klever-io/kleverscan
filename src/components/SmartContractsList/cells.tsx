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
import { deployerFilterHref, readDeployerFilter } from './queryState';
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

export interface IDeployerCountBadgeProps {
  deployer: string;
  /** Undefined while the lookup has not answered, which is not the same as
   *  "one" and must not render as a dead control. */
  count?: number;
  /** The deployer the caller already narrowed the whole list to. */
  scopedTo?: string;
}

/**
 * How many contracts this deployer has, as the entry point to the filtered
 * list. Shared by the table cell and the mobile card so the rule that hides it
 * at 1 lives once: there, the filtered list would be the row already on screen.
 */
export const DeployerCountBadge: React.FC<IDeployerCountBadgeProps> = ({
  deployer,
  count,
  scopedTo,
}) => {
  const { t } = useTranslation(['smartContracts']);
  const router = useRouter();

  if (count === undefined || count <= 1) return null;
  // Same dead end as the rule above: on the already-narrowed list the link
  // would lead to the page the reader is on. The account tab narrows by route
  // segment rather than by `?deployer=`, so its caller says so explicitly
  // where the URL cannot.
  if (readDeployerFilter(router.query) === deployer) return null;
  if (scopedTo === deployer) return null;

  const href = deployerFilterHref(router.query, deployer);
  const label = t('smartContracts:List.DeployerCountTitle', {
    defaultValue: 'Show the {{count}} contracts from this deployer',
    count,
  });

  return (
    <DeployerCountLink
      href={href}
      onClick={shallowNavigate(router, href)}
      title={label}
      // The bare number is the visible text; without this the accessible name
      // is just "14".
      aria-label={label}
    >
      {count}
    </DeployerCountLink>
  );
};

export interface IDeployerCellProps {
  deployer: string;
  deferred: boolean;
  scopedTo?: string;
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
  scopedTo,
}) => {
  const count = useDeployerCount(deployer, deferred);

  return (
    <DeployerCellRow>
      <DeployerLink href={`/account/${deployer}`} title={deployer}>
        <Mono>{parseAddress(deployer, 12)}</Mono>
      </DeployerLink>
      <DeployerCountBadge
        deployer={deployer}
        count={count}
        scopedTo={scopedTo}
      />
    </DeployerCellRow>
  );
};
