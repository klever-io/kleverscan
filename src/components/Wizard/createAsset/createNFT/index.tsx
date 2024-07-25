import { parseCreateAsset } from '@/components/TransactionForms/CustomForms/CreateAsset';
import { useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ConfirmSuccessTransaction,
  ConfirmTransaction,
  CreateAssetAddRoles,
  CreateAssetEightStep,
  CreateAssetMaxSupplyStep,
  CreateAssetNameStep,
  CreateAssetOwnerAddressStep,
  CreateAssetPreConfimStep,
  CreateAssetPropertiesStep,
  CreateAssetRoyaltySteps,
  CreateAssetTickerStep,
  CreateAssetWelcomeStep,
  DesktopStepsComponent,
  StepsBasics,
  URIsSection,
  infinitySymbol,
  propertiesCommonDefaultValues,
} from '..';
import { createNFT } from '../../utils';
import { WizardBody } from '../styles';

const WizCreateNFT: React.FC<PropsWithChildren<any>> = ({
  setTxHash,
  txHash,
  fromAdvancedSteps,
  setFromAdvancedSteps,
}) => {
  const { t } = useTranslation(['common', 'wizards']);
  const [selectedStep, setSelectedStep] = useState(0);
  const assetInfo = createNFT(t);

  const { walletAddress } = useExtension();

  const handleAdvancedSteps = () => {
    setSelectedStep(prevStep => prevStep + 1);
  };

  const stepsProps = {
    handleStep: setSelectedStep,
    selectedStep: selectedStep,
    handleAdvancedSteps,
    isNFT: true,
    t,
  };

  const lastStepProps = {
    ...stepsProps,
    isLastStep: true,
    setFromAdvancedSteps,
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
      isDone: false,
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
      isDone: false,
      component: (
        <CreateAssetNameStep {...stepsProps} informations={assetInfo.name} />
      ),
    },
    {
      key: 'selectAssetTicker',
      label: 'Select Asset Ticker',
      isDone: false,
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
        <CreateAssetEightStep {...stepsProps} informations={assetInfo.logo} />
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
  const assetMaxSupply = watch('maxSupply');
  const assetImage = watch('logo');
  const ownerAddress = watch('ownerAddress');

  useEffect(() => {
    if (selectedStep === steps.length) return;
    setActiveStep(steps[selectedStep]);
  }, [selectedStep]);

  const basicStepsInfo = [
    assetName,
    assetTicker,
    parseAddress(ownerAddress || '', 14),
    assetMaxSupply || infinitySymbol,
    parseAddress(assetImage || '', 14) || '--',
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
    steps,
  };

  const { handleSubmit: handleContractSubmit, txHash: txContractHash } =
    useContract();

  const onSubmit = async (data: any) => {
    data.type = 1;
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

export default WizCreateNFT;
