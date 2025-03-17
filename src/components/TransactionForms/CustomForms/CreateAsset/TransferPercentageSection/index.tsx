import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { ButtonContainer } from '../../../styles';
import { percentageProps, removeWrapper } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';

interface IPrecisionProps {
  precision: number;
}

export const TransferPercentageSection: React.FC<
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
