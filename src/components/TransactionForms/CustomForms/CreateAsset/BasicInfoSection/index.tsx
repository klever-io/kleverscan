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
import { assetsTooltip as tooltip } from '../../utils/tooltips';
import { ISectionProps } from '..';

export const BasicInfoSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  isNFT,
  isFungible,
}) => {
  const [logoError, setLogoError] = useState<string | null>(null);
  const { watch, trigger } = useFormContext<ICreateAsset>();
  const { walletAddress } = useExtension();
  const precision = watch('precision');
  const logo = watch('logo');
  let logoTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    trigger('initialSupply');
    trigger('maxSupply');
  }, [precision, trigger]);

  const isValidLogo = async () => {
    const logoErrorMsg =
      'The logo link is invalid, which could lead to your logo not being displayed.';
    try {
      if (!!logo) {
        const isValid = await validateImgUrl(logo, 2000);
        if (!isValid) {
          setLogoError(logoErrorMsg);
          return;
        }
      }
      setLogoError(null);
    } catch (error) {
      setLogoError(logoErrorMsg);
    }
  };

  useEffect(() => {
    isValidLogo();
  }, [logo]);

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
        />
      )}
      <FormInput
        name="maxSupply"
        title="Maximum Supply"
        type="number"
        tooltip={tooltip.maxSupply}
        precision={precision}
      />
      <FormInput
        name="logo"
        title="Logo"
        span={2}
        tooltip={tooltip.logo}
        logoError={logoError}
      />
    </FormSection>
  );
};
