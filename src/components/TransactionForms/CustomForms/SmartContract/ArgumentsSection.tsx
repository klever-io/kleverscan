import { ABIType, RUST_TYPES_WITH_OPTION } from '@/types/contracts';
import { utils } from '@klever/sdk-web';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { ABIFunctionArguments } from '.';
import FormInput from '../../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../FormInput/styles';
import {
  ButtonContainer,
  FormSection,
  SectionTitle,
  SelectContainer,
} from '../../styles';
import { removeWrapper } from '../utils';
import { smartContractTooltips as tooltip } from '../utils/tooltips';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

interface IArguments {
  arguments?: ABIFunctionArguments;
  types?: Record<string, ABIType>;
  handleInputChange: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const getInitialValue = (
  rawType: string,
  types?: Record<string, ABIType>,
  inner = false,
) => {
  const type = utils.getJSType(rawType);
  if (type === 'number') {
    return inner ? 0 : NaN;
  }
  if (type === 'checkbox') {
    return false;
  }
  if (type === 'array' || type === 'variadic') {
    return [];
  }

  if (type === 'object') {
    if (!types) {
      return '';
    }
    const struct = types[rawType];
    const initialObjectValue: Record<string, any> = {};

    Object.entries(struct?.fields || []).forEach(([key, v]) => {
      const initialValue = getInitialValue(v.type, types, true);
      initialObjectValue[v.name] = initialValue;
    });

    return JSON.stringify(initialObjectValue, null, 2);
  }
  return '';
};

export const ArgumentsSection: React.FC<PropsWithChildren<IArguments>> = ({
  arguments: args,
  types,
  handleInputChange,
}) => {
  const [isVariadic, setIsVariadic] = useState(false);
  const [argument, setArgument] = useState({});
  const { control, getValues, watch } = useFormContext();
  const router = useRouter();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'arguments',
  });

  useEffect(() => {
    if (args) {
      const replaceArguments = Object.keys(args).map(key => {
        const rawType = args[key].raw_type;
        const type = utils.getJSType(rawType || '');
        const arg = {
          name: key,
          type: args[key].type,
          raw_type: args[key].raw_type,
          value: getInitialValue(args[key].raw_type, types),
          required: type !== 'checkbox' && args[key].required,
          options: types?.[args[key].raw_type]?.variants?.map(variant => {
            return {
              label: variant.name,
              value: variant.discriminant,
            };
          }),
        };
        if (type === 'variadic') {
          setIsVariadic(true);
          setArgument(arg);
        }
        return arg;
      });
      replace(replaceArguments);
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
          case 'variadic':
          case 'array':
            placeholder = 'E.g. ["value1", "value2"]';
            break;
          case 'object':
            break;
        }

        const inputType = field.type === 'enum' ? 'dropdown' : field.type;

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
              type={inputType}
              placeholder={placeholder}
              tooltip={tooltip.arguments.value}
              required={field.required}
              toggleOptions={['False', 'True']}
              options={field?.options}
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
                type: utils.getJSType(newValue?.value || ''),
                raw_type: newValue?.value || '',
                value: getInitialValue(newValue?.value || '', types),
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
      {isVariadic && (
        <ButtonContainer type="button" onClick={() => append(argument || {})}>
          Add Argument
        </ButtonContainer>
      )}
    </FormSection>
  );
};
