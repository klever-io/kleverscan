import { useMulticontract } from '@/contexts/contract/multicontract';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
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
  SelectContainer,
} from '../styles';
import { removeWrapper } from './utils';
import { smartContractTooltips as tooltip } from './utils/tooltips';

type FormData = {
  scType: number;
  address: string;
  function?: string;
  arguments?: {
    type: 'string' | 'number' | 'array' | 'object';
    value: string | number | any[] | Record<string, any>;
  }[];
  callValue: {
    [coin: string]: number;
  };
};

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

const parseFunctionArguments = (data: FormData, setMetadata: any) => {
  const { arguments: args } = data;

  const { function: func } = data;

  const parsedArgs = (args || []).map(value => {
    const { value: argValue } = value;

    return typeof argValue === 'string'
      ? Buffer.from(argValue).toString('hex')
      : argValue.toString(16);
  });
  const parsedData = `${func}@${parsedArgs.join('@')}`;

  delete data.arguments;
  delete data.function;

  setMetadata(parsedData);
};

const parseCallValue = (data: FormData) => {
  const { callValue } = data;
  const newCallValue = {};

  ((callValue as unknown as any[]) || []).forEach(value => {
    const { label, amount } = value;
    newCallValue[label] = amount;
  });

  data.callValue = newCallValue;
};

const SmartContract: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const { metadata, setMetadata, queue } = useMulticontract();

  const scType = watch('scType');

  const onSubmit = async (dataRef: FormData) => {
    const data = JSON.parse(JSON.stringify(dataRef));

    parseFunctionArguments(data, setMetadata);
    parseCallValue(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="scType"
          title="Operation"
          type="dropdown"
          tooltip="Deploy a new contract or call an existing contract."
          options={[
            { label: 'Deploy', value: 1 },
            { label: 'Invoke', value: 0 },
          ]}
          required
        />

        {scType === 1 && (
          <FormInput
            title="Data"
            type="textarea"
            value={metadata}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMetadata(e.target.value)
            }
            required
            span={2}
            tooltip={tooltip.data}
          />
        )}

        {scType === 0 && (
          <FormInput
            name="address"
            span={2}
            title="Contract Address"
            tooltip="The contract address to call."
            required
          />
        )}
        {scType === 0 && (
          <FormInput
            name="function"
            title="Function"
            span={2}
            tooltip={tooltip.arguments.function}
            required
          />
        )}
        {scType === 0 && <ArgumentsSection />}
        {scType === 0 && <CallValueSection />}
      </FormSection>
    </FormBody>
  );
};

export const ArgumentsSection: React.FC = () => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arguments',
  });

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
              title={`Value ${index + 1} (${field.type})`}
              type={field.type}
              placeholder={placeholder}
              tooltip={tooltip.arguments.value}
              required
            />
          </FormSection>
        );
      })}
      <SelectContainer>
        <ReactSelect
          classNamePrefix="react-select"
          onChange={(newValue: any) => {
            append({
              type: newValue.value,
              value: '',
            });
          }}
          value={null}
          options={[
            { label: 'Text', value: 'text' },
            { label: 'Number', value: 'number' },
            { label: 'Array', value: 'array' },
            { label: 'Object', value: 'object' },
          ]}
          placeholder="Add Parameter"
        />
      </SelectContainer>
    </FormSection>
  );
};

export const CallValueSection: React.FC = () => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'callValue',
  });

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
            Parameter {index + 1}
          </SectionTitle>
          <FormInput
            name={`callValue[${index}].label`}
            title={`Asset Id`}
            tooltip={tooltip.callValue.label}
            required
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
        Add Parameter
      </ButtonContainer>
    </FormSection>
  );
};

export default SmartContract;
