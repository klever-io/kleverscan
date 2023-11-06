import {
  buildTransaction,
  getType,
  precisionParse,
} from '@/components/Contract/utils';
import { ConfigITOData } from '@/components/TransactionForms/CustomForms/ConfigITO';
import {
  parseDates,
  parseKda,
  parsePackInfo,
  parseUndefinedValues,
  parseWhitelistInfo,
} from '@/components/TransactionForms/CustomForms/utils';
import { useExtension } from '@/contexts/extension';
import { gtagEvent } from '@/utils/gtag';
import { parseAddress } from '@/utils/parseValues';
import { web } from '@klever/sdk-web';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  ConfirmTransaction,
  CreateITOFourthStep,
  CreateITOSecondStep,
  CreateITOSevenStep,
  CreateITOSixStep,
  CreateITOThirdStep,
  CreatePackInfoSteps,
  CreateWhiteListSettingsSteps,
  propertiesCommonDefaultValuesITO,
} from '..';
import {
  ConfirmSuccessTransaction,
  CreateAssetFirstStep,
  DesktopStepsComponent,
  StepsBasics,
} from '../../createAsset';
import { WizardBody } from '../../createAsset/styles';
import { createITO } from '../../utils';

export const WizCreateITO: React.FC<any> = ({
  setAddAdvanced,
  addAdvancedSteps,
  setTxHash,
  txHash,
}) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const itoInfo = createITO;
  const stepsProps = {
    handleStep: setSelectedStep,
    selectedStep: selectedStep,
    setAddAdvanced,
    addAdvancedSteps,
  };

  const { walletAddress } = useExtension();

  const confirmProps = {
    ...stepsProps,
    txHash: '',
  };

  const {
    commomValues: { basicTotalSteps },
    stepsInformations: { basicStepsLabels },
  } = itoInfo;

  const [steps, setSteps] = useState([
    {
      key: 'CreateITOInfo',
      label: 'Create ITO Information',
      isDone: false,
      component: (
        <CreateAssetFirstStep {...stepsProps} informations={itoInfo.welcome} />
      ),
    },
    {
      key: 'selectAssetOrCollection',
      label: 'Select Asset / Collection name',
      isDone: false,
      component: (
        <CreateITOSecondStep {...stepsProps} informations={itoInfo.name} />
      ),
    },
    {
      key: 'selectReceiverAddress',
      label: 'Receiver Address',
      isDone: false,
      component: (
        <CreateITOThirdStep
          {...stepsProps}
          informations={itoInfo.receiverAddress}
        />
      ),
    },
    {
      key: 'SetTimeITO',
      label: 'Time ITO',
      isDone: false,
      component: (
        <CreateITOFourthStep {...stepsProps} informations={itoInfo.itoTime} />
      ),
    },
    {
      key: 'SetMaxAmount',
      label: 'Max Amount',
      isDone: false,
      component: (
        <CreateITOSixStep {...stepsProps} informations={itoInfo.maxAmount} />
      ),
    },
    {
      key: 'setStatus',
      label: 'Status',
      isDone: false,
      component: (
        <CreateITOSevenStep {...stepsProps} informations={itoInfo.status} />
      ),
    },
    {
      key: 'setPackInfo',
      label: 'Pack Info',
      isDone: false,
      component: (
        <CreatePackInfoSteps {...stepsProps} informations={itoInfo.status} />
      ),
    },
    {
      key: 'setWhiteListSettings',
      label: 'White List',
      isDone: false,
      component: (
        <CreateWhiteListSettingsSteps
          {...stepsProps}
          informations={itoInfo.whitelistSettings}
        />
      ),
    },
    {
      key: 'confirmTransaction',
      label: 'Confirm Transaction',
      isDone: false,
      component: <ConfirmTransaction {...stepsProps} />,
    },
  ]);
  const [activeStep, setActiveStep] = useState(steps[0]);

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      ...propertiesCommonDefaultValuesITO,
    },
  });
  const { handleSubmit, watch } = methods;

  const collection = watch('collection');
  const receiverAddress = watch('receiverAddress');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const maxAmount = watch('maxAmount');
  const status = watch('status');

  const itoTimeFormatted = (time: string): string => {
    if (!time) {
      return '--';
    }
    const date = new Date(time);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}`;
    return formattedDate;
  };
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

  useEffect(() => {
    if (selectedStep === steps.length) return;
    setActiveStep(steps[selectedStep]);
  }, [selectedStep]);

  const basicStepsInfo = [
    collection,
    parseAddress(receiverAddress, 14),
    `${itoTimeFormatted(startTime)} to ${itoTimeFormatted(endTime)}`,
    maxAmount || 0,
    status || 1,
  ];

  const onSubmit = async (data: ConfigITOData) => {
    const contractType = 'ConfigITOContract';
    parseDates(data);
    parseUndefinedValues(data);
    parseWhitelistInfo(data);
    parsePackInfo(data);
    const payload = JSON.parse(JSON.stringify(parseKda(data, contractType)));
    await precisionParse(payload, contractType);
    const parseTransaction = {
      ...payload,
    };
    try {
      const { result: unsignedTx } = await buildTransaction([
        {
          type: getType(contractType),
          payload: parseTransaction,
        },
      ]);
      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);
      const response = await web.broadcastTransactions([signedTx]);
      setTxHash(response.data.txsHashes[0]);
      window.scrollTo(0, 0);
      toast.success('Transaction broadcast successfully');

      gtagEvent('send_transaction_wizard', {
        event_category: 'transaction',
        event_label: 'send_transaction_wizard',
        hash: response.data.txsHashes[0],
        sender: walletAddress,
        transaction_type: 'ConfigITOContract',
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };

  const stepsCompProps = {
    selectedStep,
    steps,
    basicTotalSteps,
  };
  const deskStepsProps = {
    ...stepsCompProps,
    basicStepsLabels,
    basicStepsInfo,
    selectedStep,
    setSelectedStep,
    setSteps,
    titleName: 'SET UP ITO',
  };
  return (
    <>
      <DesktopStepsComponent {...deskStepsProps} />
      <WizardBody isFirstContent={activeStep.key === 'CreateITOInfo'}>
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
