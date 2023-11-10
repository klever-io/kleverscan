import {
  WhiteTick,
  WizardLeftArrow,
  WizardPlusSquare,
  WizardTxSuccess,
} from '@/assets/icons';
import WalletHelp from '@/components/Header/WalletHelp';
import Tooltip from '@/components/Tooltip';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { formatNumberDecimal } from '@/utils/formatFunctions';
import { validateImgUrl } from '@/utils/imageValidate';
import { parseAddress } from '@/utils/parseValues';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoArrowForward } from 'react-icons/io5';
import { WizCreateITO } from '../createITO/configITO';
import { checkEmptyField, formatPrecision, validateUrl } from '../utils';
import WizCreateNFT from './createNFT';
import WizCreateToken from './createToken';
import {
  AddressesContainer,
  AdvancedStepsDesktop,
  BackArrowSpan,
  BorderedButton,
  ButtonsContainer,
  CardContainer,
  ChangedAddressContainer,
  CheckBoxInput,
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ConfirmCardImage,
  DefaultSettingsContainer,
  DefaultSettingsOptions,
  DesktopBasicSteps,
  DesktopStepsLabel,
  ErrorInputContainer,
  ErrorMessage,
  GenericAddressCard,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  HashContainer,
  IconWizardClock,
  IconWizardInfoSquare,
  InfoCard,
  PrecicionsContainer,
  PrecisionCard,
  PrecisionContainer,
  PreConfirmOptions,
  PropertiesContainer,
  PropertiesItem,
  ReviewContainer,
  RolesCheckboxContainer,
  RolesContainer,
  StakingTypeContainer,
  StepsContainer,
  StepsContainerDesktop,
  StepsExpandedContainer,
  StepsItem,
  StepsItemContainer,
  StepsItemContainerDesktop,
  UnderscoreConnect,
  UriButtonsContainer,
  WizardAddressCheck,
  WizardButton,
  WizardFailAddressCheck,
  WizardRightArrowSVG,
  WizardTxSuccessComponent,
} from './styles';

export interface IWizardComponents {
  handleStep: React.Dispatch<React.SetStateAction<number>>;
  previousStep?: React.Dispatch<React.SetStateAction<number>>;
  selectedStep?: number;
  handleAdvancedSteps?: () => void;
  isNFT?: boolean;
  isLastStep?: boolean;
}

interface IAssetInformations extends IWizardComponents {
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
  };
}

export interface IWizardConfirmProps
  extends IWizardComponents,
    IAssetInformations {
  txHash: string;
  fromAdvancedSteps: boolean;
}

interface IWizardStakingComponents {
  handleStep?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

interface IButtonsComponenets {
  buttonsProps: {
    handleStep: React.Dispatch<React.SetStateAction<number>>;
    previousStep?: React.Dispatch<React.SetStateAction<number>>;
    next: boolean;
    isLastStep?: boolean;
  };
  noNextButton?: boolean;
  showAdvanced?: boolean;
  isRow?: boolean;
}

export const propertiesValues = [
  {
    label: 'Can Freeze',
    isDefaultChecked: true,
    property: 'canFreeze',
    tooltip: 'Lock up tokens to generate rewards',
  },
  {
    label: 'Can Pause',
    isDefaultChecked: true,
    property: 'canPause',
    tooltip: 'Stop transactions',
  },
  {
    label: 'Can Burn',
    isDefaultChecked: true,
    property: 'canBurn',
    tooltip: 'Eliminate part of the token circulation',
  },
  {
    label: 'Can Add Roles',
    isDefaultChecked: true,
    property: 'canAddRoles',
    tooltip: `Defines whether roles can be applied to addresses that weren’t defined during the token creation process`,
  },
  {
    label: 'Can Mint',
    isDefaultChecked: true,
    property: 'canMint',
    tooltip: 'Create new tokens using a mint process',
  },
  {
    label: 'Can Change Owner',
    isDefaultChecked: true,
    property: 'canChangeOwner',
    tooltip: 'Gives the option of changing the asset owner',
  },
  {
    label: 'Can Wipe',
    isDefaultChecked: false,
    property: 'canWipe',
    tooltip:
      'Burn the tokens from a suspicious account and send them back to owner',
  },
];

export const propertiesCommonDefaultValues = {
  name: '',
  ticker: '',
  ownerAddress: '',
  maxSupply: '',
  logo: '',
  properties: {
    canAddRoles: true,
    canBurn: true,
    canChangeOwner: true,
    canFreeze: true,
    canMint: true,
    canPause: true,
    canWipe: false,
  },
};

export const infinitySymbol = '\u221e';

export const ConnectButtonComponent: React.FC = () => {
  const [openWalletHelp, setOpenWalletHelp] = useState(false);
  const { connectExtension, extensionInstalled, walletAddress } =
    useExtension();

  const handleClick = () => {
    if (!extensionInstalled) setOpenWalletHelp(true);
    if (extensionInstalled && !walletAddress) connectExtension();
  };
  return extensionInstalled && walletAddress ? (
    <></>
  ) : (
    <>
      <p>
        You are not connected to your wallet, do you want to{' '}
        <UnderscoreConnect onClick={handleClick}>connect?</UnderscoreConnect>
      </p>
      <WalletHelp
        closeDrawer={() => setOpenWalletHelp(false)}
        opened={openWalletHelp}
        clickConnectionMobile={() => setOpenWalletHelp(false)}
      />
    </>
  );
};

export const ButtonsComponent: React.FC<IButtonsComponenets> = ({
  buttonsProps: { handleStep, next, previousStep },
  noNextButton = false,
  isRow = true,
}) => {
  const { trigger } = useFormContext();
  const handleClick = () => {
    trigger();
    if (next && handleStep) {
      handleStep(prev => prev + 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      trigger();
      if (next && handleStep) {
        handleStep(prev => prev + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (previousStep) {
      previousStep(prev => prev - 1);
      return;
    }
    handleStep && handleStep(prev => prev - 1);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleStep, next, trigger]);

  return (
    <ButtonsContainer isRow={isRow}>
      <BackArrowSpan onClick={handlePreviousStep}>
        <WizardLeftArrow />
      </BackArrowSpan>
      {noNextButton ? (
        <></>
      ) : (
        <WizardButton type="button" onClick={handleClick} isDisabled={!next}>
          <p>Next</p>
          <WizardRightArrowSVG />
        </WizardButton>
      )}
    </ButtonsContainer>
  );
};

export const CreateAssetFirstStep: React.FC<IAssetInformations> = ({
  informations: {
    title,
    description,
    tooltip,
    kleverTip,
    transactionCost,
    timeEstimated,
  },
  handleStep,
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
          To finalize this process, a transaction will be carried out with a
          cost of {transactionCost} KLV.
        </span>
        <WizardButton onClick={() => handleStep(prev => prev + 1)} fullWidth>
          <p>I&apos;m ready, I want to start</p>
          <WizardRightArrowSVG />
        </WizardButton>
        <span>
          <IconWizardClock style={{ height: '1rem', width: '1rem' }} />
          Estimated time <strong>{timeEstimated}</strong>
        </span>
      </div>
    </CardContainer>
  );
};

export const CreateAssetSecondStep: React.FC<IAssetInformations> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const name = watch('name');

  let error = null;

  try {
    error = eval(`errors?.name`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(name)),
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="text"
            autoFocus={true}
            {...register('name', {
              required: { value: true, message: 'This field is required' },
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: 'Cannot start/end with blank space',
              },
            })}
          />

          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: Choose the name carefully, it will most likely be your
          brand on the blockchain.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetThirdStep: React.FC<IAssetInformations> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const ticker = watch('ticker');
  let error = null;

  try {
    error = eval(`errors?.ticker`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(ticker)),
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <GenericInput
          error={error}
          type="text"
          autoFocus={true}
          isUpperCase
          {...register('ticker', {
            required: { value: true, message: 'This field is required' },
            minLength: {
              value: 3,
              message: 'Must have at least 3 characteres',
            },
            pattern: {
              value: /^[^\s]*$/,
              message: 'Cannot contain any spaces in the ticker',
            },
            validate: (value: string) => {
              if (
                value.toUpperCase() === 'KLV' ||
                value.toUpperCase() === 'KFI'
              ) {
                return 'Ticker cannot be KLV nor KFI';
              }
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          Klever Tip: Try to find a Ticker that is not being used by any
          relevant projects.
        </GenericInfoCard>
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetFourthStep: React.FC<IAssetInformations> = ({
  informations: { currentStep, description, formValue },
  handleStep,
}) => {
  const [address, setAddress] = useState('');
  const [changeOwnerAddress, setChangeOwnerAddress] = useState(false);
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
  const ownerAddress = watch(formValue || '');
  let error = null;

  try {
    error = eval(`errors?.${formValue}`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(ownerAddress)),
  };

  const handleChange = (value: boolean, field: number) => {
    setChangeOwnerAddress(value);
    setCheckedField(field);
    if (!changeOwnerAddress) {
      setValue(formValue || '', '', { shouldValidate: true });
    } else {
      setValue(formValue || '', address, { shouldValidate: true });
    }
  };

  const AddressValidationIcon: React.FC<{ error: any }> = ({ error }) => {
    if (error) return <WizardFailAddressCheck />;

    if (changeOwnerAddress && ownerAddress?.length === 62 && !error)
      return <WizardAddressCheck />;

    return <></>;
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>Owner Address</p>
        <p>{description}</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeOwnerAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                Use my connected wallet address
                {isTablet && <span>{parseAddress(address, 14)}</span>}
              </div>
              <input
                type="radio"
                name="ownerAddress"
                id="ownerAddress"
                defaultChecked={true}
                checked={checkedField === 0}
              />
              <label htmlFor="ownerAddress" />
            </div>
          </GenericAddressCard>
          <GenericAddressCard
            expand={changeOwnerAddress && isTablet}
            selected={changeOwnerAddress}
            onClick={() => handleChange(true, 1)}
          >
            <div>
              Use another KDA address
              <input
                type="radio"
                name="ownerAddress"
                id="insertAddress"
                checked={checkedField === 1}
              />
              <label htmlFor="insertAddress" />
            </div>
            <div>
              {changeOwnerAddress && isTablet && (
                <>
                  <GenericInput
                    addPadding={true}
                    error={error}
                    type="text"
                    autoFocus={checkedField === 1}
                    placeholder="KDA Address"
                    {...register('ownerAddress', {
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
        {changeOwnerAddress && !isTablet && (
          <div>
            Owner Address
            <GenericInput
              error={error}
              type="text"
              autoFocus={changeOwnerAddress}
              {...register('ownerAddress', {
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
        {!isTablet && !isMobile && changeOwnerAddress && (
          <AddressValidationIcon error={error} />
        )}
      </ChangedAddressContainer>
      <ConnectButtonComponent />
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetRoyaltyAddress: React.FC<IWizardComponents> = ({
  handleStep,
  previousStep,
}) => {
  const [address, setAddress] = useState('');
  const [changeOwnerAddress, setChangeOwnerAddress] = useState(false);
  const [checkedField, setCheckedField] = useState(0);

  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const getWalletAddress = sessionStorage.getItem('walletAddress');
    if (getWalletAddress !== null) {
      setAddress(getWalletAddress);
      setValue('royalties.address', getWalletAddress, { shouldValidate: true });
    }
  }, []);

  const { isMobile, isTablet } = useMobile();
  const ownerAddress = watch('royalties.address');
  let error = null;

  try {
    error = eval(`errors?.royalties.address`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    previousStep,
    next: !!(!error && checkEmptyField(ownerAddress)),
  };

  const handleChange = (value: boolean, field: number) => {
    setChangeOwnerAddress(value);
    setCheckedField(field);
    if (!changeOwnerAddress) {
      setValue('royalties.address', '', { shouldValidate: true });
    } else {
      setValue('royalties.address', address, { shouldValidate: true });
    }
  };

  const AddressValidationIcon: React.FC<{ error: any }> = ({ error }) => {
    if (error) return <WizardFailAddressCheck />;

    if (changeOwnerAddress && ownerAddress?.length === 62 && !error)
      return <WizardAddressCheck />;

    return <></>;
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Advanced Option</p>
        <p>STEP 2/5</p>
      </div>
      <div>
        <p>Address</p>
        <p>This address will be the receiver of royalties</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeOwnerAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                Use my connected wallet address
                {isTablet && <span>{parseAddress(address, 14)}</span>}
              </div>
              <input
                type="radio"
                name="royalties.address"
                id="royalties.address"
                defaultChecked={true}
                checked={checkedField === 0}
              />
              <label htmlFor="royalties.address" />
            </div>
          </GenericAddressCard>
          <GenericAddressCard
            expand={changeOwnerAddress && isTablet}
            selected={changeOwnerAddress}
            onClick={() => handleChange(true, 1)}
          >
            <div>
              Use another KDA address
              <input
                type="radio"
                name="royalties.address"
                id="insertAddress"
                checked={checkedField === 1}
              />
              <label htmlFor="insertAddress" />
            </div>
            <div>
              {changeOwnerAddress && isTablet && (
                <>
                  <GenericInput
                    addPadding
                    error={error}
                    type="text"
                    autoFocus={checkedField === 1}
                    placeholder="KDA Address"
                    {...register('royalties.address', {
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
        {changeOwnerAddress && !isTablet && (
          <div>
            Owner Address
            <GenericInput
              error={error}
              type="text"
              autoFocus={changeOwnerAddress}
              {...register('royalties.address', {
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
            {!isTablet && !isMobile && <AddressValidationIcon error={error} />}
          </div>
        )}
      </ChangedAddressContainer>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const CreateAssetRoyaltyITOToken: React.FC<any> = ({ buttonsProps }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  // TODO -> VALIDATION
  const ticker = watch('ticker');
  let errorTransferPercentage = null;
  let errorTransferFixed = null;

  try {
    errorTransferPercentage = eval(`errors?.royalties.percentITOPercentage`);
    errorTransferFixed = eval(`errors?.royalties.percentITOFixed`);
  } catch {
    errorTransferPercentage = null;
    errorTransferFixed = null;
  }

  return (
    <GenericCardContainer>
      <div>
        <p>Advanced Option</p>
        <p>STEP 3/5</p>
      </div>
      <div>
        <p>Set the values for the {ticker} ITO&apos;s royalties</p>
        <p>
          Now you will choose the value of the royalties that the address
          selected will receive.
        </p>
        <GenericInput
          error={errorTransferPercentage}
          type="number"
          autoFocus={true}
          placeholder="ITO Percentage"
          {...register('royalties.percentITOPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>
          Percentage of the currency that will be charged from an ITO Buy - (
          precision 2, 100 = 100% )
        </p>
        {errorTransferPercentage && (
          <ErrorMessage>{errorTransferPercentage?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorTransferFixed}
          type="number"
          placeholder="ITO Fixed"
          {...register('royalties.percentITOFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Fixed amount of the currency that will be charged from an ITO Buy</p>
        {errorTransferFixed && (
          <ErrorMessage>{errorTransferFixed?.message}</ErrorMessage>
        )}
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const CreateAssetRoyaltyITONFT: React.FC<any> = ({ buttonsProps }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const ticker = watch('ticker');
  let errorTransferFixed = null;
  let errorMarketPercentage = null;
  let errorMarketFixed = null;
  let errorITOPercentage = null;
  let errorITOFixed = null;

  try {
    errorTransferFixed = eval(`errors?.royalties.percentTransferFixed`);
    errorMarketPercentage = eval(`errors?.royalties.percentMarketPercentage`);
    errorMarketFixed = eval(`errors?.royalties.percentMarketFixed`);
    errorITOPercentage = eval(`errors?.royalties.percentITOPercentage`);
    errorITOFixed = eval(`errors?.royalties.percentITOFixed`);
  } catch {
    errorTransferFixed = null;
    errorMarketPercentage = null;
    errorMarketFixed = null;
    errorITOPercentage = null;
    errorITOFixed = null;
  }

  return (
    <GenericCardContainer>
      <div>
        <p>Advanced Option</p>
        <p>STEP 3/5</p>
      </div>
      <div>
        <p>Set the values for the {ticker} ITO&apos;s royalties</p>
        <p>
          Now you will choose the value of the royalties that the address
          selected will receive.
        </p>
        <GenericInput
          error={errorTransferFixed}
          type="number"
          autoFocus={true}
          placeholder="Transfer Fixed"
          {...register('royalties.percentTransferFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Fixed transfer fee for non-fungible tokens (in KLV)</p>
        {errorTransferFixed && (
          <ErrorMessage>{errorTransferFixed?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorMarketPercentage}
          type="number"
          placeholder="Market Percentage"
          {...register('royalties.percentMarketPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>
          Market percentage fee for non-fungible tokens of the currency (
          precision 2, 100 = 100% )
        </p>
        {errorMarketPercentage && (
          <ErrorMessage>{errorMarketPercentage?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorMarketFixed}
          type="number"
          placeholder="Market Fixed"
          {...register('royalties.percentMarketFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Market fixed fee details for non-fungible tokens (in KLV)</p>
        {errorMarketFixed && (
          <ErrorMessage>{errorMarketFixed?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorITOPercentage}
          type="number"
          placeholder="ITO Percentage"
          {...register('royalties.percentITOPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>
          {' '}
          Percentage of the currency that will be charged from an ITO Buy - (
          precision 2, 100 = 100% )
        </p>
        {errorITOPercentage && (
          <ErrorMessage>{errorITOPercentage?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorITOFixed}
          type="number"
          placeholder="ITO Fixed"
          {...register('royalties.percentITOFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Fixed amount of the currency that will be charged from an ITO Buy</p>
        {errorITOFixed && <ErrorMessage>{errorITOFixed?.message}</ErrorMessage>}
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetRoyaltyITOPerc: React.FC<IWizardComponents> = ({
  handleStep,
  isNFT,
}) => {
  const buttonsProps = {
    handleStep,
    next: true,
  };

  if (!isNFT) {
    return <CreateAssetRoyaltyITOToken buttonsProps={buttonsProps} />;
  } else {
    return <CreateAssetRoyaltyITONFT buttonsProps={buttonsProps} />;
  }
};

export const CreateAssetRoyaltyTransferPerc: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transferPercentage',
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  let errorTransferPercAmount = null;
  let errorTransferPerc = null;

  const ticker = watch('ticker');

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorTransferPercAmount = eval(
      `errors?.royalties.transferPercentage[${currentIndex}]?.amount`,
    );
    errorTransferPerc = eval(
      `errors?.royalties.transferPercentage[${currentIndex}]?.percentage`,
    );
  } catch {
    errorTransferPercAmount = null;
    errorTransferPerc = null;
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
    <GenericCardContainer alignCenter>
      <div>
        <p>Transfer Percentage</p>
        <p key={fields.length}>
          Transfer Percentage {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>Please fill the Token amount and percentage</p>
        <p>
          You can also set a percentage value for transfers of {ticker}, the
          percentage can be different for certain amount threshoulds
        </p>
        <GenericInput
          error={errorTransferPercAmount}
          type="number"
          {...register(`royalties.transferPercentage[${currentIndex}].amount`, {
            valueAsNumber: true,
          })}
          placeholder="Amount"
        />
        <p>
          Amount - Min value of the threshold that triggers the transfer fee
        </p>
        {errorTransferPercAmount && (
          <ErrorMessage>{errorTransferPercAmount?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorTransferPerc}
          type="number"
          autoFocus={true}
          {...register(
            `royalties.transferPercentage[${currentIndex}].percentage`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="Percentage"
        />
        <p>Percentage - Percentage fee amount for that amount</p>
        {errorTransferPerc && (
          <ErrorMessage>{errorTransferPerc?.message}</ErrorMessage>
        )}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          Remove Percentage
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
          <span>Add another Percentage</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetSplitRoyalties: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splitRoyalties',
  });

  const [splitRoyalties, setSplitRoyalties] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // TODO - CHECK VALIDATION
  let errorsplitAddres = null;
  let errorSplitTransferPerc = null;
  let errorSplitITOPerc = null;
  let errorSplitITOFixed = null;

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorsplitAddres = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.address`,
    );
    errorSplitTransferPerc = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentTransferPercentage`,
    );
    errorSplitITOPerc = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentITOPercentage`,
    );
    errorSplitITOFixed = eval(
      `errors?.royalties.splitRoyalties[${currentIndex}]?.percentITOFixed`,
    );
  } catch {
    errorsplitAddres = null;
    errorSplitTransferPerc = null;
    errorSplitITOPerc = null;
    errorSplitITOFixed = null;
  }

  if (splitRoyalties) {
    buttonsProps.next = true;
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

  return !splitRoyalties ? (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTION</p>
        <p>Split Royalties</p>
      </div>
      <div>
        <p>Do you want to split royalties to your token now?</p>
        <ButtonsContainer columnDirection>
          <WizardButton
            centered
            onClick={() => {
              setSplitRoyalties(true);
            }}
          >
            Yes
          </WizardButton>
          <WizardButton secondary centered onClick={() => handleStep(10)}>
            No
          </WizardButton>
        </ButtonsContainer>
        <InfoCard>
          <IconWizardInfoSquare />
          What is Split Royalties ?
        </InfoCard>
        <GenericInfoCard>Royalty receiver address</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>Split Royalties</p>
        <p key={fields.length}>
          Split Royalties {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>How the royalties are split</p>
        <GenericInput
          error={errorsplitAddres}
          type="text"
          autoFocus={true}
          {...register(`royalties.splitRoyalties[${currentIndex}].address`, {
            minLength: {
              value: 62,
              message: 'This field must have 62 characters',
            },
            maxLength: {
              value: 62,
              message: 'This field must have 62 characters',
            },
          })}
          placeholder="Address"
        />
        <p>Royalty receiver address</p>
        {errorsplitAddres && (
          <ErrorMessage>{errorsplitAddres?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorSplitTransferPerc}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentTransferPercentage`,
            {
              pattern: { value: /\d+/g, message: 'Value must be only numbers' },
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="Transfer Percentage"
        />
        <p>
          Percentage that the given address will receive from &quot;transfer
          percentage&quot; fee. ( Precision 2, 100 = 100%)
        </p>
        {errorSplitTransferPerc && (
          <ErrorMessage>{errorSplitTransferPerc?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorSplitITOPerc}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentITOPercentage`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="ITO Percentage"
        />
        <p>
          Percentage that the given address will receive from &quot;ITO
          percentage&quot; fee. ( Precision 2, 100 = 100%)
        </p>
        {errorSplitITOPerc && (
          <ErrorMessage>{errorSplitITOPerc?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorSplitITOFixed}
          type="number"
          {...register(
            `royalties.splitRoyalties[${currentIndex}].percentITOFixed`,
            {
              valueAsNumber: true,
              min: { value: 0, message: 'Min value is 0' },
              max: { value: 100, message: 'Max value is 100' },
            },
          )}
          placeholder="ITO Fixed"
        />
        <p>
          Percentage that the given address will receive from &quot;ITO
          fixed&quot; fee. ( Precision 2, 100 = 100%)
        </p>
        {errorSplitITOFixed && (
          <ErrorMessage>{errorSplitITOFixed?.message}</ErrorMessage>
        )}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          Remove
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
          <span>Add another URI</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetRoyaltySteps: React.FC<IWizardComponents> = ({
  handleStep,
  isNFT = false,
}) => {
  const { watch } = useFormContext();
  const [royalties, setRoyalties] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const previousSteps = () => {
    handleStep(prev => prev - 1);
  };

  const tokenTransferRoyalties = [
    {
      key: 'selectRolyaltyTransferPerc',
      label: 'Select Rolyalty Transfer Perc',
      isDone: false,
      component: <CreateAssetRoyaltyTransferPerc handleStep={setCurrentStep} />,
    },
  ];

  const [royaltiesSteps, setRoyaltiesSteps] = useState([
    {
      key: 'selectRolyaltyAddress',
      label: 'Select Rolyalty Address',
      isDone: false,
      component: (
        <CreateAssetRoyaltyAddress
          handleStep={setCurrentStep}
          previousStep={handleStep}
        />
      ),
    },
    {
      key: 'selectRolyaltyITOPerc',
      label: 'Select Rolyalty ITO Perc',
      isDone: false,
      component: (
        <CreateAssetRoyaltyITOPerc handleStep={setCurrentStep} isNFT={isNFT} />
      ),
    },
    {
      key: 'selectSplitRolyalty',
      label: 'Select Split Rolyalty',
      isDone: false,
      component: <CreateAssetSplitRoyalties handleStep={handleStep} />,
    },
  ]);

  useEffect(() => {
    if (isNFT) return;
    const newSteps = royaltiesSteps;
    newSteps.splice(2, 0, ...tokenTransferRoyalties);
    setRoyaltiesSteps(newSteps);
  }, []);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [activeStep, setActiveStep] = useState(royaltiesSteps[0]);

  const ticker = watch('ticker');

  useEffect(() => {
    if (currentStep === royaltiesSteps.length) return;
    setActiveStep(royaltiesSteps[currentStep]);
  }, [currentStep]);

  return !royalties ? (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTIONS</p>
        <p>Royalties</p>
      </div>
      <div>
        <p>
          Would you like to enable and configure royalties for {ticker} now?
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setRoyalties(true)}>
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
          What is royalty?
        </InfoCard>
        <GenericInfoCard>
          Crypto payouts designed to proffer creators a cut of secondary sales
          of their asset
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const CreateAssetFiveStep: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  const { setValue, watch } = useFormContext();
  const precisionWatcher = watch('precision');
  const [precision, setPrecision] = useState<number>(precisionWatcher);
  const ticker = watch('ticker');
  const name = watch('name');

  const handleRegister = (value: number) => {
    setValue('precision', value || 0, { shouldValidate: true });
    setPrecision(value || 0);
  };

  const buttonsProps = {
    handleStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP 4/7</p>
      </div>
      <div>
        <p>What will be {ticker} precision?</p>
        <p>
          Token precision refers to the number of decimal places that can be
          used to represent fractional amounts of a token.
        </p>
        <PrecisionContainer key={precision}>
          <div>
            <p>{ticker}</p>
            <p>{name}</p>
          </div>
          <span>{formatPrecision(precision ?? 0)}</span>
        </PrecisionContainer>

        <PrecicionsContainer>
          {Array.from(Array(9).keys()).map((_, index) => (
            <PrecisionCard
              onClick={() => handleRegister(index)}
              key={String(index)}
              isSelected={precision === index}
            >
              {index}
            </PrecisionCard>
          ))}
        </PrecicionsContainer>
        <GenericInfoCard>
          Klever Tip: Token precision is an important consideration when
          creating a token because it affects the usability and divisibility of
          the token.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetSixStep: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const ticker = watch('ticker');
  const initialSupply = watch('initialSupply');

  let error = null;

  try {
    error = eval(`errors?.initialSupply`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !error,
  };
  const handleInputChange = (e: { target: { value: string } }) => {
    setInputValue(formatNumberDecimal(e.target.value));
  };
  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP 5/7</p>
      </div>
      <div>
        <p>Initial Supply of {ticker}</p>
        <p>
          The initial amount refers to the quantity of tokens that will be
          minted at the beginning of the token creation process.
        </p>
        <GenericInput
          error={error}
          type="text"
          placeholder="0"
          autoFocus={true}
          value={inputValue}
          {...register('initialSupply', {
            pattern: { value: /\d+/g, message: 'Only numbers are allowed' },
          })}
          onChange={handleInputChange}
          align={'right'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          If not specified, no tokens will be minted at the time of asset
          creation. The initial amount can be adjusted later through minting,
          which can be controlled through the token&apos;s smart contract.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetSevenStep: React.FC<IAssetInformations> = ({
  informations: { description, kleverTip },
  handleStep,
}) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const ticker = watch('ticker');
  const maxSupply = watch('maxSupply');

  let error = null;

  try {
    error = eval(`errors?.maxSupply`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !error,
  };

  const handleInputChange = (e: { target: { value: string } }) => {
    setInputValue(formatNumberDecimal(e.target.value));
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP 6/7</p>
      </div>
      <div>
        <p>Max. Supply of {ticker}</p>
        <p>{description}</p>
        <GenericInput
          error={error}
          type="text"
          value={inputValue}
          placeholder="0"
          {...register('maxSupply', {
            pattern: { value: /\d+/g, message: 'Only numbers are allowed' },
          })}
          onChange={handleInputChange}
          align={'right'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetEightStep: React.FC<IAssetInformations> = ({
  informations: { currentStep, assetType },
  handleStep,
}) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const ticker = watch('ticker');
  const assetText = assetType === 0 ? 'token' : 'NFT';
  let error = null;

  try {
    error = eval(`errors?.logo`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !error,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>STEP {currentStep}</p>
      </div>
      <div>
        <p>
          Do you already have an image to represent {ticker} {assetText}
        </p>
        <p>
          Include an URI with an icon to be used by the {assetText} (jpg, png,
          svg). Do your best to generate a square image and at least 400x400px.
        </p>
        <GenericInput
          type="text"
          error={error}
          placeholder="Paste your image URI here."
          {...register('logo', {
            validate: async logoUri => {
              const isValid = await validateImgUrl(logoUri, 2000);
              if (logoUri && !isValid) {
                return 'Enter a valid URI';
              }
              return true;
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          If not informed, a generic Icon with the first letter of the Ticker
          will be displayed. You can change this later through a new
          transaction.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const URIsSection: React.FC<IAssetInformations> = ({
  informations: { assetType },
  handleStep,
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'uris',
  });
  const assetText = assetType === 0 ? 'token' : 'NFT';

  const [addUri, setAddUri] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  let errorLabel = null;
  let errorUri = null;

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorLabel = eval(`errors?.uris[${currentIndex}]?.label`);
    errorUri = eval(`errors?.uris[${currentIndex}]?.uri`);
  } catch {
    errorLabel = null;
    errorUri = null;
  }

  if (addUri) {
    buttonsProps.next = !!(!errorLabel && !errorUri);
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

  return !addUri ? (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTIONS</p>
        <p>URI</p>
      </div>
      <div>
        <p>Do you want to add URIs to your {assetText} now?</p>
        <ButtonsContainer columnDirection>
          <WizardButton
            infoStep
            centered
            onClick={() => {
              setAddUri(true);
            }}
          >
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
          What is an URI ?
        </InfoCard>
        <GenericInfoCard>
          Short for “Uniform Resource Identifier” — is a sequence of characters
          that distinguishes one resource from another. For example,
          &quot;https://kleverscan.org&quot;
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>URI</p>
        <p key={fields.length}>
          URI {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>Please fill the Token URIs and labels</p>
        <GenericInput
          error={errorLabel}
          type="text"
          {...register(`uris[${currentIndex}].label`, {
            required: { value: true, message: 'This field is required' },
          })}
          placeholder="URI label"
        />
        <p>
          Enter the label that identifies this URL. Example: Whitepaper, Github,
          Website...
        </p>
        {errorLabel && <ErrorMessage>{errorLabel?.message}</ErrorMessage>}
        <GenericInput
          error={errorUri}
          type="text"
          {...register(`uris[${currentIndex}].uri`, {
            required: { value: true, message: 'This field is required' },
            validate: uriValue => {
              if (uriValue && !validateUrl(uriValue, false)) {
                return 'Enter a valid URI';
              }
              return true;
            },
          })}
          placeholder="URI here"
        />
        <p>
          Enter the URI corresponding to the label above. E.g:
          https://kleverscan.org
        </p>
        {errorUri && <ErrorMessage>{errorUri?.message}</ErrorMessage>}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          Remove URI
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
          <span>Add another URI</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

const SelectStakingTypeComponent: React.FC<IWizardStakingComponents> = ({
  handleStep,
  setCurrentStep,
}) => {
  const { setValue } = useFormContext();

  const buttonsProps = {
    handleStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>STAKING</p>
        <p>STEP 1</p>
      </div>
      <div>
        <p>What reward model do you want to offer?</p>

        <StakingTypeContainer>
          <PreConfirmOptions
            secondary
            onClick={() => {
              setCurrentStep(1);
              setValue('staking.interestType', 0);
            }}
          >
            <div>
              <span>APR</span>
              <span>
                APR staking stands for Annual Percentage Rate. It is a
                well-known term in the market that represents the percentage
                earned annually on an investment
              </span>
            </div>
            <WizardRightArrowSVG />
          </PreConfirmOptions>
          <PreConfirmOptions
            secondary
            onClick={() => {
              setCurrentStep(2);
              setValue('staking.interestType', 1);
            }}
          >
            <div>
              <span>FPR</span>
              <span>
                FPR stands for Flexibe Proportional Return. It is a new modality
                of staking that the Klever ecosystem offers and is a way for
                owners to distribute rewards to their holders through deposits
                into the FPR pool.
              </span>
            </div>
            <WizardRightArrowSVG />
          </PreConfirmOptions>
        </StakingTypeContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps as any} noNextButton />
    </GenericCardContainer>
  );
};

const StakingStepsGeneric: React.FC<IWizardStakingComponents> = ({
  setCurrentStep,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} STEP 2/5`;
    }
    return `${stakingType} STEP  1/3`;
  };

  let error = null;

  try {
    error = eval(`errors?.staking.apr`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep: setCurrentStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>STAKING</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>APR Rate (%)</p>
        <p>
          Inform the percentage to be paid in your staking. Remember it is an
          annual income.
        </p>
        <GenericInput
          error={error}
          align={'center'}
          type="number"
          placeholder="0"
          {...register('staking.apr', {
            pattern: { value: /\d+/g, message: 'Value must be only numbers' },
            valueAsNumber: true,
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          For example purposes. Let&apos;s assume that you opt for a Staking
          with 12% APR, this will represent an interest of 1% per month and
          0.033% per day.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprOne: React.FC<IWizardStakingComponents> = ({
  setCurrentStep,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} STEP 3/5`;
    }
    return `${stakingType} STEP 1/3`;
  };

  let error = null;

  try {
    error = eval(`errors?.staking.minEpochsToClaim`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep: setCurrentStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>STAKING</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>
          What is the minimum time your users should wait to unstake your assets
        </p>
        <p>
          Remember that time on the blockchain is contact in Epochs. Each epoch
          represents approximately 6 hours.
        </p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToClaim', {
            pattern: { value: /\d+/g, message: 'Value must be only numbers' },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          Each day corresponds to 4 epochs. If you want to put a minimum period
          of 3 days, this would represent 12 epochs.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprTwo: React.FC<IWizardStakingComponents> = ({
  setCurrentStep,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} STEP 4/5`;
    }
    return `${stakingType} STEP 2/3`;
  };

  let error = null;

  try {
    error = eval(`errors?.staking.minEpochsToUnstake`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep: setCurrentStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>STAKING</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>
          What is the minimum time your users should wait to claim your interest
        </p>
        <p>
          Remember that time on the blockchain is contact in Epochs. Each epoch
          represents approximately 6 hours.
        </p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToUnstake', {
            pattern: { value: /\d+/g, message: 'Value must be only numbers' },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          Each day corresponds to 4 epochs. If you want to put a minimum period
          of 3 days, this would represent 12 epochs.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprThree: React.FC<IWizardStakingComponents> = ({
  setCurrentStep,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} STEP 5/5`;
    }
    return `${stakingType} STEP 3/3`;
  };

  let error = null;

  try {
    error = eval(`errors?.staking.minEpochsToWithdraw`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep: setCurrentStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>STAKING</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>
          How long will the user have to wait until he can withdraw his balance
          after unstaking?
        </p>
        <p>
          Remember that time on the blockchain is contact in Epochs. Each epoch
          represents approximately 6 hours.
        </p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToWithdraw', {
            pattern: { value: /\d+/g, message: 'Value must be only numbers' },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          Each day corresponds to 4 epochs. If you want to put a minimum period
          of 3 days, this would represent 12 epochs.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetStakingStep: React.FC<IWizardComponents> = ({
  handleStep,
}) => {
  const { watch } = useFormContext();
  const [staking, setStaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [stakingSteps, setStakingSteps] = useState([
    {
      key: 'staking 1',
      label: 'staking 1',
      isDone: false,
      component: (
        <SelectStakingTypeComponent
          handleStep={handleStep}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    {
      key: 'staking 2',
      label: 'staking 2',
      isDone: false,
      component: <StakingStepsGeneric setCurrentStep={setCurrentStep} />,
    },
    {
      key: 'staking 2',
      label: 'staking 2',
      isDone: false,
      component: (
        <StakingStepsGenericAprFprOne setCurrentStep={setCurrentStep} />
      ),
    },
    {
      key: 'staking 3',
      label: 'staking 3',
      isDone: false,
      component: (
        <StakingStepsGenericAprFprTwo setCurrentStep={setCurrentStep} />
      ),
    },
    {
      key: 'staking 4',
      label: 'staking 4',
      isDone: false,
      component: <StakingStepsGenericAprFprThree setCurrentStep={handleStep} />,
    },
  ]);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [activeStep, setActiveStep] = useState(stakingSteps[0]);

  const ticker = watch('ticker');

  useEffect(() => {
    if (currentStep === stakingSteps.length) return;
    setActiveStep(stakingSteps[currentStep]);
  }, [currentStep]);

  return !staking ? (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTIONS</p>
        <p>STAKING</p>
      </div>
      <div>
        <p>Would you like to enable and configure staking for {ticker} now?</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setStaking(true)}>
            Yes
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(11)}
          >
            No
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          What is staking?
        </InfoCard>
        <GenericInfoCard>
          Staking is when you lock crypto assets for a set period of time to
          help support the operation of a blockchain. In return for staking your
          crypto, you earn more cryptocurrency.
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const CreateAssetAddRoles: React.FC<IAssetInformations> = ({
  informations: { assetType },
  handleStep,
}) => {
  const [addRole, setAddRole] = useState(false);
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const ticker = watch('ticker');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  const assetText = assetType === 0 ? 'Token' : 'NFT';

  const [currentIndex, setCurrentIndex] = useState(0);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  let error = null;

  try {
    error = eval(`errors?.roles[${currentIndex}]?.address`);
  } catch {
    error = null;
  }

  if (addRole) {
    buttonsProps.next = !!(!error && Object.entries(error || {}).length);
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

  return !addRole ? (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTIONS</p>
        <p>ROLES</p>
      </div>
      <div>
        <p>
          Would you like to create roles to manage your {ticker} {assetText}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setAddRole(true)}>
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
          What is a Role?
        </InfoCard>
        <GenericInfoCard>
          Set of permissions that you can add to a specific address
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>Roles</p>
        <p key={fields.length}>
          Role {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>Enter the address that will be added to apply the permissions</p>
        <GenericInput
          error={error}
          type="text"
          placeholder="KDA address"
          {...register(`roles.${currentIndex}.address`, {
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
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <RolesContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput {...register(`roles.${currentIndex}.hasRoleMint`)} />
            Will be allowed to mint coins?
          </RolesCheckboxContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput
              {...register(`roles.${currentIndex}.hasRoleSetITOPrices`)}
            />
            Will be allowed to set the price in the ITO
          </RolesCheckboxContainer>
        </RolesContainer>
        <GenericInfoCard>
          Don&apos;t worry, these rules can be changed later in Add role in the
          Asset Trigger by the {assetText} Owner
        </GenericInfoCard>
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          alignSelf
          fullWidth
        >
          Remove Role
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
        >
          <span>Add another Role</span>
          <WizardPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetPropertiesStep: React.FC<IAssetInformations> = ({
  informations: { title, description },
  handleStep,
  isLastStep = false,
}) => {
  const { watch, register } = useFormContext();
  const buttonsProps = {
    handleStep,
    next: true,
    isLastStep,
  };
  return (
    <GenericCardContainer>
      <div>
        <p>ADVANCED OPTIONS</p>
        <p>PROPERTIES</p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <PropertiesContainer>
          {propertiesValues.map(property => (
            <PropertiesItem key={JSON.stringify(property)}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <CheckBoxInput
                  defaultChecked={property.isDefaultChecked}
                  {...register(`properties.${property.property}`)}
                />
                <Tooltip msg={property.tooltip} />
              </div>
              <span>{property.label}</span>
            </PropertiesItem>
          ))}
        </PropertiesContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetPreConfimStep: React.FC<IAssetInformations> = ({
  informations: { assetType },
  handleStep,
  handleAdvancedSteps,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const assetText = assetType === 0 ? 'token' : 'NFT';

  const handleAdvancedStepsWrapper = () => {
    handleAdvancedSteps && handleAdvancedSteps();
  };

  return (
    <GenericCardContainer>
      <div>
        <p>Basic information</p>
        <p>Already</p>
      </div>
      <div>
        <p>
          You can already generate your {assetText} if you want. What do you
          want to do?
        </p>

        <PreConfirmOptions
          onClick={() => {
            handleStep(prev => prev + (assetText === 'NFT' ? 5 : 6));
          }}
        >
          <div>
            <span>
              I want to generate the {assetText} with this basic information
            </span>
            <span>
              Using this option you will generate your {assetText} with advanced
              settings in default options.
            </span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <PreConfirmOptions secondary onClick={handleAdvancedStepsWrapper}>
          <div>
            <span>I want to add advanced settings</span>
            <span>
              Use this option if you want to configure URIs, Staking,
              Roles,Proprieties.
            </span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <DefaultSettingsContainer
          showAdvanced={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>Show all default settings</span>
          {!showAdvanced ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </DefaultSettingsContainer>
        <DefaultSettingsOptions showAdvanced={showAdvanced}>
          <div>
            <span>Staking</span>
            <span>Roles</span>
            <span>Freeze</span>
            <span>Burn</span>
            <span>Add Roles</span>
            <span>Wipe</span>
            <span>Mint</span>
            <span>Change Owner</span>
          </div>
          <div>
            <span> - </span>
            <span> - </span>
            <span>Yes</span>
            <span>Yes</span>
            <span>Yes</span>
            <span>No</span>
            <span>Yes</span>
            <span>Yes</span>
          </div>
        </DefaultSettingsOptions>
      </div>
      <ButtonsComponent
        buttonsProps={buttonsProps}
        noNextButton
        showAdvanced={showAdvanced}
      />
    </GenericCardContainer>
  );
};

export const TransactionDetails: React.FC = () => {
  const { watch } = useFormContext();
  const address = watch('ownerAddress');
  return (
    <ReviewContainer>
      <span>TRANSACTION DETAILS</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>Transaction</span>
          <span>Create Asset</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>From</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Fee</span>
          <span>20,000 KLV</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const TransactionDetails2: React.FC<{
  assetType?: number;
  additionalFields?: boolean;
}> = ({ assetType, additionalFields }) => {
  const { watch } = useFormContext();
  const name = watch('name');
  const ticker = watch('ticker');
  const maxSupply = watch('maxSupply');
  const address = watch('ownerAddress');
  const logo = watch('logo');
  let precision = null;
  let initialSupply = null;
  precision = watch('precision');
  initialSupply = watch('initialSupply');

  const assetText = assetType === 0 ? 'Token' : 'NFT';

  return (
    <ReviewContainer>
      <span>{(assetText as string).toUpperCase()} BASIC SETTINGS</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>{assetText} name</span>
          <span>{name}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{assetText} ticker</span>
          <span>{ticker.toUpperCase()}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Max Supply</span>
          <span>{maxSupply ? maxSupply : infinitySymbol}</span>
        </ConfirmCardBasisInfo>

        <ConfirmCardBasisInfo>
          <span>URI {assetText} image</span>
          <span>{logo || '--'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Owner address</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const TransactionDetails3: React.FC<{ assetType?: number }> = ({
  assetType,
}) => {
  const { watch } = useFormContext();
  const properties = watch('properties');
  const assetText = assetType === 0 ? 'TOKEN' : 'NFT';

  return (
    <ReviewContainer>
      <span>{assetText} DEFAULT SETTINGS</span>
      <ConfirmCardBasics>
        {assetType === 0 && (
          <ConfirmCardBasisInfo>
            <span>Staking</span>
            <span>--</span>
          </ConfirmCardBasisInfo>
        )}
        <ConfirmCardBasisInfo>
          <span>Roles</span>
          <span>--</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can Freeze?</span>
          <span>{properties?.canFreeze ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can burn?</span>
          <span>{properties?.canBurn ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can Pause?</span>
          <span>{properties?.canPause ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can add roles?</span>
          <span>{properties?.canAddRoles ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can Mint?</span>
          <span>{properties?.canMint ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can Change Owner?</span>
          <span>{properties?.canChangeOwner ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>Can Wipe?</span>
          <span>{properties?.canWipe ? 'Yes' : 'No'}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const ConfirmTransaction: React.FC<IWizardConfirmProps> = ({
  informations: { assetType, additionalFields },
  handleStep,
  fromAdvancedSteps,
}) => {
  const { watch } = useFormContext();
  const name = watch('name');
  const ticker = watch('ticker');
  const maxSupply = watch('maxSupply');
  const ownerAddress = watch('ownerAddress');
  const logo = watch('logo');

  const assetText = assetType === 0 ? 'token' : 'NFT';
  const precision = watch('precision') || null;
  const initialSupply = watch('initialSupply');

  const [validImage, setValidImage] = useState(false);

  useEffect(() => {
    const getImage = async () => {
      const image = await validateImgUrl(logo, 2000);
      if (image) {
        setValidImage(true);
      }
    };
    getImage();
  }, []);

  const handlePreviousStep = () => {
    if (fromAdvancedSteps) {
      handleStep(prev => prev - 1);
    } else {
      handleStep(assetText === 'NFT' ? 6 : 8);
    }
  };

  const renderLogo = () => {
    if (validImage) {
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

    return <ConfirmCardImage>{name[0]?.toUpperCase()}</ConfirmCardImage>;
  };

  return (
    <>
      <GenericCardContainer>
        <div>
          <p>Create {assetText.charAt}</p>
          <p>Review</p>
        </div>
        <ReviewContainer>
          <span>Review your {assetText} settings</span>

          <ConfirmCardBasics tokenInfo>
            <div>
              {renderLogo()}
              <div>
                <span>{ticker}</span>
                <span>{name}</span>
              </div>
            </div>
            <ConfirmCardBasisInfo>
              <span>Max supply</span>
              <span>{maxSupply ? maxSupply : infinitySymbol}</span>
            </ConfirmCardBasisInfo>
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>Initial supply</span>
                <span>{initialSupply ? initialSupply : 0}</span>
              </ConfirmCardBasisInfo>
            )}
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>Precision</span>
                <span>
                  <span>{precision || 0} </span>:{' '}
                  <strong>({formatPrecision(precision ?? 0, true)})</strong>
                  <Tooltip msg="Min unity" />
                </span>
              </ConfirmCardBasisInfo>
            )}
            <ConfirmCardBasisInfo>
              <span>Owner address</span>
              <span>{parseAddress(ownerAddress, 14)}</span>
            </ConfirmCardBasisInfo>
          </ConfirmCardBasics>
          <TransactionDetails />
          <TransactionDetails2 {...{ assetType, additionalFields }} />
          <TransactionDetails3 assetType={assetType} />
        </ReviewContainer>
        <ButtonsContainer isRow>
          <BackArrowSpan onClick={handlePreviousStep}>
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

// TODO ->type
export const StepsBasics: React.FC<any> = ({
  selectedStep,
  steps,
  advancedStepsLabels,
  basicTotalSteps,
  advancedStepsIndex,
}) => {
  const { isMobile, isTablet } = useMobile();

  if (selectedStep >= 1 && selectedStep < 8 && (isMobile || isTablet)) {
    return (
      <StepsContainer>
        {steps.map((_: any, index: number) => {
          if (index < 7) {
            return (
              <StepsItem
                key={index}
                isDone={selectedStep - 1 > index}
                selected={selectedStep - 1 === index}
              >
                {selectedStep - 1 <= index && index + 1}
                {selectedStep - 1 > index && <WhiteTick />}
              </StepsItem>
            );
          }
        })}
      </StepsContainer>
    );
  }
  if (selectedStep >= 9 && isTablet && selectedStep !== steps.length - 1) {
    return (
      <StepsContainer advancedSteps>
        {advancedStepsLabels.map((label: string, index: number) => {
          if (index < basicTotalSteps) {
            return (
              <StepsItemContainer key={index + label}>
                <StepsItem
                  isDone={selectedStep > advancedStepsIndex[index]}
                  selected={selectedStep === advancedStepsIndex[index]}
                >
                  {selectedStep <= advancedStepsIndex[index] && index + 1}
                  {selectedStep > advancedStepsIndex[index] && <WhiteTick />}
                </StepsItem>
                <span>{label}</span>
              </StepsItemContainer>
            );
          }
        })}
      </StepsContainer>
    );
  }

  return <></>;
};

// TODO -> type
export const DesktopStepsComponent: React.FC<any> = ({
  selectedStep,
  setSelectedStep,
  steps,
  advancedStepsLabels,
  basicTotalSteps,
  advancedStepsIndex,
  basicStepsLabels,
  basicStepsInfo,
  titleName = 'Basic Information',
  isNFT = true,
}) => {
  const { isMobile, isTablet } = useMobile();
  const [showBasicSteps, setShowBasicSteps] = useState(false);

  const handleSelectStep = (index: number) => {
    if (steps[index].isDone) setSelectedStep(index + 1);
  };

  useEffect(() => {
    const assetStep = !isNFT ? 9 : 8;
    if (selectedStep >= assetStep) {
      setShowBasicSteps(true);
    }
    if (selectedStep < assetStep) {
      setShowBasicSteps(false);
    }
    if (!advancedStepsLabels) {
      setShowBasicSteps(false);
    }
  }, [selectedStep]);

  if (!isMobile && !isTablet && selectedStep !== 0) {
    return (
      <StepsContainerDesktop>
        <DesktopBasicSteps>
          <div>
            <span>{titleName}</span>
            <span>STEPS</span>
          </div>
          <button
            type="button"
            onClick={() => setShowBasicSteps(!showBasicSteps)}
          >
            {showBasicSteps ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </button>
        </DesktopBasicSteps>
        <StepsExpandedContainer isHidden={showBasicSteps}>
          <StepsContainer>
            {steps.map((_: any, index: number) => {
              if (index < basicTotalSteps) {
                return (
                  <StepsItemContainerDesktop
                    key={index}
                    selected={selectedStep - 1 === index}
                  >
                    <StepsItem
                      isDone={selectedStep - 1 > index}
                      selected={selectedStep - 1 === index}
                    >
                      {selectedStep - 1 <= index && index + 1}
                      {selectedStep - 1 > index && <WhiteTick />}
                    </StepsItem>
                    <DesktopStepsLabel
                      onClick={() => handleSelectStep(index)}
                      isUpperCase={basicStepsLabels[index]
                        .toLowerCase()
                        .includes('ticker')}
                    >
                      <span>{basicStepsLabels[index]}</span>
                      <span>
                        {steps[index].isDone ? basicStepsInfo[index] : ''}
                      </span>
                    </DesktopStepsLabel>
                  </StepsItemContainerDesktop>
                );
              }
            })}
          </StepsContainer>
        </StepsExpandedContainer>
        {advancedStepsLabels && (
          <AdvancedStepsDesktop darkText={selectedStep < 9}>
            <div>
              <span>Advanced Options</span>
              <span>STEPS</span>
            </div>
            <StepsExpandedContainer
              isHidden={selectedStep < 9 && !showBasicSteps}
            >
              <StepsContainer>
                {advancedStepsLabels.map((_: string, index: number) => {
                  if (index < basicTotalSteps) {
                    return (
                      <StepsItemContainerDesktop
                        key={index}
                        selected={selectedStep - 1 === index}
                      >
                        <StepsItem
                          isDone={selectedStep > advancedStepsIndex[index]}
                          selected={selectedStep === advancedStepsIndex[index]}
                        >
                          {selectedStep <= advancedStepsIndex[index] &&
                            index + 1}
                          {selectedStep > advancedStepsIndex[index] && (
                            <WhiteTick />
                          )}
                        </StepsItem>
                        <div>
                          <span>{advancedStepsLabels[index]}</span>
                          <span />
                        </div>
                      </StepsItemContainerDesktop>
                    );
                  }
                })}
              </StepsContainer>
            </StepsExpandedContainer>
          </AdvancedStepsDesktop>
        )}
      </StepsContainerDesktop>
    );
  }

  return <></>;
};

export const ConfirmSuccessTransaction: React.FC<{ txHash: string }> = ({
  txHash,
}) => {
  return (
    <WizardTxSuccessComponent>
      <WizardTxSuccess />
      <span>Transaction Sent</span>
      <span>When confirmed on the blockchain, your token will be created.</span>
      <span>The token contract is generated after this confirmation.</span>
      <Link href={`/transaction/${txHash}`}>
        <a target="blank" href={`/transaction/${txHash}`} rel="noreferrer">
          <HashContainer>
            <div>
              <span>Transaction details</span>
              <span>
                Transaction Hash:
                {txHash}
              </span>
            </div>
            <WizardRightArrowSVG />
          </HashContainer>
        </a>
      </Link>
    </WizardTxSuccessComponent>
  );
};

// TODO -> types
const CreateAssetWizard: React.FC<any> = ({ isOpen, txHash, setTxHash }) => {
  const [fromAdvancedSteps, setFromAdvancedSteps] = useState(false);

  const stepsProps = {
    setTxHash,
    txHash,
    fromAdvancedSteps,
    setFromAdvancedSteps,
  };

  const CreateContractWizard: React.FC = () => {
    if (isOpen === 'Token') {
      return <WizCreateToken {...stepsProps} />;
    }
    if (isOpen === 'NFT') {
      return <WizCreateNFT {...stepsProps} />;
    }
    if (isOpen === 'ITO') {
      return <WizCreateITO {...stepsProps} />;
    }
    return <></>;
  };

  return <CreateContractWizard />;
};

export default CreateAssetWizard;
