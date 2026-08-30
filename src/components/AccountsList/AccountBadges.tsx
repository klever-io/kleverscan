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

  const foundationMsg = t('accounts:Badges.FoundationTooltip');
  const roleMsg = listState ? `${roleTooltip} (${listState})` : roleTooltip;

  // Focusable tooltips instead of `title`: a title never opens from the
  // keyboard or on touch, and readers expose it inconsistently (#699). The
  // full message also rides inside each pill as hidden text, per the
  // multi-contract badge precedent: the tooltip mounts only on focus, so a
  // reader in browse mode would otherwise never meet the text at all.
  return (
    <>
      {foundation && (
        <Tooltip
          msg={foundationMsg}
          focusable
          Component={() => (
            <BadgePill $variant="accent">
              {t('accounts:Badges.Foundation')}
              <VisuallyHidden>{`, ${foundationMsg}`}</VisuallyHidden>
            </BadgePill>
          )}
        />
      )}
      {validator && (
        <Tooltip
          msg={roleMsg}
          focusable
          Component={() => (
            <BadgePill $variant={genesisValidator ? 'success' : 'neutral'}>
              {t(`accounts:Badges.${roleKey}`)}
              <VisuallyHidden>{`, ${roleMsg}`}</VisuallyHidden>
            </BadgePill>
          )}
        />
      )}
    </>
  );
};

export default AccountBadges;
