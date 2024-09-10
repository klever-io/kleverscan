import ToggleButton from '@/components/Button/Toggle';
import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { useExtension } from '@/contexts/extension';
import { validateImgUrl } from '@/utils/imageValidate';
import { ICreateAsset } from '@klever/sdk-web';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ISectionProps } from '..';
import { assetsTooltip as tooltip } from '../../utils/tooltips';
import { GenericInfoContainer } from '../styles';

export const BasicInfoSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  isNFT,
  isFungible,
}) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const { watch, trigger } = useFormContext<ICreateAsset>();
  const { walletAddress } = useExtension();
  const [isEqual, setIsEqual] = useState(false);
  const [iAgree, setIAgree] = useState(false);

  const precision = watch('precision');
  const logo = watch('logo');
  const initialSupply = watch('initialSupply');
  const maxSupply = watch('maxSupply');
  let logoTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    trigger('initialSupply');
    trigger('logo');
  }, [precision, trigger]);

  const isValidLogo = async () => {
    const logoErrorMsg =
      'The logo link is invalid, which could lead to your logo not being displayed.';
    try {
      if (!!logo) {
        const [isValid, erroMessage] = await validateImgUrl(logo, 2000);
        if (!isValid) {
          if (erroMessage) {
            return erroMessage;
          } else {
            setLogoError(logoErrorMsg);
            return false;
          }
        }
      }
      setLogoError(null);
    } catch (error) {
      setLogoError(logoErrorMsg);
    }
  };

  function handlerOnClick() {
    setIAgree(old => !old);
  }

  useEffect(() => {
    trigger('initialSupply');
  }, [iAgree]);

  useEffect(() => {
    if (initialSupply === maxSupply) {
      setIsEqual(true);
    } else {
      setIsEqual(false);
    }
  }, [initialSupply, maxSupply]);

  function handlerValidate() {
    if (isEqual && !iAgree) {
      return 'You must agree to continue!';
    }
    return true;
  }

  return (
    <FormSection>
      <SectionTitle>
        <span>Basic Info</span>
      </SectionTitle>
      <FormInput name="name" title="Name" required />
      <FormInput
        name="ticker"
        title="Ticker"
        tooltip={tooltip.ticker}
        required
      />
      <FormInput
        name="ownerAddress"
        title="Owner Address"
        required
        dynamicInitialValue={walletAddress}
      />
      {!isNFT && (
        <FormInput
          name="precision"
          title="Precision"
          type="number"
          tooltip={tooltip.precision}
          required
        />
      )}
      {isFungible && (
        <FormInput
          name="initialSupply"
          title="Initial Supply"
          type="number"
          tooltip={tooltip.initialSupply}
          precision={precision}
          warning={isEqual}
          propsValidate={handlerValidate}
        />
      )}
      <FormInput
        name="maxSupply"
        title="Maximum Supply"
        type="number"
        tooltip={tooltip.maxSupply}
        precision={precision}
        warning={isEqual}
      />
      {isEqual && (
        <GenericInfoContainer>
          <ToggleButton active={iAgree} onClick={handlerOnClick} />
          <p>
            I agree that setting the max. supply to the same value as the
            initial supply will make it impossible for users to purchase and the
            entire amount will be sent to my wallet.
          </p>
        </GenericInfoContainer>
      )}
      <FormInput
        name="logo"
        title="Logo"
        span={2}
        tooltip={tooltip.logo}
        logoError={logoError}
        propsValidate={isValidLogo}
      />
    </FormSection>
  );
};
