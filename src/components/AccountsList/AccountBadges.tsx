import { BadgePill, VisuallyHidden } from '@/components/DataList/styles';
import Tooltip from '@/components/Tooltip';
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

  // One badge with two forms: a genesis validator is also a validator.
  const roleKey = genesisValidator ? 'GenesisValidator' : 'Validator';
  const roleTooltip = t(`accounts:Badges.${roleKey}Tooltip`);
  // Through the bundle so the sentence is not half-translated, falling back to
  // the raw value because the chain field is untyped.
  const listState = validatorList
    ? t(`accounts:Badges.ListState.${validatorList}`, {
        defaultValue: validatorList,
      })
    : '';

  // Focusable tooltips instead of `title`: a title never opens from the
  // keyboard or on touch, and readers expose it inconsistently (#699). The
  // list state also rides inside the pill as hidden text, so it reads with
  // the badge; visible it is not, because it changes per epoch and this row
  // is not where someone comes to read it.
  return (
    <>
      {foundation && (
        <Tooltip
          msg={t('accounts:Badges.FoundationTooltip')}
          focusable
          Component={() => (
            <BadgePill $variant="accent">
              {t('accounts:Badges.Foundation')}
            </BadgePill>
          )}
        />
      )}
      {validator && (
        <Tooltip
          msg={listState ? `${roleTooltip} (${listState})` : roleTooltip}
          focusable
          Component={() => (
            <BadgePill $variant={genesisValidator ? 'success' : 'neutral'}>
              {t(`accounts:Badges.${roleKey}`)}
              {listState && <VisuallyHidden>{`, ${listState}`}</VisuallyHidden>}
            </BadgePill>
          )}
        />
      )}
    </>
  );
};

export default AccountBadges;
