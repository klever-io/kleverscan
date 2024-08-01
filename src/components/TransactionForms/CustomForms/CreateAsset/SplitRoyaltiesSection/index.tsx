import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { ISectionProps } from '..';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { ButtonContainer } from '../../../styles';
import { percentageProps, removeWrapper } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';

export const SplitRoyaltiesSection: React.FC<PropsWithChildren<
  ISectionProps
>> = ({ isFungible }) => {
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
            tooltip={tooltip.royalties.splitRoyalties.percentITOPercentage}
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
