import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { parseAddress } from '@/utils/parseValues';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetITOInformations } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  AddressesContainer,
  ChangedAddressContainer,
  GenericAddressCard,
  GenericCardContainer,
  GenericInput,
  WizardAddressCheck,
  WizardFailAddressCheck,
} from '../../createAsset/styles';
import { checkEmptyField } from '../../utils';

export const CreateITOThirdStep: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({
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
  let error = formValue && errors[formValue];

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

  const AddressValidationIcon: React.FC<PropsWithChildren<{ error: any }>> = ({
    error,
  }) => {
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
