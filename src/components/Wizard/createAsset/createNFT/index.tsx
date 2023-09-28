import {
  buildTransaction,
  getType,
  precisionParse,
} from '@/components/Contract/utils';
import { parseURIs } from '@/components/TransactionForms/CustomForms/utils';
import { parseAddress } from '@/utils/parseValues';
import { web } from '@klever/sdk';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  ConfirmSuccessTransaction,
  ConfirmTransaction,
  CreateAssetAddRoles,
  CreateAssetEightStep,
  CreateAssetFirstStep,
  CreateAssetFourthStep,
  CreateAssetPreConfimStep,
  CreateAssetPropertiesStep,
  CreateAssetRoyaltySteps,
  CreateAssetSecondStep,
  CreateAssetSevenStep,
  CreateAssetThirdStep,
  DesktopStepsComponent,
  infinitySymbol,
  propertiesCommonDefaultValues,
  StepsBasics,
  URIsSection,
} from '..';
import { createNFT, parseRoles } from '../../utils';
import { WizardBody } from '../styles';

const WizCreateNFT: React.FC<any> = ({
  showAdvancedSteps,
  setAdvancedSteps,
  advancedSteps,
  setAddAdvanced,
  addAdvancedSteps,
  setTxHash,
  txHash,
}) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const assetInfo = createNFT;

  const stepsProps = {
    handleStep: setSelectedStep,
    selectedStep: selectedStep,
    showAdvancedSteps,
    setAddAdvanced,
    addAdvancedSteps,
    isNFT: true,
  };

  const confirmProps = {
    ...stepsProps,
    txHash: '',
  };

  const {
    commomValues: { assetType, basicTotalSteps },
    stepsInformations: {
      basicStepsLabels,
      advancedStepsIndex,
      advancedStepsLabels,
    },
  } = assetInfo;

  const advancedStepsCont = [
    {
      key: 'selectAssetUris',
      label: 'Select Asset URIs',
      isDone: false,
      component: (
        <URIsSection {...stepsProps} informations={assetInfo.commomValues} />
      ),
    },
    {
      key: 'selectroyaltiesSteps',
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
          informations={assetInfo.commomValues}
        />
      ),
    },
    {
      key: 'selectAssetProperties',
      label: 'Select Asset Properties',
      isDone: false,
      component: (
        <CreateAssetPropertiesStep
          {...stepsProps}
          informations={assetInfo.advancedSteps.properties}
        />
      ),
    },
  ];

  const [steps, setSteps] = useState([
    {
      key: 'CreateAssetInfo',
      label: 'Create Asset Information',
      isDone: false,
      component: (
        <CreateAssetFirstStep
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
        <CreateAssetSecondStep {...stepsProps} informations={assetInfo.name} />
      ),
    },
    {
      key: 'selectAssetTicker',
      label: 'Select Asset Ticker',
      isDone: false,
      component: (
        <CreateAssetThirdStep {...stepsProps} informations={assetInfo.ticker} />
      ),
    },
    {
      key: 'selectAssetOwnerAddress',
      label: 'Select Asset Owner Address',
      isDone: false,
      component: (
        <CreateAssetFourthStep
          {...stepsProps}
          informations={assetInfo.ownerAddress}
        />
      ),
    },
    {
      key: 'selectAssetMaxSupply',
      label: 'Select Asset Max Supply',
      isDone: false,
      component: (
        <CreateAssetSevenStep
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
          informations={assetInfo.commomValues}
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
          informations={assetInfo.commomValues}
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
    if (addAdvancedSteps) {
      const newSteps = steps;
      newSteps.splice(7, 0, ...advancedStepsCont);
      setSteps(newSteps);
      setSelectedStep(7);
    }
  }, [addAdvancedSteps]);

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
    advancedSteps,
    setAdvancedSteps,
    basicStepsLabels,
    basicStepsInfo,
    selectedStep,
    setSelectedStep,
    steps,
  };

  const onSubmit = async (data: any) => {
    const parsedUris = parseURIs(data);
    const parsedRoles = parseRoles(data);
    const contractyType = 'CreateAssetContract';

    await precisionParse(data, contractyType);

    data.ticker = (data?.ticker as string)?.toUpperCase();
    data.type = 1;
    const parseTransaction = {
      ...data,
      uris: parsedUris,
      roles: parsedRoles,
      royalties: {
        address: data?.ownerAddress,
      },
    };

    try {
      const unsignedTx = await buildTransaction([
        {
          type: getType('CreateAssetContract'),
          payload: parseTransaction,
        },
      ]);

      const signedTx = await window.kleverWeb.signTransaction(
        unsignedTx.result,
      );
      const response = await web.broadcastTransactions([signedTx]);
      setTxHash(response.data.txsHashes[0]);
      window.scrollTo(0, 0);
      toast.success('Transaction broadcast successfully');
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

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
