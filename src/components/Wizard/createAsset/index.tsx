import { PropsWithChildren } from 'react';
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
import { TFunction, useTranslation } from 'next-i18next';
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
  t: TFunction;
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

export const propertiesValues = (t: TFunction): any[] => {
  return [
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Freeze')}`,
      }),
      isDefaultChecked: true,
      property: 'canFreeze',
      tooltip: t('wizards:common.properties.tooltipFreeze'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Pause')}`,
      }),
      isDefaultChecked: true,
      property: 'canPause',
      tooltip: t('wizards:common.properties.tooltipPause'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Burn')}`,
      }),
      isDefaultChecked: true,
      property: 'canBurn',
      tooltip: t('wizards:common.properties.tooltipBurn'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Add Roles')}`,
      }),
      isDefaultChecked: true,
      property: 'canAddRoles',
      tooltip: t('wizards:common.properties.tooltipAddRoles'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Mint')}`,
      }),
      isDefaultChecked: true,
      property: 'canMint',
      tooltip: t('wizards:common.properties.tooltipMint'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Change Owner')}`,
      }),
      isDefaultChecked: true,
      property: 'canChangeOwner',
      tooltip: t('wizards:common.properties.tooltipChangeOwner'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Wipe')}`,
      }),
      isDefaultChecked: false,
      property: 'canWipe',
      tooltip: t('wizards:common.properties.tooltipWipe'),
    },
  ];
};

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

export const ConnectButtonComponent: React.FC<PropsWithChildren> = () => {
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

export const ButtonsComponent: React.FC<
  PropsWithChildren<IButtonsComponenets>
> = ({
  buttonsProps: { handleStep, next, previousStep },
  noNextButton = false,
  isRow = true,
}) => {
  const { t } = useTranslation('wizards');
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
          <p>{t('common.next')}</p>
          <WizardRightArrowSVG />
        </WizardButton>
      )}
    </ButtonsContainer>
  );
};

export const CreateAssetWelcomeStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: {
    title,
    description,
    tooltip,
    kleverTip,
    transactionCost,
    timeEstimated,
  },
  handleStep,
  t,
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
          {t('wizards:common.txCost')} {transactionCost} KLV.
        </span>
        <WizardButton onClick={() => handleStep(prev => prev + 1)} fullWidth>
          <p>{t('wizards:common.readyText')}</p>
          <WizardRightArrowSVG />
        </WizardButton>
        <span>
          <IconWizardClock style={{ height: '1rem', width: '1rem' }} />
          {t('wizards:common.estimatedTime')} <strong>{timeEstimated}</strong>
        </span>
      </div>
    </CardContainer>
  );
};

export const CreateAssetNameStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
  t,
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
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
              required: {
                value: true,
                message: t('wizards:common.errorMessage.required'),
              },
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: t('wizards:common.errorMessage.blankSpace'),
              },
            })}
          />

          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetTickerStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { currentStep, title, description }, handleStep, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
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
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            minLength: {
              value: 3,
              message: t('wizards:common.errorMessage.minLength'),
            },
            pattern: {
              value: /^[^\s]*$/,
              message: t('wizards:common.errorMessage.noSpaceTicker'),
            },
            validate: (value: string) => {
              if (
                value.toUpperCase() === 'KLV' ||
                value.toUpperCase() === 'KFI'
              ) {
                return `${t('wizards:common.errorMessage.cannotBeKLVnorKFI')}`;
              }
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('wizards:createAssetCommon.ticker.kleverTip')}
        </GenericInfoCard>
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetOwnerAddressStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: { currentStep, description, formValue },
  handleStep,
  t,
}) => {
  const [address, setAddress] = useState('');
  const [changeOwnerAddress, setChangeOwnerAddress] = useState(false);
  const [checkedField, setCheckedField] = useState(0);

  const { walletAddress } = useExtension();

  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const getWallet = walletAddress;
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

  const AddressValidationIcon: React.FC<PropsWithChildren<{ error: any }>> = ({
    error,
  }) => {
    if (error) return <WizardFailAddressCheck />;

    if (changeOwnerAddress && ownerAddress?.length === 62 && !error)
      return <WizardAddressCheck />;

    return <></>;
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:common.basicOptions.ownerAddress')}</p>
        <p>{description}</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeOwnerAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                {t('wizards:common.useConnectedAddress')}
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
              {t('wizards:common.useAnotherAddress')}
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
        {changeOwnerAddress && !isTablet && (
          <div>
            {t('wizards:common.basicOptions.ownerAddress')}
            <GenericInput
              error={error}
              type="text"
              autoFocus={changeOwnerAddress}
              {...register('ownerAddress', {
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
        {!isTablet && !isMobile && changeOwnerAddress && (
          <AddressValidationIcon error={error} />
        )}
      </ChangedAddressContainer>
      <ConnectButtonComponent />
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetRoyaltyAddress: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, previousStep, t }) => {
  const [address, setAddress] = useState('');
  const [changeOwnerAddress, setChangeOwnerAddress] = useState(false);
  const [checkedField, setCheckedField] = useState(0);

  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const { walletAddress } = useExtension();

  useEffect(() => {
    const getWalletAddress = walletAddress;
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

  const AddressValidationIcon: React.FC<PropsWithChildren<{ error: any }>> = ({
    error,
  }) => {
    if (error) return <WizardFailAddressCheck />;

    if (changeOwnerAddress && ownerAddress?.length === 62 && !error)
      return <WizardAddressCheck />;

    return <></>;
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.eachAdvancedText')}</p>
        <p>{t('wizards:common.step')} 2/5</p>
      </div>
      <div>
        <p>{t('wizards:common.address')}</p>
        <p>{t('wizards:common.advancedOptions.royalties.royaltiesInfo')}</p>

        <AddressesContainer>
          <GenericAddressCard
            selected={!changeOwnerAddress}
            onClick={() => handleChange(false, 0)}
          >
            <div>
              <div>
                {t('wizards:common.useConnectedAddress')}
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
              {t('wizards:common.useAnotherAddress')}
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
            {t('wizards:common.ownerAddress')}
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

const CreateAssetRoyaltyITOToken: React.FC<PropsWithChildren<any>> = ({
  buttonsProps,
  t,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

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
        <p>{t('wizards:common.advancedOptions.eachAdvancedText')}</p>
        <p>{t('wizards:common.step')} 3/5</p>
      </div>
      <div>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.setTheValuesITORoyalties',
            { ticker },
          )}
        </p>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.nowChooseReceiverAddress',
          )}
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
        <p>{t('wizad:common.advancedOptions.royalties.percentageITOBuy')}</p>
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
        <p>{t('wizad:common.advancedOptions.royalties.fixedAmountITOBuy')}</p>
        {errorTransferFixed && (
          <ErrorMessage>{errorTransferFixed?.message}</ErrorMessage>
        )}
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

// TODO -> Check translation for the NFT
const CreateAssetRoyaltyITONFT: React.FC<PropsWithChildren<any>> = ({
  buttonsProps,
}) => {
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

export const CreateAssetRoyaltyITOPerc: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, isNFT, t }) => {
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const props = {
    buttonsProps,
    t,
  };

  if (!isNFT) {
    return <CreateAssetRoyaltyITOToken {...props} />;
  } else {
    return <CreateAssetRoyaltyITONFT {...props} />;
  }
};

export const CreateAssetRoyaltyTransferPerc: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
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
        <p>
          {t('wizards:common.advancedOptions.royalties.transferPercentage')}
        </p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.royalties.transferPercentage')}{' '}
          {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>
          {t('wizards:common.advancedOptions.royalties.fillAmountPercentage')}
        </p>
        <p>
          {t(
            'wizards:common.advancedOptions.royalties.percentageValuesTransfers',
            { ticker },
          )}
        </p>
        <GenericInput
          error={errorTransferPercAmount}
          type="number"
          {...register(`royalties.transferPercentage[${currentIndex}].amount`, {
            valueAsNumber: true,
          })}
          placeholder="Amount"
        />
        <p>{t('wizards:common.advancedOptions.royalties.amountHint')}</p>
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
        <p>{t('wizards:common.advancedOptions.royalties.percentageHint')}</p>
        {errorTransferPerc && (
          <ErrorMessage>{errorTransferPerc?.message}</ErrorMessage>
        )}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:common.advancedOptions.royalties.removePercentage')}
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
          <span>
            {t('wizards:common.advancedOptions.royalties.addPercentage')}
          </span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetSplitRoyalties: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
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
        <p>{t('wizards:common.advancedOptions.eachAdvancedText')}</p>
        <p>{t('wizards:common.advancedOptions.royalties.splitRoyalties')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.royalties.wantToSplitRoyalties')}
        </p>
        <ButtonsContainer columnDirection>
          <WizardButton
            centered
            onClick={() => {
              setSplitRoyalties(true);
            }}
          >
            {t('wizards:common.advancedOptions.royalties.statements')}
          </WizardButton>
          <WizardButton secondary centered onClick={() => handleStep(10)}>
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>
        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:common.advancedOptions.royalties.whatSplitRoyalties')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.royalties.royaltyReceiverAddress')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.royalties.splitRoyalties')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.royalties.splitRoyalties')}{' '}
          {currentIndex + 1}/{fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.royalties.howRoyaltiesSplit')}</p>
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
        <p>
          {t('wizards:common.advancedOptions.royalties.royaltyReceiverAddress')}
        </p>
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
          {t(
            'wizards:common.advancedOptions.royalties.transferPercentageReceiverAddressFee',
          )}
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
          {t(
            'wizards:common.advancedOptions.royalties.itoPercentageReceiverAddressFee',
          )}
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
          {t(
            'wizards:common.advancedOptions.royalties.itoFixedReceiverAddressFee',
          )}
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
          {t('wizards:common.remove')}
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
          <span>{t('wizards:common.addAnother', { text: 'URI' })}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetRoyaltySteps: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, isNFT = false, t }) => {
  const { watch } = useFormContext();
  const [royalties, setRoyalties] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const previousSteps = () => {
    handleStep(prev => prev - 1);
  };

  const commonProps = {
    handleStep: setCurrentStep,
    previousStep: handleStep,
    t,
  };

  const tokenTransferRoyalties = [
    {
      key: 'selectRolyaltyTransferPerc',
      label: 'Select Rolyalty Transfer Perc',
      isDone: false,
      component: (
        <CreateAssetRoyaltyTransferPerc handleStep={setCurrentStep} t={t} />
      ),
    },
  ];

  const [royaltiesSteps, setRoyaltiesSteps] = useState([
    {
      key: 'selectRolyaltyAddress',
      label: 'Select Rolyalty Address',
      isDone: false,
      component: <CreateAssetRoyaltyAddress {...commonProps} />,
    },
    {
      key: 'selectRolyaltyITOPerc',
      label: 'Select Rolyalty ITO Perc',
      isDone: false,
      component: <CreateAssetRoyaltyITOPerc {...commonProps} isNFT={isNFT} />,
    },
    {
      key: 'selectSplitRolyalty',
      label: 'Select Split Rolyalty',
      isDone: false,
      component: <CreateAssetSplitRoyalties {...commonProps} />,
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
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.royalties.royalties')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.royalties.enableRoyalties', {
            ticker,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setRoyalties(true)}>
            {t('wizards:common.advancedOptions.royalties.statements')}
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
          {t('wizards:common.advancedOptions.royalties.whatIsRoyalty')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.royalties.whatIsRoyaltyA')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const CreatePreicisonStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 4/7</p>
      </div>
      <div>
        <p>
          {t('wizards:common.basicOptions.whatTickerPrecision', { ticker })}
        </p>
        <p>{t('wizards:common.basicOptions.precisionHint')}</p>
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
              $isSelected={precision === index}
            >
              {index}
            </PrecisionCard>
          ))}
        </PrecicionsContainer>
        <GenericInfoCard>
          {t('wizards:common.basicOptions.kleverPrecisionTip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetInitialSupplyStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 5/7</p>
      </div>
      <div>
        <p>{t('wizards:common.basicOptions.initialSupplyOf', { ticker })}</p>
        <p>{t('wizards:common.basicOptions.initialSupplyHint')}</p>
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
          {t('wizards:common.basicOptions.kleverInitialSupplyTip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetMaxSupplyStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { description, kleverTip }, handleStep, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 6/7</p>
      </div>
      <div>
        <p>{t('wizards:common.maxSupplyOf', { ticker: ticker })}</p>
        <p>{description}</p>
        <GenericInput
          error={error}
          type="text"
          value={inputValue}
          placeholder="0"
          {...register('maxSupply', {
            pattern: {
              value: /\d+/g,
              message: t('wizards:common.errorMessage.onlyNumbers'),
            },
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

export const CreateAssetEightStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { currentStep, assetType }, handleStep, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:common.imageTicker', { ticker, assetText })}</p>
        <p>{t('wizards:common.imageInfo', { assetText })}</p>
        <GenericInput
          type="text"
          error={error}
          placeholder={t('wizards:common.uriPlaceholder')}
          {...register('logo', {
            validate: async logoUri => {
              const isValid = await validateImgUrl(logoUri, 2000);
              if (logoUri && !isValid) {
                return `${t('wizards:common.errorMessage.validURI')}`;
              }
              return true;
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>{t('wizards:common.imageTooltip')}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const URIsSection: React.FC<PropsWithChildren<IAssetInformations>> = ({
  informations: { assetType },
  handleStep,
  t,
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
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.URI.URI')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.URI.doYouWantAdd', {
            assetText,
          })}
        </p>
        <ButtonsContainer columnDirection>
          <WizardButton
            infoStep
            centered
            onClick={() => {
              setAddUri(true);
            }}
          >
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
          {t('wizards:common.advancedOptions.URI.whatIsAnURI')}?
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.URI.tooltip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.URI.URI')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.URI.URI')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.URI.fillTokenURIs')}</p>
        <GenericInput
          error={errorLabel}
          type="text"
          {...register(`uris[${currentIndex}].label`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
          })}
          placeholder="URI label"
        />
        <p>{t('wizards:common.advancedOptions.URI.labelURL')}</p>
        {errorLabel && <ErrorMessage>{errorLabel?.message}</ErrorMessage>}
        <GenericInput
          error={errorUri}
          type="text"
          {...register(`uris[${currentIndex}].uri`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            validate: uriValue => {
              if (uriValue && !validateUrl(uriValue, false)) {
                return `${t('wizards:common.errorMessage.validURI')}`;
              }
              return true;
            },
          })}
          placeholder="URI here"
        />
        <p>{t('wizards:common.advancedOptions.URI.exampleURI')}</p>
        {errorUri && <ErrorMessage>{errorUri?.message}</ErrorMessage>}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:common.advancedOptions.URI.removeURI')}
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
          <span>{t('wizards:common.advancedOptions.URI.addURI')}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

const SelectStakingTypeComponent: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ handleStep, setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const { setValue } = useFormContext();

  const buttonsProps = {
    handleStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{t('common.step')} 1</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.whatRewardModel')}</p>

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
              <span>{t('common.advancedOptions.staking.aprInfo')}</span>
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
              <span>{t('common.advancedOptions.staking.fprInfo')}</span>
            </div>
            <WizardRightArrowSVG />
          </PreConfirmOptions>
        </StakingTypeContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps as any} noNextButton />
    </GenericCardContainer>
  );
};

const StakingStepsGeneric: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} ${t('common.step')} 2/5`;
    }
    return `${stakingType} ${t('common.step')}  1/3`;
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
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.aprRate')}</p>
        <p>{t('common.advancedOptions.staking.aprRateInfo')}</p>
        <GenericInput
          error={error}
          align={'center'}
          type="number"
          placeholder="0"
          {...register('staking.apr', {
            pattern: {
              value: /\d+/g,
              message: t('common.errorMessage.onlyNumbersValue'),
            },
            valueAsNumber: true,
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('common.advancedOptions.staking.tooltipStepGeneric')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprOne: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} ${t('common.step')} 3/5`;
    }
    return `${stakingType} ${t('common.step')} 1/3`;
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
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.whatIsTheMinimum')}</p>
        <p>{t('common.advancedOptions.staking.eachEpoch')}</p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToClaim', {
            pattern: {
              value: /\d+/g,
              message: t('common.errorMessage.onlyNumbersValue'),
            },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('common.advancedOptions.staking.tooltipAprFpr')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprTwo: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} ${t('common.step')} 4/5`;
    }
    return `${stakingType} ${t('common.step')} 2/3`;
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
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.whatIsTheMinTime')}</p>
        <p>{t('common.advancedOptions.staking.eachEpoch')}</p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToUnstake', {
            pattern: {
              value: /\d+/g,
              message: t('common.errorMessage.onlyNumbersValue'),
            },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('common.advancedOptions.staking.tooltipAprFpr')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

const StakingStepsGenericAprFprThree: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} ${t('common.step')} 5/5`;
    }
    return `${stakingType} ${t('common.step')} 3/3`;
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
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.howLongWill')}</p>
        <p>{t('common.advancedOptions.staking.eachEpoch')}</p>
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
          {t('common.advancedOptions.staking.tooltipAprFpr')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};

export const CreateAssetStakingStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
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
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>
          {t('wizards:common.advancedOptions.staking.staking').toUpperCase()}
        </p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.staking.enableStaking', {
            ticker,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setStaking(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(11)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:common.advancedOptions.staking.whatIsStaking')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.staking.tooltip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};

export const CreateAssetAddRoles: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { assetType }, handleStep, t }) => {
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
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.roles.roles').toUpperCase()}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.roles.enableRoles', {
            ticker,
            assetText,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setAddRole(true)}>
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
          {t('wizards:common.advancedOptions.roles.whatIs')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.roles.setPermission')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p> {t('wizards:common.advancedOptions.roles.roles')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.roles.role')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.roles.enterAddress')}</p>
        <GenericInput
          error={error}
          type="text"
          placeholder="KDA address"
          {...register(`roles.${currentIndex}.address`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            minLength: {
              value: 62,
              message: t('wizards:common.errorMessage.charactersField', {
                number: 62,
              }),
            },
            maxLength: {
              value: 62,
              message: t('wizards:common.errorMessage.charactersField', {
                number: 62,
              }),
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <RolesContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput {...register(`roles.${currentIndex}.hasRoleMint`)} />
            {t('wizards:common.advancedOptions.roles.allowedToMintCoins')}
          </RolesCheckboxContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput
              {...register(`roles.${currentIndex}.hasRoleSetITOPrices`)}
            />
            {t('wizards:common.advancedOptions.roles.allowedToSetPrice')}
          </RolesCheckboxContainer>
        </RolesContainer>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.roles.tooltip')}
        </GenericInfoCard>
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          alignSelf
          fullWidth
        >
          {t('wizards:common.advancedOptions.roles.remove')}
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

            <span> {t('wizards:common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span> {t('wizards:common.next')}</span>
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
          <span> {t('wizards:common.advancedOptions.roles.addAnother')}</span>
          <WizardPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};

export const CreateAssetPropertiesStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: { title, description },
  handleStep,
  isLastStep = false,
  t,
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
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>
          {t(
            'wizards:common.advancedOptions.properties.properties',
          ).toUpperCase()}
        </p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <PropertiesContainer>
          {propertiesValues(t).map(property => (
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

export const CreateAssetPreConfimStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { assetType }, handleStep, handleAdvancedSteps, t }) => {
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
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.already')}</p>
      </div>
      <div>
        <p>{t('wizards:common.preConfirmInfo', { assetText })}</p>

        <PreConfirmOptions
          onClick={() => {
            handleStep(prev => prev + (assetText === 'NFT' ? 5 : 6));
          }}
        >
          <div>
            <span>
              {t('wizards:common.generateWithBasicInformation', { assetText })}
            </span>
            <span>
              {t('wizards:common.basicInformationConfirm', { assetText })}
            </span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <PreConfirmOptions secondary onClick={handleAdvancedStepsWrapper}>
          <div>
            <span>{t('wizards:common.addAdvancedSettings')}</span>
            <span>{t('wizards:common.advancedSettingsConfirm')}</span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <DefaultSettingsContainer
          showAdvanced={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>{t('wizards:common.showAllDefaultSettings')}</span>
          {!showAdvanced ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </DefaultSettingsContainer>
        <DefaultSettingsOptions showAdvanced={showAdvanced}>
          <div>
            <span>{t('common:Properties.Staking')}</span>
            <span>{t('common:Properties.Roles')}</span>
            <span>{t('common:Properties.Freeze')}</span>
            <span>{t('common:Properties.Burn')}</span>
            <span>{t('common:Properties.Add Roles')}</span>
            <span>{t('common:Properties.Wipe')}</span>
            <span>{t('common:Properties.Mint')}</span>
            <span>{t('common:Properties.Change Owner')}</span>
          </div>
          <div>
            <span> - </span>
            <span> - </span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.Yes')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
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

export const TransactionDetails: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('wizards');
  const { watch } = useFormContext();
  const address = watch('ownerAddress');
  return (
    <ReviewContainer>
      <span>{t('common.transactionDetails.transactionDetails')}</span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.transaction')}</span>
          <span>{t('common.transactionDetails.createAsset')}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.from')}</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.transactionDetails.fee')}</span>
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
  const { t } = useTranslation('wizards');
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
      <span>
        {(assetText as string).toUpperCase()}{' '}
        {t('common.transactionDetails.basicSettings')}
      </span>
      <ConfirmCardBasics>
        <ConfirmCardBasisInfo>
          <span>
            {assetText} {t('common.name')}
          </span>
          <span>{name}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {assetText} {t('common.ticker')}
          </span>
          <span>{ticker.toUpperCase()}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.maxSupply')}</span>
          <span>{maxSupply ? maxSupply : infinitySymbol}</span>
        </ConfirmCardBasisInfo>

        <ConfirmCardBasisInfo>
          <span>{t('common.URI', { assetText })}</span>
          <span>{logo || '--'}</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>{t('common.basicOptions.ownerAddress')}</span>
          <span>{parseAddress(address, 12)}</span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const TransactionDetails3: React.FC<
  PropsWithChildren<{ assetType?: number }>
> = ({ assetType }) => {
  const { t } = useTranslation(['wizards', 'common']);
  const { watch } = useFormContext();
  const properties = watch('properties');
  const assetText = assetType === 0 ? 'TOKEN' : 'NFT';

  return (
    <ReviewContainer>
      <span>
        {assetText} {t('wizards:common.transactionDetails.defaultSettings')}
      </span>
      <ConfirmCardBasics>
        {assetType === 0 && (
          <ConfirmCardBasisInfo>
            <span>{t('common:Properties.Staking')}</span>
            <span>--</span>
          </ConfirmCardBasisInfo>
        )}
        <ConfirmCardBasisInfo>
          <span>{t('common:Properties.Roles')}</span>
          <span>--</span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Freeze')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canFreeze
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Burn')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canBurn
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Pause')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canPause
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Add Roles')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canAddRoles
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Mint')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canMint
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Change Owner')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canChangeOwner
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
        <ConfirmCardBasisInfo>
          <span>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Wipe')}`,
            })}
            ?
          </span>
          <span>
            {properties?.canWipe
              ? `${t('common:Statements.Yes')}`
              : `${t('common:Statements.No')}`}
          </span>
        </ConfirmCardBasisInfo>
      </ConfirmCardBasics>
    </ReviewContainer>
  );
};

export const ConfirmTransaction: React.FC<
  PropsWithChildren<IWizardConfirmProps>
> = ({
  informations: { assetType, additionalFields },
  handleStep,
  fromAdvancedSteps,
  t,
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
          <p>
            {t('wizards:common.confirm.create', { type: assetText.charAt })}
          </p>
          <p>{t('wizards:common.confirm.review')}</p>
        </div>
        <ReviewContainer>
          <span>{t('wizards:common.confirm.reviewAsset', { assetText })}</span>

          <ConfirmCardBasics tokenInfo>
            <div>
              {renderLogo()}
              <div>
                <span>{ticker}</span>
                <span>{name}</span>
              </div>
            </div>
            <ConfirmCardBasisInfo>
              <span>{t('wizards:common.maxSupply')}</span>
              <span>{maxSupply ? maxSupply : infinitySymbol}</span>
            </ConfirmCardBasisInfo>
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>{t('wizards:common.initialSupply')}</span>
                <span>{initialSupply ? initialSupply : 0}</span>
              </ConfirmCardBasisInfo>
            )}
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>{t('wizards:common.precision')}</span>
                <span>
                  <span>{precision || 0} </span>:{' '}
                  <strong>({formatPrecision(precision ?? 0, true)})</strong>
                  <Tooltip msg="Min unity" />
                </span>
              </ConfirmCardBasisInfo>
            )}
            <ConfirmCardBasisInfo>
              <span>{t('wizards:common.basicOptions.ownerAddress')}</span>
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

// TODO ->type
export const StepsBasics: React.FC<PropsWithChildren<any>> = ({
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
export const DesktopStepsComponent: React.FC<PropsWithChildren<any>> = ({
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

export const ConfirmSuccessTransaction: React.FC<
  PropsWithChildren<{ txHash: string }>
> = ({ txHash }) => {
  return (
    <WizardTxSuccessComponent>
      <WizardTxSuccess />
      <span>Transaction Sent</span>
      <span>When confirmed on the blockchain, your token will be created.</span>
      <span>The token contract is generated after this confirmation.</span>
      <Link href={`/transaction/${txHash}`} target="blank" rel="noreferrer">
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
      </Link>
    </WizardTxSuccessComponent>
  );
};

// TODO -> types
const CreateAssetWizard: React.FC<PropsWithChildren<any>> = ({
  isOpen,
  txHash,
  setTxHash,
}) => {
  const [fromAdvancedSteps, setFromAdvancedSteps] = useState(false);

  const stepsProps = {
    setTxHash,
    txHash,
    fromAdvancedSteps,
    setFromAdvancedSteps,
  };

  const CreateContractWizard: React.FC<PropsWithChildren> = () => {
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
