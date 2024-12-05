import { PropsWithChildren } from 'react';
import { IAssetInformations } from '..';
import {
  CardContainer,
  GenericInfoCard,
  IconWizardClock,
  IconWizardInfoSquare,
  WizardButton,
  WizardRightArrowSVG,
} from '../styles';

export const CreateAssetWelcomeStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: {
    title,
    description,
    tooltip,
    kleverTip,
    transactionCost,
    timeEstimated,
  },
  handleStep,
  t,
}) => {
  return (
    <CardContainer>
      <div>
        <span>{title}</span>

        <span>{description}</span>

        <span>
          <IconWizardInfoSquare />
          {tooltip}
        </span>
        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <div>
        <span>
          {t('wizards:common.txCost')} {transactionCost} KLV.
        </span>
        <WizardButton
          type="button"
          onClick={() => handleStep(prev => prev + 1)}
          fullWidth
        >
          <p>{t('wizards:common.readyText')}</p>
          <WizardRightArrowSVG />
        </WizardButton>
        <span>
          <IconWizardClock style={{ height: '1rem', width: '1rem' }} />
          {t('wizards:common.estimatedTime')} <strong>{timeEstimated}</strong>
        </span>
      </div>
    </CardContainer>
  );
};
