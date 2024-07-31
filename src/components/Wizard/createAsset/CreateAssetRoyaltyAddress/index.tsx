import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { parseAddress } from '@/utils/parseValues';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '..';
import { checkEmptyField } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  AddressesContainer,
  ChangedAddressContainer,
  GenericAddressCard,
  GenericCardContainer,
  GenericInput,
  WizardAddressCheck,
  WizardFailAddressCheck,
} from '../styles';

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
  }, [walletAddress, setValue]);

  const { isMobile, isTablet } = useMobile();
  const ownerAddress = watch('royalties.address');
  let error = errors?.royalties?.address;

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
        <p>{t('wizards:common.advancedOptions.royalties.royalties')}</p>
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
            {t('wizards:common.basicOptions.ownerAddress')}
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
