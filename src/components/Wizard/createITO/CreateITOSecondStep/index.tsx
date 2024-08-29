import { KDASelect } from '@/components/TransactionForms/KDASelect';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { PropsWithChildren, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetITOInformations } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import { ConnectButtonComponent } from '../../createAsset/ConnectButtonComponent';
import {
  ErrorInputContainer,
  GenericCardContainer,
} from '../../createAsset/styles';
import { checkEmptyField } from '../../utils';

export const CreateITOSecondStep: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
  t,
}) => {
  const { setSelectedContractType } = useMulticontract();
  const {
    formState: { errors },
    watch,
  } = useFormContext();

  const collection = watch('collection');

  useEffect(() => {
    setSelectedContractType('ConfigITOContract');
  }, []);

  const buttonsProps = {
    handleStep,
    next: !!(!errors?.collection && checkEmptyField(collection)),
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <KDASelect required />
          <ConnectButtonComponent />
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
