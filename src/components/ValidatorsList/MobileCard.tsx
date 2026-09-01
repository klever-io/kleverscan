import { klvAmount, NUMBER_LOCALE } from '@/components/DataList/format';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AddressLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import {
  resolveValidatorVersion,
  UNKNOWN_VERSION,
} from '@/services/requests/heartbeat';
import { IValidator } from '@/types/index';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { validatorCapacity } from './capacity';
import { StatusBadge, VersionBadge } from './cells';

export interface IValidatorsMobileCardExtras {
  versionMap: Record<string, string>;
  latestVersion?: string;
  /** Same reason as on the desktop row: with the heartbeat down every version
   *  resolves to Unknown, which is also a real state here. */
  heartbeatAvailable: boolean;
}

export interface IValidatorsMobileCardProps
  extends IValidatorsMobileCardExtras {
  item: IValidator;
  index: number;
}

/**
 * Replaces the generic heading-per-cell card the shared Table falls back to.
 *
 * With ten columns that fallback paired the headings two at a time, so a card
 * read "Status Rating", "Stake Commission", "Capacity Produced", "Missed
 * Version": four made-up labels over values that belong to neither half.
 *
 * The order here is the question people open this page with: who is it, does it
 * take delegation and how full is it, then what it costs, then how it behaves.
 */
const ValidatorsMobileCard: React.FC<IValidatorsMobileCardProps> = ({
  item,
  index,
  versionMap,
  latestVersion,
  heartbeatAvailable,
}) => {
  const { t } = useTranslation(['validators']);
  const {
    ownerAddress,
    name,
    parsedAddress,
    rank,
    status,
    staked,
    commission,
    maxDelegation,
    rating,
    totalProduced,
    totalMissed,
    blsPublicKey,
  } = item;

  const resolved = resolveValidatorVersion(blsPublicKey, versionMap);
  const version = resolved === UNKNOWN_VERSION ? undefined : resolved;
  const { fill, uncapped } = validatorCapacity(staked, maxDelegation);

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <AddressLink
          href={`/validator/${ownerAddress}`}
          title={ownerAddress}
          data-testid="validator-link"
        >
          {`${rank}. ${name || parsedAddress}`}
        </AddressLink>
        <StatusBadge status={status} />
        <RowActions>
          <CopyAction
            value={ownerAddress}
            label={t('validators:List.CopyAddress')}
            announcement={t('validators:List.AddressCopied')}
            large
          />
          <ExplorerLink
            href={`/validator/${ownerAddress}`}
            label={t('validators:List.OpenValidator')}
            title={t('validators:List.OpenInNewTab')}
            large
          />
        </RowActions>
      </MobileTopRow>

      <MobileTotalRow>
        <MobileMetaItem>{t('validators:Table.Stake')}</MobileMetaItem>
        <strong>{klvAmount(staked)}</strong>
      </MobileTotalRow>

      {/* A number, not a card-wide bar: a track spanning the full card width
          dwarfed every other figure and read as a section divider. */}
      <MobileMetaRow>
        <MobileMetaItem>
          {`${t('validators:Table.Capacity')} ${
            uncapped || fill === undefined
              ? t('validators:List.NoDelegationLimit')
              : `${fill.toFixed(1)}%`
          }`}
        </MobileMetaItem>
        <MobileMetaItem>
          {`${t('validators:Table.Commission')} ${commission / 10 ** 2}%`}
        </MobileMetaItem>
      </MobileMetaRow>

      <MobileMetaRow>
        <MobileMetaItem>
          {`${t('validators:Table.Rating')} ${((rating * 100) / 10000000).toFixed(2)}%`}
        </MobileMetaItem>
        <MobileMetaItem>
          {`${t('validators:Table.Produced')} ${(totalProduced ?? 0).toLocaleString(NUMBER_LOCALE)}`}
        </MobileMetaItem>
      </MobileMetaRow>

      <MobileMetaRow>
        <MobileMetaItem>
          {`${t('validators:Table.Missed')} ${(totalMissed ?? 0).toLocaleString(NUMBER_LOCALE)}`}
        </MobileMetaItem>
        <VersionBadge
          version={version}
          isLatest={!!version && version === latestVersion}
          unknownLabel={t(
            heartbeatAvailable
              ? 'validators:List.UnknownVersion'
              : 'validators:List.VersionUnavailable',
          )}
          unknownTooltip={
            heartbeatAvailable
              ? undefined
              : t('validators:List.VersionUnavailableTooltip')
          }
        />
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default ValidatorsMobileCard;
