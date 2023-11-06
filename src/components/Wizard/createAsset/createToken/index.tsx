import {
  buildTransaction,
  getType,
  precisionParse,
} from '@/components/Contract/utils';
import {
  parseSplitRoyalties,
  parseStringToNumberSupply,
  parseURIs,
} from '@/components/TransactionForms/CustomForms/utils';
import { useExtension } from '@/contexts/extension';
import { gtagEvent } from '@/utils/gtag';
import { parseAddress } from '@/utils/parseValues';
import { web } from '@klever/sdk-web';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  ConfirmSuccessTransaction,
  ConfirmTransaction,
  CreateAssetAddRoles,
  CreateAssetEightStep,
  CreateAssetFirstStep,
  CreateAssetFiveStep,
  CreateAssetFourthStep,
  CreateAssetPreConfimStep,
  CreateAssetPropertiesStep,
  CreateAssetRoyaltySteps,
  CreateAssetSecondStep,
  CreateAssetSevenStep,
  CreateAssetSixStep,
  CreateAssetStakingStep,
  CreateAssetThirdStep,
  DesktopStepsComponent,
  infinitySymbol,
  propertiesCommonDefaultValues,
  StepsBasics,
  URIsSection,
} from '..';
import { createToken, parseRoles } from '../../utils';
import { WizardBody } from '../styles';

// TODO -> Check state setadvancedsteps
const WizCreateToken: React.FC<any> = ({
  setTxHash,
  txHash,
  fromAdvancedSteps,
  setFromAdvancedSteps,
}) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const assetInfo = createToken;
  const { walletAddress } = useExtension();

  const handleAdvancedSteps = () => {
    setSelectedStep(prevStep => prevStep + 1);
  };

  const stepsProps = {
    handleStep: setSelectedStep,
    selectedStep: selectedStep,
    handleAdvancedSteps,
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
    commomValues: { basicTotalSteps },
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
      key: 'selectAssetPrecision',
      label: 'Select Asset Precision',
      isDone: false,
      component: <CreateAssetFiveStep {...stepsProps} />,
    },
    {
      key: 'selectAssetInitialSupply',
      label: 'Select Asset Initial Supply',
      isDone: false,
      component: <CreateAssetSixStep {...stepsProps} />,
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
      key: 'selectAssetUris',
      label: 'Select Asset URIs',
      isDone: false,
      component: (
        <URIsSection {...stepsProps} informations={assetInfo.commomValues} />
      ),
    },
    {
      key: 'selectAssetStakingType',
      label: 'Select Asset Staking Type',
      isDone: false,
      component: <CreateAssetStakingStep {...stepsProps} />,
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
  const assetInitialSupply = watch('initialSupply');
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
    assetInitialSupply || 0,
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

  const onSubmit = async (data: any) => {
    parseStringToNumberSupply(data);
    const parsedUris = parseURIs(data);
    const parsedRoles = parseRoles(data);
    parseSplitRoyalties(data);
    const contractyType = 'CreateAssetContract';
    await precisionParse(data, contractyType);
    if (!data?.royalties) {
      data['royalties'] = { address: data?.ownerAddress };
    }

    data.ticker = (data?.ticker as string)?.toUpperCase();
    data.type = 0;
    const parseTransaction = {
      ...data,
      uris: parsedUris,
      roles: parsedRoles,
      ticker: (data?.ticker as string)?.toUpperCase(),
      royalties: {
        address: data?.ownerAddress,
      },
    };

    try {
      const unsignedTx = await buildTransaction([
        {
          type: getType(contractyType),
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
      gtagEvent('send_transaction_wizard', {
        event_category: 'transaction',
        event_label: 'send_transaction_wizard',
        hash: response.data.txsHashes[0],
        sender: walletAddress,
        transaction_type: 'CreateAssetContract',
      });
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

export default WizCreateToken;
