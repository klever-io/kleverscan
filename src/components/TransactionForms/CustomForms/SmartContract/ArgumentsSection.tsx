import { ABIStruct, RUST_TYPES_WITH_OPTION } from '@/types/contracts';
import { utils } from '@klever/sdk-web';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { ABIFunctionArguments } from '.';
import FormInput from '../../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../FormInput/styles';
import { FormSection, SectionTitle, SelectContainer } from '../../styles';
import { removeWrapper } from '../utils';
import { smartContractTooltips as tooltip } from '../utils/tooltips';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

interface IArguments {
  arguments?: ABIFunctionArguments;
  structs?: Record<string, ABIStruct>;
  handleInputChange: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const getInitialValue = (
  rawType: string,
  structs?: Record<string, ABIStruct>,
  inner = false,
) => {
  const type = utils.getJSType(rawType);
  if (type === 'number') {
    return inner ? 0 : NaN;
  }
  if (type === 'checkbox') {
    return false;
  }
  if (type === 'array') {
    return [];
  }

  if (type === 'object') {
    if (!structs) {
      return '';
    }
    const struct = structs[rawType];
    const initialObjectValue = {};

    Object.entries(struct?.fields || []).forEach(([key, v]) => {
      const initialValue = getInitialValue(v.type, structs, true);
      initialObjectValue[v.name] = initialValue;
    });

    return JSON.stringify(initialObjectValue, null, 2);
  }
  return '';
};

export const ArgumentsSection: React.FC<IArguments> = ({
  arguments: args,
  structs,
  handleInputChange,
}) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'arguments',
  });

  useEffect(() => {
    if (args) {
      replace(
        Object.keys(args).map(key => ({
          name: key,
          type: args[key].type,
          raw_type: args[key].raw_type,
          value: getInitialValue(args[key].raw_type, structs),
          required: args[key].required,
        })),
      );
      handleInputChange({} as any);
    }
  }, [args]);

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Arguments</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.arguments.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field: any, index) => {
        let placeholder = '';

        switch (field.type) {
          case 'text':
            placeholder = 'E.g. some text';
            break;
          case 'number':
            placeholder = 'E.g. 01';
            break;
          case 'array':
            placeholder = 'E.g. ["value1", "value2"]';
            break;
          case 'object':
            break;
        }

        return (
          <FormSection key={field.id} inner>
            <SectionTitle>
              <HiTrash
                onClick={() =>
                  removeWrapper({ index, remove, getValues, router })
                }
              />
              Argument {index + 1}
            </SectionTitle>
            <FormInput
              name={`arguments[${index}].value`}
              title={
                field.name
                  ? `${field.name} (${field.type})`
                  : `Value ${index + 1} (${field.type})`
              }
              dynamicInitialValue={field.value}
              customOnChange={handleInputChange}
              type={field.type}
              placeholder={placeholder}
              tooltip={tooltip.arguments.value}
              required={field.required}
              toggleOptions={['False', 'True']}
              canBeNaN
            />
          </FormSection>
        );
      })}
      {args === undefined && (
        <SelectContainer>
          <ReactSelect
            classNamePrefix="react-select"
            onInputChange={(newValue: any) => {
              append({
                type: utils.getJSType(newValue.value),
                raw_type: newValue.value,
                value: getInitialValue(newValue.value, structs),
              });
            }}
            value={null}
            options={RUST_TYPES_WITH_OPTION.map(type => ({
              label: `${type} (${utils.getJSType(type)})`,
              value: type,
            }))}
            placeholder="Add Argument"
          />
        </SelectContainer>
      )}
    </FormSection>
  );
};
