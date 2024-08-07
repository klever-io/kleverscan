import { parseCreateAsset } from '@/components/TransactionForms/CustomForms/CreateAsset';
import { useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { infinitySymbol, propertiesCommonDefaultValues } from '..';
import { createSFT } from '../../utils';
import { ConfirmSuccessTransaction } from '../ConfirmSuccessTransaction';
import { ConfirmTransaction } from '../ConfirmTransaction';
import { CreateAssetAddRoles } from '../CreateAssetAddRoles';
import { CreateAssetLogoURL } from '../CreateAssetLogoURL';
import { CreateAssetMaxSupplyStep } from '../CreateAssetMaxSupplyStep';
import { CreateAssetNameStep } from '../CreateAssetNameStep';
import { CreateAssetOwnerAddressStep } from '../CreateAssetOwnerAddressStep';
import { CreateAssetPreConfimStep } from '../CreateAssetPreConfimStep';
import { CreateAssetPropertiesStep } from '../CreateAssetPropertiesStep';
import { CreateAssetRoyaltySteps } from '../CreateAssetRoyaltySteps';
import { CreateAssetStakingStep } from '../CreateAssetStakingStep';
import { CreateAssetTickerStep } from '../CreateAssetTickerStep';
import { CreateAssetWelcomeStep } from '../CreateAssetWelcomeStep';
import { CreatePrecisionStep } from '../CreatePrecisionStep';
import { DesktopStepsComponent } from '../DesktopStepsComponent';
import { StepsBasics } from '../StepsBasics';
import { WizardBody } from '../styles';
import { URIsSection } from '../URIsSection';

export const WizCreateSFT: React.FC<PropsWithChildren<any>> = ({
  setTxHash,
  txHash,
  fromAdvancedSteps,
}) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const { walletAddress } = useExtension();
  const { t } = useTranslation(['common', 'wizards']);

  const assetInfo = createSFT(t);

  const handleAdvancedSteps = () => {
    setSelectedStep(prevStep => prevStep + 1);
  };

  const stepsProps = {
    handleStep: setSelectedStep,
    selectedStep: selectedStep,
    handleAdvancedSteps,
    t,
  };

  const lastStepProps = {
    ...stepsProps,
    isLastStep: true,
    fromAdvancedSteps,
  };

  const confirmProps = {
    ...stepsProps,
    txHash: '',
    fromAdvancedSteps,
  };

  const {
    commonValues: { basicTotalSteps },
    stepsInformations: {
      basicStepsLabels,
      advancedStepsIndex,
      advancedStepsLabels,
    },
  } = assetInfo;

  const [steps, setSteps] = useState([
    {
      key: 'CreateAssetInfo',
      label: 'Create Asset Information',
      isDone: true,
      component: (
        <CreateAssetWelcomeStep
          {...stepsProps}
          informations={assetInfo.welcome}
        />
      ),
    },
    {
      key: 'selectAssetName',
      label: 'Select Asset Name',
      isDone: true,
      component: (
        <CreateAssetNameStep {...stepsProps} informations={assetInfo.name} />
      ),
    },
    {
      key: 'selectAssetTicker',
      label: 'Select Asset Ticker',
      isDone: true,
      component: (
        <CreateAssetTickerStep
          {...stepsProps}
          informations={assetInfo.ticker}
        />
      ),
    },
    {
      key: 'selectAssetOwnerAddress',
      label: 'Select Asset Owner Address',
      isDone: false,
      component: (
        <CreateAssetOwnerAddressStep
          {...stepsProps}
          informations={assetInfo.ownerAddress}
        />
      ),
    },
    {
      key: 'selectAssetPrecision',
      label: 'Select Asset Precision',
      isDone: false,
      component: <CreatePrecisionStep {...stepsProps} />,
    },
    {
      key: 'selectAssetMaxSupply',
      label: 'Select Asset Maximum Supply',
      isDone: false,
      component: (
        <CreateAssetMaxSupplyStep
          {...stepsProps}
          informations={assetInfo.maxSupply}
        />
      ),
    },
    {
      key: 'selectAssetLogo',
      label: 'Add Asset Logo URI',
      isDone: false,
      component: (
        <CreateAssetLogoURL {...stepsProps} informations={assetInfo.logo} />
      ),
    },
    {
      key: 'preConfirmOptions',
      label: 'Create With Basic or advanced options',
      isDone: false,
      component: (
        <CreateAssetPreConfimStep
          {...stepsProps}
          informations={assetInfo.commonValues}
        />
      ),
    },
    {
      key: 'selectAssetUris',
      label: 'Select Asset URIs',
      isDone: false,
      component: (
        <URIsSection {...stepsProps} informations={assetInfo.commonValues} />
      ),
    },
    {
      key: 'selectAssetStakingType',
      label: 'Select Asset Staking Type',
      isDone: false,
      component: <CreateAssetStakingStep {...stepsProps} />,
    },
    {
      key: 'selectRoyaltiesSteps',
      label: 'Select Asset Royalties Steps',
      isDone: false,
      component: <CreateAssetRoyaltySteps {...stepsProps} />,
    },
    {
      key: 'selectAssetRoles',
      label: 'Select Asset Roles',
      isDone: false,
      component: (
        <CreateAssetAddRoles
          {...stepsProps}
          informations={assetInfo.commonValues}
        />
      ),
    },
    {
      key: 'selectAssetProperties',
      label: 'Select Asset Properties',
      isDone: false,
      component: (
        <CreateAssetPropertiesStep
          {...lastStepProps}
          informations={assetInfo.advancedSteps.properties}
        />
      ),
    },
    {
      key: 'confirmTransaction',
      label: 'Confirm Transaction',
      isDone: false,
      component: (
        <ConfirmTransaction
          {...confirmProps}
          informations={assetInfo.commonValues}
        />
      ),
    },
  ]);

  const [activeStep, setActiveStep] = useState(steps[0]);

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      ...propertiesCommonDefaultValues,
      precision: 2,
      initialSupply: '',
    },
  });
  const { handleSubmit, watch } = methods;

  useEffect(() => {
    setSteps(prev => {
      return prev.map((e, index) => {
        if (selectedStep > index) {
          return { ...e, isDone: true };
        }
        return e;
      });
    });
  }, [activeStep]);

  const assetName = watch('name');
  const assetTicker = watch('ticker');
  const assetPrecision = watch('precision');
  const ownerAddress = watch('ownerAddress');
  const assetMaxSupply = watch('maxSupply');
  const assetImage = watch('logo');

  useEffect(() => {
    if (selectedStep === steps.length) return;
    setActiveStep(steps[selectedStep]);
  }, [selectedStep]);

  const basicStepsInfo = [
    assetName,
    assetTicker,
    parseAddress(ownerAddress, 14),
    assetPrecision,
    assetMaxSupply || infinitySymbol,
    parseAddress(assetImage, 14) || '--',
  ];

  const stepsCompProps = {
    selectedStep,
    steps,
    advancedStepsLabels,
    basicTotalSteps,
    advancedStepsIndex,
  };

  const deskStepsProps = {
    ...stepsCompProps,
    basicStepsLabels,
    basicStepsInfo,
    selectedStep,
    setSelectedStep,
    setSteps,
  };
  const { handleSubmit: handleContractSubmit, txHash: txContractHash } =
    useContract();

  const onSubmit = async (data: any) => {
    data.type = 2;
    const rowData = parseCreateAsset(data);
    await handleContractSubmit(rowData, '', 'CreateAssetContract', 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (txContractHash) {
      setTxHash(txContractHash);
    }
  }, [txContractHash]);

  return (
    <>
      <DesktopStepsComponent {...deskStepsProps} />
      <WizardBody isFirstContent={activeStep.key === 'CreateAssetInfo'}>
        {!txHash && (
          <>
            <StepsBasics {...stepsCompProps} />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {activeStep.component}
              </form>
            </FormProvider>
          </>
        )}
        {txHash && <ConfirmSuccessTransaction txHash={txHash} />}
      </WizardBody>
    </>
  );
};
