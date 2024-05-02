import { WizardLeftArrow } from '@/assets/icons';
import Select from '@/components/Contract/Select';
import { statusOptions } from '@/components/TransactionForms/CustomForms/ConfigITO';
import { KDASelect } from '@/components/TransactionForms/KDASelect';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { getAsset } from '@/services/requests/asset';
import { IAsset } from '@/types';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IoArrowForward } from 'react-icons/io5';
import { useQuery } from 'react-query';
import {
  ButtonsComponent,
  ConnectButtonComponent,
  IWizardComponents,
  infinitySymbol,
} from '../createAsset';
import {
  AddressesContainer,
  BackArrowSpan,
  BorderedButton,
  ButtonsContainer,
  ChangedAddressContainer,
  ConfigITOStartTime,
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ConfirmCardImage,
  ErrorInputContainer,
  ErrorMessage,
  GenericAddressCard,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  IconWizardInfoSquare,
  InfoCard,
  ReviewContainer,
  UriButtonsContainer,
  WizardAddressCheck,
  WizardButton,
  WizardFailAddressCheck,
  WizardRightArrowSVG,
} from '../createAsset/styles';
import { checkEmptyField } from '../utils';

interface IAssetITOInformations extends IWizardComponents {
  informations: {
    title?: string;
    description?: string;
    tooltip?: string;
    kleverTip?: string;
    transactionCost?: string;
    timeEstimated?: string;
    assetType?: number;
    additionalFields?: boolean;
    currentStep?: string;
    formValue?: string;
    nameTime?: string;
  };
}

interface IPackInfoITO {
  packInfoIndex: number;
}
statusOptions;
interface IStatusITO {
  [key: string]: number | string;
}

export const propertiesCommonDefaultValuesITO = {
  collection: '',
  receiverAddress: '',
  startTime: '',
  endTime: '',
  maxAmount: 0,
  status: 1,
  startTimeStartNow: false,
};

const infinity = '\u221e';

export const CreateITOSecondStep: React.FC<IAssetITOInformations> = ({
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

export const CreateITOThirdStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description, formValue },
  handleStep,
  t,
}) => {
  const [address, setAddress] = useState('');
  const [changeReceiveAddress, setChangeReceiveAddress] = useState(false);
  const [checkedField, setCheckedField] = useState(0);

  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const { walletAddress } = useExtension();

  useEffect(() => {
    const getWallet = walletAddress;
    if (getWallet !== null) {
      setAddress(getWallet);
      setValue(formValue || '', getWallet, { shouldValidate: true });
    }
  }, []);

  const { isMobile, isTablet } = useMobile();
  const receiveAddress = watch(formValue || '');
  const collection = watch('collection');
  let error = null;

  try {
    error = eval(`errors?.${formValue}`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(receiveAddress)),
  };

  const handleChange = (value: boolean, field: number) => {
    setChangeReceiveAddress(value);
    setCheckedField(field);
    if (!changeReceiveAddress) {
      setValue(formValue || '', '', { shouldValidate: true });
    } else {
      setValue(formValue || '', address, { shouldValidate: true });
    }
  };

  const AddressValidationIcon: React.FC<{ error: any }> = ({ error }) => {
    if (error) return <WizardFailAddressCheck />;

    if (changeReceiveAddress && receiveAddress?.length === 62 && !error)
      return <WizardAddressCheck />;

    return <></>;
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
        <p>{t('wizards:createITO.steps.whoWill', { collection })}</p>
        <p>{description}</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeReceiveAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                {t('wizards:common.useConnectedAddress')}
                {isTablet && <span>{parseAddress(address, 14)}</span>}
              </div>
              <input
                type="radio"
                name="receiverAddress"
                id="receiverAddress"
                defaultChecked={true}
                checked={checkedField === 0}
              />
              <label htmlFor="receiverAddress" />
            </div>
          </GenericAddressCard>
          <GenericAddressCard
            expand={changeReceiveAddress && isTablet}
            selected={changeReceiveAddress}
            onClick={() => handleChange(true, 1)}
          >
            <div>
              {t('wizards:common.useAnotherAddress')}
              <input
                type="radio"
                name="receiverAddress"
                id="insertAddress"
                checked={checkedField === 1}
              />
              <label htmlFor="insertAddress" />
            </div>
            <div>
              {changeReceiveAddress && isTablet && (
                <>
                  <GenericInput
                    addPadding={true}
                    error={error}
                    type="text"
                    autoFocus={checkedField === 1}
                    placeholder="KDA Address"
                    {...register('receiverAddress', {
                      required: {
                        value: true,
                        message: t('wizards:common.errorMessage.required'),
                      },
                      minLength: {
                        value: 62,
                        message: t(
                          'wizards:common.errorMessage.charactersField',
                          { number: '62' },
                        ),
                      },
                      maxLength: {
                        value: 62,
                        message: t(
                          'wizards:common.errorMessage.charactersField',
                          { number: '62' },
                        ),
                      },
                    })}
                  />
                </>
              )}
              {isTablet && <AddressValidationIcon error={error} />}
            </div>
          </GenericAddressCard>
        </AddressesContainer>
      </div>
      <ChangedAddressContainer>
        {changeReceiveAddress && !isTablet && (
          <div>
            {t('wizards:createITO.steps.receiveAddress')}
            <GenericInput
              error={error}
              type="text"
              autoFocus={changeReceiveAddress}
              {...register('receiverAddress', {
                required: {
                  value: true,
                  message: t('wizards:common.errorMessage.required'),
                },
                minLength: {
                  value: 62,
                  message: t('wizards:common.errorMessage.charactersField', {
                    number: '62',
                  }),
                },
                maxLength: {
                  value: 62,
                  message: t('wizards:common.errorMessage.charactersField', {
                    number: '62',
                  }),
                },
              })}
              placeholder={parseAddress(address, 14)}
            />
          </div>
        )}
        {!isTablet && !isMobile && changeReceiveAddress && (
          <AddressValidationIcon error={error} />
        )}
      </ChangedAddressContainer>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOFourthStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description },
  handleStep,
  t,
}) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const handlerStartTime = (e: { target: { checked: boolean } }) => {
    setValue('startTimeStartNow', e.target.checked);
  };

  const collection = watch('collection');
  const watchStartTime = watch('startTime');
  const watchStartTimeNow = watch('startTimeStartNow');
  let errorStartTime = null;
  let errorEndTime = null;
  try {
    errorStartTime = eval(`errors?.startTime`);
    errorEndTime = eval(`errors?.endTime`);
  } catch {
    errorStartTime = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!errorEndTime,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {' '}
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.durationITO', { collection })}</p>
        <p>{description}</p>
        <ConfigITOStartTime>
          {t('wizards:createITO.steps.startTime')}
          <span>
            {t('wizards:createITO.steps.startTimeRightNow')}
            <input type="checkbox" onChange={handlerStartTime} />
          </span>
        </ConfigITOStartTime>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('startTime')}
            disabled={watchStartTimeNow}
          />

          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}
          <p>{t('wizards:createITO.steps.endTime')}</p>
          <GenericInput
            error={errorEndTime}
            type="datetime-local"
            {...register('endTime', {
              validate: endTime => {
                const startTime = new Date(watchStartTime);
                const end = new Date(endTime);
                if (!end) {
                  return true;
                }
                if (end <= startTime) {
                  return 'End Time must be greater than Start Time';
                }
                return true;
              },
            })}
          />
          {errorEndTime && <ErrorMessage>{errorEndTime?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipTimeITO')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOSixStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description },
  handleStep,
  t,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const collection = watch('collection');
  const { data, isLoading } = useQuery({
    queryKey: 'collection',
    queryFn: () => getAsset(collection),
  });

  let error = null;

  try {
    error = eval(`errors?.maxAmount`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!error,
  };
  const validateInput = (maxAmount: number) => {
    if (!isLoading) {
      const maxSupply = data?.data?.asset.maxSupply || 0;
      if (maxSupply === 0) {
        return true;
      } else if (maxSupply < maxAmount) {
        return 'Maximum Amount must be less than Maximum Supply';
      }
      return true;
    }
  };
  return (
    <GenericCardContainer>
      <div>
        <p> {t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {' '}
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whatIsTheAmount', { collection })}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="number"
            autoFocus={true}
            placeholder="0"
            align={'right'}
            {...register('maxAmount', {
              validate: validateInput,
              pattern: { value: /\d+/g, message: 'Value must be only numbers' },
              valueAsNumber: true,
            })}
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipAmountOne')}{' '}
          <strong>{data?.data?.asset.maxSupply || infinity}</strong>{' '}
          {t('wizards:createITO.steps.tooltipAmountTwo')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOSevenStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description },
  handleStep,
  t,
}) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const status = watch('status');
  const collection = watch('collection');
  let error = null;

  try {
    error = eval(`errors?.status`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(status)),
  };

  const onChangeHandler = (value: IStatusITO) => {
    setValue('status', value?.value, {
      shouldValidate: true,
    });
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
        <p>{t('wizards:createITO.steps.initialITOStatus', { collection })}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <Select
            onChange={onChangeHandler}
            options={statusOptions}
            defaultValue={statusOptions[status - 1]}
            required
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipStatus')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreatePackInfoSteps: React.FC<IAssetITOInformations> = ({
  informations: { assetType },
  handleStep,
  t,
}) => {
  const { watch } = useFormContext();
  const [packInfo, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectPackCurrencyID',
      label: 'Select Pack Currency ID',
      isDone: false,
      component: (
        <CreatePackCurrencyID
          handleStep={handleStep}
          previousStep={handleStep}
          t={t}
        />
      ),
    },
  ]);

  const [activeStep, setActiveStep] = useState(packInfoSteps[0]);

  useEffect(() => {
    if (currentStep === packInfoSteps.length) return;
    setActiveStep(packInfoSteps[currentStep]);
  }, [currentStep]);

  return !packInfo ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:createITO.steps.packInfo')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.packInfoForNow')}</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:createITO.steps.whatIsPackInfo')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:createITO.steps.tooltipPackInfo')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

const CreatePackCurrencyID: React.FC<IWizardComponents> = ({
  handleStep,
  previousStep,
  t,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { control, watch, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'packInfo',
  });
  const buttonsProps = {
    handleStep,
    previousStep,
    next: true,
  };
  const packInfoID = watch(`packInfo[${currentIndex}].currencyId`);
  const handleNextIndex = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (fields.length === 0) append({});

  const getOrder = (num: number) => {
    switch (num) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${num}th`;
    }
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {t('wizards:createITO.steps.packsInfo')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div>
        <p>
          {t('wizards:createITO.steps.packInfoFor')}{' '}
          {getOrder(currentIndex + 1)} {t('wizards:createITO.steps.currency')}{' '}
        </p>
        <div key={`packInfo[${currentIndex}].currencyId`}>
          <GenericInput
            type="text"
            autoFocus={true}
            placeholder="Pack Currency ID"
            {...register(`packInfo[${currentIndex}].currencyId`)}
          />
          <p>{t('wizards:createITO.steps.currencyInfo')}</p>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            remove(currentIndex);
            if (currentIndex !== 0) {
              setCurrentIndex(currentIndex - 1);
            }
          }}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:createITO.steps.removePack')}
        </BorderedButton>
        <UriButtonsContainer>
          <div>
            <BorderedButton
              type="button"
              onClick={handlePreviousIndex}
              isHidden={fields.length <= 1}
            >
              <WizardLeftArrow />

              <span>{t('wizards:common.previous')}</span>
            </BorderedButton>
            <BorderedButton
              type="button"
              onClick={handleNextIndex}
              isHidden={fields.length <= 1}
            >
              <span>{t('wizards:common.next')}</span>
              <WizardRightArrowSVG />
            </BorderedButton>
          </div>
          <BorderedButton
            type="button"
            onClick={() => {
              append({});
              setCurrentIndex(fields.length);
            }}
            fullWidth
          >
            <span> {t('wizards:createITO.steps.addAnotherPack')}</span>
            <FiPlusSquare />
          </BorderedButton>
        </UriButtonsContainer>
        <CreatePacks packInfoIndex={currentIndex} key={currentIndex} />
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreatePacks: React.FC<IPackInfoITO> = ({ packInfoIndex }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation('wizards');
  const { fields, append, remove } = useFieldArray({
    control,
    name: `packInfo[${packInfoIndex}].packs`,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorPackAmount = null;
  let errorPackPrice = null;

  try {
    errorPackAmount = eval(
      `errors?.packInfo[${packInfoIndex}].packs[${currentIndex}].amount`,
    );
    errorPackPrice = eval(
      `errors?.packInfo[${packInfoIndex}].packs[${currentIndex}].price`,
    );
  } catch {
    errorPackAmount = null;
    errorPackPrice = null;
  }

  const handleNextIndex = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (fields.length === 0) append({});

  return (
    <GenericCardContainer>
      <div>
        <p>{t('createITO.steps.createPacks')}</p>
        <p key={fields.length}>
          {t('createITO.steps.packs')} {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={`packInfo[${packInfoIndex}].packs[${currentIndex}]`}>
        <p>
          {' '}
          {t('createITO.steps.packInfoFor')} {packInfoIndex + 1}
        </p>
        <GenericInput
          error={errorPackAmount}
          type="number"
          {...register(
            `packInfo[${packInfoIndex}].packs[${currentIndex}].amount`,
            {
              valueAsNumber: true,
              required: { value: true, message: 'This field is required' },
            },
          )}
          placeholder="Amount"
        />
        <p>{t('createITO.steps.forNFTS')}</p>
        {errorPackAmount && (
          <ErrorMessage>{errorPackAmount?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorPackPrice}
          type="number"
          {...register(
            `packInfo[${packInfoIndex}].packs[${currentIndex}].price`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
              required: { value: true, message: 'This field is required' },
            },
          )}
          placeholder="Price"
        />
        <p>{t('createITO.steps.forNFTS/Tokens')}</p>
        {errorPackPrice && (
          <ErrorMessage>{errorPackPrice?.message}</ErrorMessage>
        )}
      </div>

      <BorderedButton
        type="button"
        onClick={() => {
          remove(currentIndex);
          if (currentIndex !== 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }}
        isHidden={fields.length <= 1}
        fullWidth
      >
        {t('createITO.steps.removePack')}
      </BorderedButton>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>{t('common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>{t('common.next')}</span>
            <WizardRightArrowSVG />
          </BorderedButton>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            append({});
            setCurrentIndex(fields.length);
          }}
          fullWidth
        >
          <span>{t('createITO.steps.addAnotherPack')}</span>
          <FiPlusSquare />
        </BorderedButton>
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateWhiteListSettingsSteps: React.FC<IAssetITOInformations> = ({
  informations: { assetType },
  handleStep,
  t,
}) => {
  const { watch } = useFormContext();
  const [whitelist, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectWhitelistStartTime',
      label: 'Select whitelist start time',
      isDone: false,
      component: (
        <WhitelistStartTimeStep
          t={t}
          handleStep={setCurrentStep}
          previousStep={handleStep}
        />
      ),
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: (
        <WhitelistDefaultLimitStep handleStep={setCurrentStep} t={t} />
      ),
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: <WhitelistStatusStep handleStep={setCurrentStep} t={t} />,
    },
    {
      key: 'selectWhitelistAddAddress',
      label: 'Select whitelist add address',
      isDone: false,
      component: <WhitelistAddressSteps handleStep={handleStep} t={t} />,
    },
  ]);

  const [activeStep, setActiveStep] = useState(packInfoSteps[0]);

  useEffect(() => {
    if (currentStep === packInfoSteps.length) return;
    setActiveStep(packInfoSteps[currentStep]);
  }, [currentStep]);

  return !whitelist ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:createITO.steps.whitelistAddAddress')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.configureWhitelistAddresses')}</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            {t('common:Statements.Yes')}
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:createITO.steps.whatIsWhitelist')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:createITO.steps.tooltipWhitelist')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const WhitelistStartTimeStep: React.FC<IWizardComponents> = ({
  handleStep,
  previousStep,
  t,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  let errorStartTime = null;
  let errorEndTime = null;
  try {
    errorStartTime = eval(`errors?.whitelistStartTime`);
    errorEndTime = eval(`errors?.whitelistEndTime`);
  } catch {
    errorStartTime = null;
    errorEndTime = null;
  }
  const buttonsProps = {
    handleStep,
    previousStep,
    next: !!!errorStartTime,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 1/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistStartTime')}
          />
          <p>{t('wizards:createITO.steps.whitelistStartTime')}</p>
          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}

          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistEndTime')}
          />
          <p>{t('wizards:createITO.steps.whitelistEndTime')}</p>
          {errorEndTime && <ErrorMessage>{errorEndTime?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const WhitelistDefaultLimitStep: React.FC<IWizardComponents> = ({
  handleStep,
  t,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  let error = null;

  try {
    error = eval(`errors?.whitelistDefaultLimit`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!error,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 3/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <p>{t('wizards:createITO.steps.defaultLimit')}</p>
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="number"
            autoFocus={true}
            align={'right'}
            {...register('whitelistDefaultLimit')}
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const WhitelistStatusStep: React.FC<IWizardComponents> = ({
  handleStep,
  t,
}) => {
  statusOptions;
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const whitelistStatus = watch('whitelistStatus');
  let error = null;

  try {
    error = eval(`errors?.whitelistStatus`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!error,
  };

  const onChangeHandler = (value: IStatusITO) => {
    setValue('whitelistStatus', value?.value, {
      shouldValidate: true,
    });
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 4/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <p>{t('wizards:createITO.steps.whitelistStatus')}</p>
        <ErrorInputContainer>
          <Select
            onChange={onChangeHandler}
            options={statusOptions}
            defaultValue={statusOptions[whitelistStatus - 1]}
            required
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipStatusWhitelist')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const WhitelistAddressSteps: React.FC<IWizardComponents> = ({
  handleStep,
  t,
}) => {
  const { watch } = useFormContext();
  const [whitelist, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectWhitelistAddress',
      label: 'Select whitelist add address',
      isDone: false,
      component: (
        <CreateWhitelistedAddress
          t={t}
          handleStep={handleStep}
          previousStep={handleStep}
        />
      ),
    },
  ]);

  const [activeStep, setActiveStep] = useState(packInfoSteps[0]);

  useEffect(() => {
    if (currentStep === packInfoSteps.length) return;
    setActiveStep(packInfoSteps[currentStep]);
  }, [currentStep]);

  return !whitelist ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistAddressInfo')}</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const CreateWhitelistedAddress: React.FC<IWizardComponents> = ({
  handleStep,
  previousStep,
  t,
}) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'whitelistInfo',
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorWhitelistedAddress = null;
  let errorWhitelistedLimit = null;

  const ticker = watch('ticker');

  const buttonsProps = {
    handleStep,
    previousStep,
    next: true,
  };

  try {
    errorWhitelistedAddress = eval(
      `errors?.whitelistInfo[${currentIndex}].address`,
    );
    errorWhitelistedLimit = eval(
      `errors?.whitelistInfo[${currentIndex}].limit`,
    );
  } catch {
    errorWhitelistedAddress = null;
    errorWhitelistedLimit = null;
  }

  const handleNextIndex = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    if (fields.length === 0) append({});
  }, []);

  return (
    <GenericCardContainer alignCenter key={currentIndex}>
      <div>
        <p>{t('wizards:createITO.steps.whitelist')}</p>
        <p key={fields.length}>
          {t('wizards:createITO.steps.whitelistedAddress')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistAddressAndLimit')}</p>
        <p></p>
        <GenericInput
          error={errorWhitelistedLimit}
          type="text"
          autoFocus={true}
          {...register(`whitelistInfo[${currentIndex}].address`)}
          placeholder="Address"
        />
        <p>{t('wizards:createITO.steps.whitelistedAddress')}</p>
        {errorWhitelistedAddress && (
          <ErrorMessage>{errorWhitelistedAddress?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorWhitelistedLimit}
          type="number"
          {...register(`whitelistInfo[${currentIndex}].limit`, {
            valueAsNumber: true,
          })}
          placeholder="Limit"
        />
        <p>{t('wizards:createITO.steps.maxAmountOfTokens')}</p>
        {errorWhitelistedLimit && (
          <ErrorMessage>{errorWhitelistedLimit?.message}</ErrorMessage>
        )}

        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:createITO.steps.removeAddress')}
        </BorderedButton>
      </div>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>{t('wizards:common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>{t('wizards:common.next')}</span>
            <WizardRightArrowSVG />
          </BorderedButton>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            append({});
            setCurrentIndex(fields.length);
          }}
          fullWidth
        >
          <span>{t('wizards:createITO.steps.addAnotherAddress')}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const ConfirmTransaction: React.FC<IWizardComponents> = ({
  handleStep,
  t,
}) => {
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

export const AssetDetails: React.FC = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const collection = watch('collection');
  const { data, isLoading } = useQuery({
    queryKey: 'collection',
    queryFn: () => getAsset(collection),
  });
  const RenderLogo: React.FC<{ logo: string }> = ({ logo }) => {
    if (logo) {
      return (
        <ConfirmCardImage>
          <Image
            alt="logo"
            src={logo}
            width={40}
            height={40}
            objectPosition="center"
            style={{ borderRadius: '10px' }}
            loader={({ src, width }) => `${src}?w=${width}`}
          />
        </ConfirmCardImage>
      );
    }
    return <ConfirmCardImage>{collection[0]?.toUpperCase()}</ConfirmCardImage>;
  };
  const RenderAssetDetails: React.FC = () => {
    if (data) {
      const asset = data.data?.asset as IAsset;

      return (
        <>
          <div>
            <RenderLogo logo={asset.logo} />
            <div>
              <span>{asset.ticker}</span>
              <span>{asset.name}</span>
            </div>
          </div>
          <ConfirmCardBasisInfo>
            <span>{t('common.maxSupply')}</span>
            <span>{asset.maxSupply ? asset.maxSupply : infinity}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>
              {t(
                'createToken.stepsInformations.basicStepsLabels.initialSupply',
              )}
            </span>
            <span>{asset.initialSupply ? asset.initialSupply : 0}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>{t('common.precision')}</span>
            <span>
              <span>{asset.precision || 0} </span>
            </span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>{t('common.basicOptions.ownerAddress')}</span>
            <span>{parseAddress(asset.ownerAddress, 14)}</span>
          </ConfirmCardBasisInfo>
        </>
      );
    }
    return <></>;
  };

  return <RenderAssetDetails />;
};

export const TransactionDetails: React.FC = () => {
  const { t } = useTranslation('wizards');
  const { walletAddress } = useExtension();
  return (
    <ReviewContainer>
      <span>{t('common.transactionDetails.transactionDetails')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.transaction')}</span>
          <span>{t('createITO.steps.configITO')}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.from')}</span>
          <span>{parseAddress(walletAddress || '', 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.fee')}</span>
          <span>20,000 KLV</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const TransactionDetails2: React.FC = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const receiverAddress = watch('receiverAddress');
  const startTime = watch('startTime');
  const startTimeNow = watch('startTimeStartNow');
  const endTime = watch('endTime');
  const maxAmount = watch('maxAmount');
  const status = watch('status');

  const startTimeValue = startTimeNow ? 'Now' : '--';
  return (
    <ReviewContainer>
      <span>{t('createITO.steps.setUpITO')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.receiverAddress')}
          </span>
          <span>{parseAddress(receiverAddress, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.itoTime')}
          </span>
          <span>
            {startTime || startTimeValue} to {endTime || infinitySymbol}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.maxAmount')}
          </span>
          <span>{maxAmount}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('createITO.stepsInformations.basicStepsLabels.status')}
          </span>
          <span>{status}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
