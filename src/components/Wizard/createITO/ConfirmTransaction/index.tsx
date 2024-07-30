import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import { IWizardComponents } from '../../createAsset';
import {
  BackArrowSpan,
  ButtonsContainer,
  ConfirmCardBasics,
  GenericCardContainer,
  ReviewContainer,
  WizardButton,
} from '../../createAsset/styles';
import { AssetDetails } from '../AssetDetails';
import { TransactionDetails } from '../TransactionDetails';
import { TransactionDetails2 } from '../TransactionDetails2';

export const ConfirmTransaction: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  return (
    <>
      <GenericCardContainer>
        <div>
          <p>{t('wizards:createITO.steps.createITO')}</p>
          <p>{t('wizards:createITO.steps.review')}</p>
        </div>
        <ReviewContainer>
          <p>{t('wizards:createITO.steps.reviewInfo')}</p>
          <ConfirmCardBasics tokenInfo>
            <AssetDetails />
          </ConfirmCardBasics>
          <TransactionDetails2 />
          <TransactionDetails />
        </ReviewContainer>
        <ButtonsContainer isRow>
          <BackArrowSpan onClick={() => handleStep(prev => prev - 1)}>
            <WizardLeftArrow />
          </BackArrowSpan>
          <WizardButton type="submit">
            <p>{t('wizards:common.confirm.confirmTransaction')}</p>
            <span>
              <IoArrowForward />
            </span>
          </WizardButton>
        </ButtonsContainer>
      </GenericCardContainer>
    </>
  );
};
