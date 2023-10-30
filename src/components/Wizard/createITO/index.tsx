import { WizardLeftArrow } from '@/assets/icons';
import Select from '@/components/Contract/Select';
import { statusOptions } from '@/components/TransactionForms/CustomForms/ConfigITO';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { getAsset } from '@/services/requests/asset';
import { useKDASelect } from '@/utils/hooks/contract';
import { parseAddress } from '@/utils/parseValues';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IoArrowForward } from 'react-icons/io5';
import { useQuery } from 'react-query';
import {
  ButtonsComponent,
  ConnectButtonComponent,
  IWizardComponents,
} from '../createAsset';
import {
  AddressesContainer,
  BackArrowSpan,
  BorderedButton,
  ButtonsContainer,
  ChangedAddressContainer,
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
  WizardConfirmLogo,
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
};

const infinity = '\u221e';

export const CreateITOSecondStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
}) => {
  const { setSelectedContractType } = useMulticontract();
  const [_, KDASelect] = useKDASelect();
  const { watch } = useFormContext();
  const collection = watch('collection');

  let error = null;

  try {
    error = eval(`errors?.collection`);
  } catch {
    error = null;
  }

  useEffect(() => {
    setSelectedContractType('ConfigITOContract');
  }, []);

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(collection)),
  };

  return (
    <GenericCardContainer>
      <div>
        <p>SET UP ITO</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <KDASelect required />
          <ConnectButtonComponent />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOThirdStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description, formValue },
  handleStep,
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

  useEffect(() => {
    const getWallet = sessionStorage.getItem('walletAddress');
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
        <p>SET UP ITO</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>Who will receive {collection} royalties?</p>
        <p>{description}</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeReceiveAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                Use my connected wallet address
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
              Use another KDA address
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
                        message: 'This field is required',
                      },
                      minLength: {
                        value: 62,
                        message: 'This field must have 62 characters',
                      },
                      maxLength: {
                        value: 62,
                        message: 'This field must have 62 characters',
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
            Receive Address
            <GenericInput
              error={error}
              type="text"
              autoFocus={changeReceiveAddress}
              {...register('receiverAddress', {
                required: { value: true, message: 'This field is required' },
                minLength: {
                  value: 62,
                  message: 'This field must have 62 characters',
                },
                maxLength: {
                  value: 62,
                  message: 'This field must have 62 characters',
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
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const collection = watch('collection');
  const watchStartTime = watch('startTime');
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
        <p>SET UP ITO</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>What is the duration of the {collection} ITO?</p>
        <p>{description}</p>
        <p>Start Time</p>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('startTime')}
          />

          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}
          <p>End Time</p>
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
          Klever Tip: If you leave this field blank, this ITO will be open from
          now until the status is changed to PausedITO
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOSixStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description },
  handleStep,
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
      const maxSupply = data?.data.asset.maxSupply || 0;
      if (maxSupply === 0) {
        return true;
      } else if (maxSupply < maxAmount) {
        return 'Max Amount must be less than Max Supply';
      }
      return true;
    }
  };
  return (
    <GenericCardContainer>
      <div>
        <p>SET UP ITO</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>
          What is the amount of tokens that will be sold in {collection} ITO?
        </p>
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
          Klever Tip: If you leave this field blank, all the max supply of{' '}
          <strong>{data?.data.asset.maxSupply || infinity}</strong> will be
          available during the ITO.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateITOSevenStep: React.FC<IAssetITOInformations> = ({
  informations: { currentStep, title, description },
  handleStep,
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
        <p>SET UP ITO</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>What is the initial {collection} ITO Status?</p>
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
          Klever Tip: You can even initialize an ITO with paused status and
          enable it in the future if you want to.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreatePackInfoSteps: React.FC<IAssetITOInformations> = ({
  informations: { assetType },
  handleStep,
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
        <p>SET UP ITO</p>
        <p>Pack Info</p>
      </div>
      <div>
        <p>Would you like to enable and configure Pack Info for now?</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            Yes
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            No
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          What is Pack Info?
        </InfoCard>
        <GenericInfoCard>
          Refers to information about different packages of tokens that
          investors can purchase during the Initial Token Offering. These
          packages offer various benefits based on the amount of investment.
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
        <p>SET UP ITO</p>
        <p>
          Packs Info {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div>
        <p>Pack Info for {getOrder(currentIndex + 1)} Currency </p>
        <div key={`packInfo[${currentIndex}].currencyId`}>
          <GenericInput
            type="text"
            autoFocus={true}
            placeholder="Pack Currency ID"
            {...register(`packInfo[${currentIndex}].currencyId`)}
          />
          <p>Defines the currency in which the pack will be sold</p>
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
          Remove Pack
        </BorderedButton>
        <UriButtonsContainer>
          <div>
            <BorderedButton
              type="button"
              onClick={handlePreviousIndex}
              isHidden={fields.length <= 1}
            >
              <WizardLeftArrow />

              <span>Previous</span>
            </BorderedButton>
            <BorderedButton
              type="button"
              onClick={handleNextIndex}
              isHidden={fields.length <= 1}
            >
              <span>Next</span>
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
            <span>Add another Pack Info</span>
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
        <p>Create Packs</p>
        <p key={fields.length}>
          Packs {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={`packInfo[${packInfoIndex}].packs[${currentIndex}]`}>
        <p>Pack Info for {packInfoIndex + 1}</p>
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
        <p>
          For NFTs: Amount sold; For Token: Min amount for that price to be
          applied
        </p>
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
        <p>For NFTs: Price for each NFT; For Tokens: Price for that amount.</p>
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
        Remove Pack
      </BorderedButton>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>Previous</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>Next</span>
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
          <span>Add another Pack</span>
          <FiPlusSquare />
        </BorderedButton>
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateWhiteListSettingsSteps: React.FC<IAssetITOInformations> = ({
  informations: { assetType },
  handleStep,
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
          handleStep={setCurrentStep}
          previousStep={handleStep}
        />
      ),
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: <WhitelistDefaultLimitStep handleStep={setCurrentStep} />,
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: <WhitelistStatusStep handleStep={setCurrentStep} />,
    },
    {
      key: 'selectWhitelistAddAddress',
      label: 'Select whitelist add address',
      isDone: false,
      component: <WhitelistAddressSteps handleStep={handleStep} />,
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
        <p>SET UP ITO</p>
        <p>Whitelist add address</p>
      </div>
      <div>
        <p>
          Would you like to enable and configure Whitelist addresses for now?
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            Yes
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            No
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          What is Whitelist?
        </InfoCard>
        <GenericInfoCard>
          What is a whitelist? Refers to a list of individuals or entities that
          have been pre-approved or given permission to participate in the token
          sale. Being on the whitelist typically grants these participants the
          ability to purchase tokens during the ITO period.
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
        <p>SET UP ITO</p>
        <p>STEP 1/4</p>
      </div>
      <div>
        <p>Whitelist Settings</p>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistStartTime')}
          />
          <p>Whitelist start time</p>
          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}

          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistEndTime')}
          />
          <p>Whitelist end time</p>
          {errorEndTime && <ErrorMessage>{errorEndTime?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const WhitelistDefaultLimitStep: React.FC<IWizardComponents> = ({
  handleStep,
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
        <p>SET UP ITO</p>
        <p>STEP 3/4</p>
      </div>
      <div>
        <p>Whitelist Settings</p>
        <p>Default Limit Per Address</p>
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
        <p>SET UP ITO</p>
        <p>STEP 4/4</p>
      </div>
      <div>
        <p>Whitelist Settings</p>
        <p>Whitelist Status</p>
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
          Klever Tip: You can even initialize an ITO with paused status and
          enable it in the future if you want to.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const WhitelistAddressSteps: React.FC<IWizardComponents> = ({
  handleStep,
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
        <p>SET UP ITO</p>
        <p>Whitelist settings</p>
      </div>
      <div>
        <p>Would you like to enable and configure Whitelist address for now?</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            Yes
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            No
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
        <p>Whitelist</p>
        <p key={fields.length}>
          Whitelisted Address {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div>
        <p>Please fill the Whitelist address and limit</p>
        <p></p>
        <GenericInput
          error={errorWhitelistedLimit}
          type="text"
          autoFocus={true}
          {...register(`whitelistInfo[${currentIndex}].address`)}
          placeholder="Address"
        />
        <p>Whitelisted address</p>
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
        <p>
          Max amount of tokens that can be purchased by the address during the
          whitelist
        </p>
        {errorWhitelistedLimit && (
          <ErrorMessage>{errorWhitelistedLimit?.message}</ErrorMessage>
        )}

        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          Remove Address
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

            <span>Previous</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>Next</span>
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
          <span>Add another Address</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const ConfirmTransaction: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  return (
    <>
      <GenericCardContainer>
        <div>
          <p>Create ITO</p>
          <p>Review</p>
        </div>
        <ReviewContainer>
          <p>
            Review your Initial Token Offer settings and confirm the transaction
            to finalize creation.
          </p>
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
            <p>Confirm Transaction</p>
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
          <WizardConfirmLogo src={logo} />
        </ConfirmCardImage>
      );
    }
    return <ConfirmCardImage>{collection[0]?.toUpperCase()}</ConfirmCardImage>;
  };
  const RenderAssetDetails: React.FC = () => {
    if (data) {
      const { asset } = data.data;
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
            <span>Max supply</span>
            <span>{asset.maxSupply ? asset.maxSupply : infinity}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>Initial supply</span>
            <span>{asset.initialSupply ? asset.initialSupply : 0}</span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>Precision</span>
            <span>
              <span>{asset.precision || 0} </span>
            </span>
          </ConfirmCardBasisInfo>
          <ConfirmCardBasisInfo>
            <span>Owner address</span>
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
  const { walletAddress } = useExtension();
  return (
    <ReviewContainer>
      <span>TRANSACTION DETAILS</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>Transaction</span>
          <span>Config ITO</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>From</span>
          <span>{parseAddress(walletAddress || '', 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Fee</span>
          <span>20,000 KLV</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const TransactionDetails2: React.FC = () => {
  const { watch } = useFormContext();
  const receiverAddress = watch('receiverAddress');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const maxAmount = watch('maxAmount');
  const status = watch('status');
  return (
    <ReviewContainer>
      <span> SET UP ITO</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>Receiver Address</span>
          <span>{parseAddress(receiverAddress, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>ITO Time</span>
          <span>
            {startTime || '--'} to {endTime || '--'}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Max Amount</span>
          <span>{maxAmount}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Status</span>
          <span>{status}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};
