import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import FormInput from '../../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../FormInput/styles';
import { NamedKDASelect } from '../../KDASelect/Named';
import { ButtonContainer, FormSection, SectionTitle } from '../../styles';
import { removeWrapper } from '../utils';
import { smartContractTooltips as tooltip } from '../utils/tooltips';

interface IAllowedAssets {
  allowedAssets?: string[];
}

export const CallValueSection: React.FC<IAllowedAssets> = ({
  allowedAssets,
}) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'callValue',
  });

  useEffect(() => {
    if (allowedAssets) {
      fields.forEach(_ => {
        remove();
      });

      append({});
    }
  }, [allowedAssets]);

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Tokens to Send</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.callValue.title}</span>
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
            Token {index + 1}
          </SectionTitle>

          <NamedKDASelect
            name={`callValue[${index}].label`}
            allowedAssets={allowedAssets}
          />
          <FormInput
            name={`callValue[${index}].amount`}
            title={`Amount`}
            type="number"
            tooltip={tooltip.callValue.value}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add Token
      </ButtonContainer>
    </FormSection>
  );
};
