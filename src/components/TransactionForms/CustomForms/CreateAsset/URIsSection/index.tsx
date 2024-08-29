import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { ButtonContainer } from '../../../styles';
import { removeWrapper } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';

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
