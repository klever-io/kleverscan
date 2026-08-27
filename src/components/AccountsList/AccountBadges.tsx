import { BadgePill } from '@/components/DataList/styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import type { IAccountBadges } from './badges';

export interface IAccountBadgesProps {
  badges: IAccountBadges;
}

/** Chain-decided facts only: an account name is self-chosen, so it is
 *  deliberately not badged here. */
const AccountBadges: React.FC<IAccountBadgesProps> = ({ badges }) => {
  const { t } = useTranslation(['accounts']);
  const { foundation, validator, genesisValidator, validatorList } = badges;

  if (!foundation && !validator) return null;

  // One badge with two forms, not two: a genesis validator is also a
  // validator, so showing both would say the same thing twice.
  const roleKey = genesisValidator ? 'GenesisValidator' : 'Validator';
  const roleTooltip = t(`accounts:Badges.${roleKey}Tooltip`);
  // Through the bundle so the sentence is not half-translated, falling back to
  // the raw value because the chain field is untyped.
  const listState = validatorList
    ? t(`accounts:Badges.ListState.${validatorList}`, {
        defaultValue: validatorList,
      })
    : '';

  return (
    <>
      {foundation && (
        <BadgePill
          $variant="accent"
          title={t('accounts:Badges.FoundationTooltip')}
        >
          {t('accounts:Badges.Foundation')}
        </BadgePill>
      )}
      {validator && (
        <BadgePill
          $variant={genesisValidator ? 'success' : 'neutral'}
          // List state rides in the tooltip, not its own badge: it changes per
          // epoch and this row is not where someone comes to read it.
          title={listState ? `${roleTooltip} (${listState})` : roleTooltip}
        >
          {t(`accounts:Badges.${roleKey}`)}
        </BadgePill>
      )}
    </>
  );
};

export default AccountBadges;
