import { PropsWithChildren } from 'react';
import { useExtension } from '@/contexts/extension';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { validateImgUrl } from '@/utils/imageValidate';
import { ICreateAsset } from '@klever/sdk-web';
import { useRouter } from 'next/router';
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
  removeWrapper,
} from './utils';
import { assetsTooltip as tooltip } from './utils/tooltips';
import { getNetwork } from '@/utils/networkFunctions';

interface IPrecisionProps {
  precision: number;
}
interface ISectionProps {
  isNFT?: boolean;
  isFungible?: boolean;
  precision?: number;
}

export const assetTypes = [
  {
    label: 'Fungible',
    value: 0,
  },
  {
    label: 'Non Fungible',
    value: 1,
  },
  {
    label: 'Semi Fungible',
    value: 2,
  },
];

const parseCreateAsset = (data: ICreateAsset) => {
  const dataCopy = JSON.parse(JSON.stringify(data));
  parseSplitRoyalties(dataCopy);
  parseURIs(dataCopy);
  parseStaking(dataCopy);
  parseProperties(dataCopy);

  return dataCopy;
};

const CreateAsset: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<ICreateAsset>();

  const isFungible = watch('type') === 0;
  const isNFT = watch('type') === 1;

  const precision = watch('precision');

  const onSubmit = async (data: ICreateAsset) => {
    const dataCopy = parseCreateAsset(data);
    await handleFormSubmit(dataCopy);
  };

  const sectionProps = { isNFT, isFungible, precision };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="type"
          title="Asset Type"
          type="dropdown"
          options={assetTypes}
          defaultValue={0}
        />
      </FormSection>
      <BasicInfoSection {...sectionProps} />
      <URIsSection />
      <RoyaltiesSection {...sectionProps} />
      {isFungible && <StakingSection />}
      <RolesSection />
      <PropertiesSection />
    </FormBody>
  );
};

const BasicInfoSection: React.FC<PropsWithChildren<ISectionProps>> = ({
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

interface URIProps {
  tooltip?: string;
}

export const URIsSection: React.FC<PropsWithChildren<URIProps>> = ({
  tooltip: customTooltip,
}) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
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
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
            URI {index + 1}
          </SectionTitle>
          <FormInput
            name={`uris[${index}].label`}
            title={`Label`}
            span={2}
            tooltip={tooltip.uris.label}
            required
          />
          <FormInput
            name={`uris[${index}].value`}
            title={`Address`}
            span={2}
            tooltip={tooltip.uris.address}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add URI
      </ButtonContainer>
    </FormSection>
  );
};

export const RoyaltiesSection: React.FC<
  PropsWithChildren<ISectionProps>
> = props => {
  const { isFungible } = props;
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
        title="Address"
        span={2}
        tooltip={tooltip.royalties.address}
        dynamicInitialValue={walletAddress}
        required
      />
      {!isFungible && (
        <FormInput
          name="royalties.transferFixed"
          title="Transfer Fixed"
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.transferFixed}
        />
      )}
      {!isFungible && (
        <FormInput
          name="royalties.marketPercentage"
          title="Market Percentage"
          type="number"
          {...percentageProps}
          tooltip={tooltip.royalties.marketPercentage}
        />
      )}
      {!isFungible && (
        <FormInput
          name="royalties.marketFixed"
          title="Market Fixed"
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.marketFixed}
        />
      )}
      <FormInput
        name="royalties.itoPercentage"
        title="ITO Percentage"
        type="number"
        {...percentageProps}
        tooltip={tooltip.royalties.itoPercentage}
      />
      <FormInput
        name="royalties.itoFixed"
        title="ITO Fixed"
        type="number"
        precision={KLV_PRECISION}
        tooltip={tooltip.royalties.itoFixed}
      />

      {isFungible && <TransferPercentageSection precision={precision} />}
      <SplitRoyaltiesSection {...props} />
    </FormSection>
  );
};

const TransferPercentageSection: React.FC<
  PropsWithChildren<IPrecisionProps>
> = ({ precision }) => {
  const { control, trigger, getValues } = useFormContext();
  const router = useRouter();
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
        <span>Transfer Percentage</span>
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
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
            Transfer Percentage {index + 1}
          </SectionTitle>
          <FormInput
            name={`royalties.transferPercentage[${index}].amount`}
            title={`Amount`}
            type="number"
            tooltip={tooltip.royalties.transferPercentage.amount}
            precision={precision}
            required
          />
          <FormInput
            name={`royalties.transferPercentage[${index}].percentage`}
            title={`Percentage`}
            type="number"
            tooltip={tooltip.royalties.transferPercentage.percentage}
            {...percentageProps}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add
      </ButtonContainer>
    </FormSection>
  );
};

const SplitRoyaltiesSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  isFungible,
}) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splitRoyalties',
  });
  return (
    <FormSection inner>
      <SectionTitle>
        <span>Split Royalties</span>
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
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
            Split Royalties {index + 1}
          </SectionTitle>
          <FormInput
            name={`royalties.splitRoyalties[${index}].address`}
            title={`Address`}
            span={2}
            tooltip={tooltip.royalties.splitRoyalties.address}
            required
          />
          {isFungible && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentTransferPercentage`}
              title={`Percentage over Transfer Percentage`}
              type="number"
              tooltip={
                tooltip.royalties.splitRoyalties.percentTransferPercentage
              }
              {...percentageProps}
            />
          )}
          {!isFungible && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentTransferFixed`}
              title={`Percentage over Transfer Fixed`}
              type="number"
              tooltip={tooltip.royalties.splitRoyalties.percentTransferFixed}
              {...percentageProps}
            />
          )}
          {!isFungible && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentMarketPercentage`}
              title={`Percentage over Market Percentage`}
              tooltip={tooltip.royalties.splitRoyalties.percentMarketPercentage}
              {...percentageProps}
            />
          )}
          {!isFungible && (
            <FormInput
              name={`royalties.splitRoyalties[${index}].percentMarketFixed`}
              title={`Percentage over Market Fixed`}
              tooltip={tooltip.royalties.splitRoyalties.percentMarketFixed}
              {...percentageProps}
            />
          )}
          <FormInput
            name={`royalties.splitRoyalties[${index}].percentITOPercentage`}
            title={`Percentage over ITO Percentage`}
            tooltip={tooltip.royalties.splitRoyalties.percentItoPercentage}
            {...percentageProps}
          />
          <FormInput
            name={`royalties.splitRoyalties[${index}].percentITOFixed`}
            title={`Percentage over ITO Fixed`}
            tooltip={tooltip.royalties.splitRoyalties.percentItoFixed}
            {...percentageProps}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add
      </ButtonContainer>
    </FormSection>
  );
};

interface IStakingSectionProps {
  assetTrigger?: boolean;
  isFPR?: boolean;
}

export const StakingSection: React.FC<
  PropsWithChildren<IStakingSectionProps>
> = ({ assetTrigger = false, isFPR: isFPRProp }) => {
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
        <span>Staking</span>
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
          title="Interest Type"
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
        title="Minimum Epochs to Claim"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToClaim}
      />
      <FormInput
        name="staking.minEpochsToUnstake"
        title="Minimum Epochs to Unstake"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToUnstake}
      />
      <FormInput
        name="staking.minEpochsToWithdraw"
        title="Minimum Epochs to Withdraw"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToWithdraw}
      />
    </FormSection>
  );
};

export const RolesSection: React.FC<PropsWithChildren> = () => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  const network = getNetwork();

  return (
    <FormSection>
      <SectionTitle>
        <span>Roles</span>
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
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
            Role {index + 1}
          </SectionTitle>
          <FormInput
            name={`roles[${index}].address`}
            title={`Address`}
            span={2}
            tooltip={tooltip.roles.address}
          />
          <FormInput
            name={`roles[${index}].hasRoleMint`}
            title={`Has Role Mint`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleMint}
          />
          <FormInput
            name={`roles[${index}].hasRoleSetITOPrices`}
            title={`Has Role Set ITO Prices`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleSetITOPrices}
          />
          <FormInput
            name={`role.hasRoleDeposit`}
            title={`Has Role Deposit`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleDeposit}
          />
          {network !== 'Mainnet' && (
            <FormInput
              name={`role.hasRoleTransfer`}
              title={`Has Role Transfer`}
              type="checkbox"
              toggleOptions={['No', 'Yes']}
              tooltip={tooltip.roles.hasRoleTransfer}
            />
          )}
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add Role
      </ButtonContainer>
    </FormSection>
  );
};

const PropertiesSection: React.FC<PropsWithChildren> = () => {
  return (
    <FormSection>
      <SectionTitle>
        <span>Properties</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.properties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>

      <FormInput
        name="properties.canFreeze"
        title="Freeze"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canFreeze}
      />
      <FormInput
        name="properties.canWipe"
        title="Wipe"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={false}
        tooltip={tooltip.properties.canWipe}
      />
      <FormInput
        name="properties.canPause"
        title="Pause"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canPause}
      />
      <FormInput
        name="properties.canMint"
        title="Mint"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canMint}
      />
      <FormInput
        name="properties.canBurn"
        title="Burn"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canBurn}
      />
      <FormInput
        name="properties.canChangeOwner"
        title="Change Owner"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canChangeOwner}
      />
      <FormInput
        name="properties.canAddRoles"
        title="Add Roles"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canAddRoles}
      />
    </FormSection>
  );
};

export default CreateAsset;
