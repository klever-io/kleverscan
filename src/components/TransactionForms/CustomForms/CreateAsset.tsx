import { useExtension } from '@/contexts/extension';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { validateImgUrl } from '@/utils/imageValidate';
import { ICreateAsset } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../FormInput/styles';
import {
  ButtonContainer,
  FormBody,
  FormSection,
  SectionTitle,
} from '../styles';
import {
  parseProperties,
  parseSplitRoyalties,
  parseStaking,
  parseURIs,
  percentageProps,
} from './utils';
import { assetsTooltip as tooltip } from './utils/tooltips';

interface IPrecisionProps {
  precision: number;
}
interface ISectionProps {
  isNFT?: boolean;
  precision?: number;
}

const parseCreateAsset = (data: ICreateAsset) => {
  data.type = data.type ? 1 : 0;
  parseSplitRoyalties(data);
  parseURIs(data);
  parseStaking(data);
  parseProperties(data);
};

const CreateAsset: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch } = useFormContext<ICreateAsset>();

  const isNFT = Boolean(watch('type'));

  const precision = watch('precision');

  const onSubmit = async (data: ICreateAsset) => {
    parseCreateAsset(data);
    await handleFormSubmit(data);
  };

  const sectionProps = { isNFT, precision };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="type"
          title={t('CreateTransactions.Asset Type')}
          type="checkbox"
          toggleOptions={['Token', 'NFT']}
        />
      </FormSection>
      <BasicInfoSection {...sectionProps} />
      <URIsSection />
      <RoyaltiesSection {...sectionProps} />
      {!isNFT && <StakingSection />}
      <RolesSection />
      <PropertiesSection />
    </FormBody>
  );
};

const BasicInfoSection: React.FC<ISectionProps> = ({ isNFT }) => {
  const { t } = useTranslation('transactions');
  const [logoError, setLogoError] = useState<string | null>(null);
  const { watch, trigger, setValue } = useFormContext<ICreateAsset>();
  const { walletAddress } = useExtension();
  const precision = watch('precision');
  const logo = watch('logo');
  let logoTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    trigger('initialSupply');
    trigger('maxSupply');
  }, [precision, trigger]);

  const isValidLogo = async () => {
    try {
      if (!!logo) {
        const isValid = await validateImgUrl(logo, 2000);
        if (!isValid) {
          setLogoError(t('CreateTransactions.logoErrorMsg'));
          return;
        }
      }
      setLogoError(null);
    } catch (error) {
      setLogoError(t('CreateTransactions.logoErrorMsg'));
    }
  };

  useEffect(() => {
    isValidLogo();
  }, [logo]);

  return (
    <FormSection>
      <SectionTitle>
        <span>{t('CreateTransactions.Basic Info')}</span>
      </SectionTitle>
      <FormInput name="name" title={t('CreateAsset.Name')} required />
      <FormInput
        name="ticker"
        title={t('CreateAsset.Ticker')}
        tooltip={tooltip.ticker}
        required
      />
      <FormInput
        name="ownerAddress"
        title={t('OwnerAddress')}
        required
        dynamicInitialValue={walletAddress}
      />
      {!isNFT && (
        <FormInput
          name="precision"
          title={t('Precision')}
          type="number"
          tooltip={tooltip.precision}
          required
        />
      )}
      {!isNFT && (
        <FormInput
          name="initialSupply"
          title={t('CreateAsset.Initial Supply')}
          type="number"
          tooltip={tooltip.initialSupply}
          precision={precision}
        />
      )}
      <FormInput
        name="maxSupply"
        title={t('CreateAsset.Max Supply')}
        type="number"
        tooltip={tooltip.maxSupply}
        precision={precision}
      />
      <FormInput
        name="logo"
        title={t('CreateValidator.Logo')}
        span={2}
        tooltip={tooltip.logo}
        logoError={logoError}
      />
    </FormSection>
  );
};

interface URIProps {
  tooltip?: string;
}

export const URIsSection: React.FC<URIProps> = ({ tooltip: customTooltip }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'uris',
  });

  return (
    <FormSection inner>
      <SectionTitle>
        <span>URIs</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{customTooltip ? customTooltip : tooltip.uris.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            URI {index + 1}
          </SectionTitle>
          <FormInput
            name={`uris[${index}].label`}
            title={t('CreateAsset.Label')}
            span={2}
            tooltip={tooltip.uris.label}
            required
          />
          <FormInput
            name={`uris[${index}].value`}
            title={t('Address')}
            span={2}
            tooltip={tooltip.uris.address}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        {t('CreateAsset.Add Uri')}
      </ButtonContainer>
    </FormSection>
  );
};

export const RoyaltiesSection: React.FC<ISectionProps> = props => {
  const { t } = useTranslation('transactions');
  const { isNFT } = props;
  const { walletAddress } = useExtension();
  let precision = 8;
  if (props?.precision !== undefined) {
    precision = props.precision;
  }

  return (
    <FormSection>
      <SectionTitle>
        <span>Royalties</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.royalties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      <FormInput
        paddingTop={2}
        name="royalties.address"
        title={t('Address')}
        span={2}
        tooltip={tooltip.royalties.address}
        dynamicInitialValue={walletAddress}
        required
      />
      {isNFT && (
        <FormInput
          name="royalties.transferFixed"
          title={t('Transfer.Transfer Fixed')}
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.transferFixed}
        />
      )}
      {isNFT && (
        <FormInput
          name="royalties.marketPercentage"
          title={t('CreateAsset.Market Percent')}
          type="number"
          {...percentageProps}
          tooltip={tooltip.royalties.marketPercentage}
        />
      )}
      {isNFT && (
        <FormInput
          name="royalties.marketFixed"
          title={t('CreateAsset.Market Fixed')}
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.marketFixed}
        />
      )}
      <FormInput
        name="royalties.itoPercentage"
        title={t('CreateAsset.ITO', { type: `${t('Transfer.Percentage')}` })}
        type="number"
        {...percentageProps}
        tooltip={tooltip.royalties.itoPercentage}
      />
      <FormInput
        name="royalties.itoFixed"
        title={t('CreateAsset.ITO', { type: `${t('CreateAsset.Fixed')}` })}
        type="number"
        precision={KLV_PRECISION}
        tooltip={tooltip.royalties.itoFixed}
      />

      {!isNFT && <TransferPercentageSection precision={precision} />}
      <SplitRoyaltiesSection {...props} />
    </FormSection>
  );
};

const TransferPercentageSection: React.FC<IPrecisionProps> = ({
  precision,
}) => {
  const { t } = useTranslation('transactions');
  const { control, watch, trigger, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transferPercentage',
  });

  useEffect(() => {
    trigger('royalties.transferPercentage');
  }, [precision, trigger]);

  return (
    <FormSection inner>
      <SectionTitle>
        <span>{t('CreateAsset.Transfer Percentage')}</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.royalties.transferPercentage.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            {t('CreateAsset.Transfer Percentage')} {index + 1}
          </SectionTitle>
          <FormInput
            name={`royalties.transferPercentage[${index}].amount`}
            title={t('Amount')}
            type="number"
            tooltip={tooltip.royalties.transferPercentage.amount}
            precision={precision}
            required
          />
          <FormInput
            name={`royalties.transferPercentage[${index}].percentage`}
            title={t('Transfer.Percentage')}
            type="number"
            tooltip={tooltip.royalties.transferPercentage.percentage}
            {...percentageProps}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        {t('CreateAsset.Add')}
      </ButtonContainer>
    </FormSection>
  );
};

const SplitRoyaltiesSection: React.FC<ISectionProps> = ({ isNFT }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splitRoyalties',
  });
  return (
    <FormSection inner>
      <SectionTitle>
        <span>{t('CreateAsset.Split Royalties')}</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.royalties.splitRoyalties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            {t('CreateAsset.Split Royalties')} {index + 1}
          </SectionTitle>
          <FormInput
            name={`royalties.splitRoyalties[${index}].address`}
            title={t('Address')}
            span={2}
            tooltip={tooltip.royalties.splitRoyalties.address}
            required
          />
          {!isNFT && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentTransferPercentage`}
              title={t('CreateAsset.Percentage Over', {
                type: `${t('CreateAsset.Transfer Percentage')}`,
              })}
              type="number"
              tooltip={
                tooltip.royalties.splitRoyalties.percentTransferPercentage
              }
              {...percentageProps}
            />
          )}
          {isNFT && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentTransferFixed`}
              title={t('CreateAsset.Percentage Over', {
                type: `${t('Transfer.Transfer Fixed')}`,
              })}
              type="number"
              tooltip={tooltip.royalties.splitRoyalties.percentTransferFixed}
              {...percentageProps}
            />
          )}
          {isNFT && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentMarketPercentage`}
              title={t('CreateAsset.Percentage Over', {
                type: `${t('CreateAsset.Market Percent')}`,
              })}
              tooltip={tooltip.royalties.splitRoyalties.percentMarketPercentage}
              {...percentageProps}
            />
          )}
          {isNFT && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentMarketFixed`}
              title={t('CreateAsset.Percentage Over', {
                type: `${t('CreateAsset.Market Fixed')}`,
              })}
              tooltip={tooltip.royalties.splitRoyalties.percentMarketFixed}
              {...percentageProps}
            />
          )}
          <FormInput
            name={`royalties.splitRoyalties[${index}].percentITOPercentage`}
            title={t('CreateAsset.Percentage Over', {
              type: `${t('CreateAsset.ITO', {
                type: `${t('Transfer.Percentage')}`,
              })}`,
            })}
            tooltip={tooltip.royalties.splitRoyalties.percentItoPercentage}
            {...percentageProps}
          />
          <FormInput
            name={`royalties.splitRoyalties[${index}].percentITOFixed`}
            title={t('CreateAsset.Percentage Over', {
              type: `${t('CreateAsset.ITO', {
                type: `${t('CreateAsset.Fixed')}`,
              })}`,
            })}
            tooltip={tooltip.royalties.splitRoyalties.percentItoFixed}
            {...percentageProps}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        {t('CreateAsset.Add')}
      </ButtonContainer>
    </FormSection>
  );
};

interface IStakingSectionProps {
  assetTrigger?: boolean;
  isFPR?: boolean;
}

export const StakingSection: React.FC<IStakingSectionProps> = ({
  assetTrigger = false,
  isFPR: isFPRProp,
}) => {
  const { t } = useTranslation('transactions');
  const { watch, setValue } = useFormContext();
  const isFPR = watch('staking.interestType');

  useEffect(() => {
    if (assetTrigger) {
      setValue('staking.interestType', Number(isFPRProp));
    }
  }, [assetTrigger, isFPRProp, setValue]);

  return (
    <FormSection inner>
      <SectionTitle>
        <span>{t('CreateAsset.Staking')}</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.staking.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {!assetTrigger && (
        <FormInput
          name="staking.interestType"
          title={t('CreateAsset.Interest Type')}
          type="checkbox"
          toggleOptions={['APR', 'FPR']}
        />
      )}
      {!isFPR && !isFPRProp && (
        <FormInput
          name="staking.apr"
          title="APR"
          type="number"
          {...percentageProps}
          max={undefined}
          tooltip={tooltip.staking.apr}
        />
      )}
      <FormInput
        name="staking.minEpochsToClaim"
        title={t('AssetTrigger.Min Epochs To', { type: t('Claim.Claim') })}
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToClaim}
      />
      <FormInput
        name="staking.minEpochsToUnstake"
        title={t('AssetTrigger.Min Epochs To', {
          type: t('AssetTrigger.Unstake'),
        })}
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToUnstake}
      />
      <FormInput
        name="staking.minEpochsToWithdraw"
        title={t('AssetTrigger.Min Epochs To', {
          type: t('Withdraw.Withdraw'),
        })}
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToWithdraw}
      />
    </FormSection>
  );
};

export const RolesSection: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });
  return (
    <FormSection>
      <SectionTitle>
        <span>{t('CreateAsset.Roles')}</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.roles.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            {t('AssetTrigger.Role')} {index + 1}
          </SectionTitle>
          <FormInput
            name={`roles[${index}].address`}
            title={t('Address')}
            span={2}
            tooltip={tooltip.roles.address}
          />
          <FormInput
            name={`roles[${index}].hasRoleMint`}
            title={t('CreateAsset.HasRoleMint')}
            type="checkbox"
            toggleOptions={[
              `${commonT('Statements.No')}`,
              `${commonT('Statements.Yes')}`,
            ]}
            tooltip={tooltip.roles.hasRoleMint}
          />
          <FormInput
            name={`roles[${index}].hasRoleSetITOPrices`}
            title={t('CreateAsset.HasRoleITO')}
            type="checkbox"
            toggleOptions={[
              `${commonT('Statements.No')}`,
              `${commonT('Statements.Yes')}`,
            ]}
            tooltip={tooltip.roles.hasRoleSetITOPrices}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        {t('CreateAsset.Add Role')}
      </ButtonContainer>
    </FormSection>
  );
};

const PropertiesSection: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  return (
    <FormSection>
      <SectionTitle>
        <span>{t('CreateAsset.Properties')}</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.properties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>

      <FormInput
        name="properties.canFreeze"
        title={commonT('Properties.Freeze')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canFreeze}
      />
      <FormInput
        name="properties.canWipe"
        title={commonT('Properties.Wipe')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={false}
        tooltip={tooltip.properties.canWipe}
      />
      <FormInput
        name="properties.canPause"
        title={commonT('Properties.Pause')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canPause}
      />
      <FormInput
        name="properties.canMint"
        title={commonT('Properties.Mint')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canMint}
      />
      <FormInput
        name="properties.canBurn"
        title={commonT('Properties.Burn')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canBurn}
      />
      <FormInput
        name="properties.canChangeOwner"
        title={commonT('Properties.Change Owner')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canChangeOwner}
      />
      <FormInput
        name="properties.canAddRoles"
        title={commonT('Properties.Add Roles')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canAddRoles}
      />
    </FormSection>
  );
};

export default CreateAsset;
