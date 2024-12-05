import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { parseAddress } from '@/utils/parseValues';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { checkEmptyField } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';
import { ConnectButtonComponent } from '../ConnectButtonComponent';
import {
  AddressesContainer,
  ChangedAddressContainer,
  GenericAddressCard,
  GenericCardContainer,
  GenericInput,
  WizardAddressCheck,
  WizardFailAddressCheck,
} from '../styles';

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
  }, [walletAddress]);

  const { isMobile, isTablet } = useMobile();
  const ownerAddress = watch(formValue || '');
  let error = formValue && errors[formValue];

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
