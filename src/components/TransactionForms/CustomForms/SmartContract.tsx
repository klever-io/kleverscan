import { useMulticontract } from '@/contexts/contract/multicontract';
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
} from '../styles';
import { smartContractTooltips as tooltip } from './utils/tooltips';

type FormData = {
  scType: number;
  address: string;
  function?: string;
  arguments?: {
    value: string | number;
  }[];
  callValue: {
    [coin: string]: number;
  };
};

const parseFunctionArguments = (data: FormData, setMetadata: any) => {
  const { arguments: args } = data;

  let { function: func } = data;
  func = Buffer.from(func || '').toString('hex');

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
          name="address"
          span={2}
          title="Contract Address"
          tooltip="The contract address to call."
          required
        />

        <FormInput
          name="scType"
          title="Operation"
          type="dropdown"
          tooltip="Deploy a new contract or call an existing contract."
          options={[
            { label: 'Deploy', value: 0 },
            { label: 'Invoke', value: 1 },
          ]}
          required
        />

        {scType === 0 && (
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
        {scType === 1 && <ArgumentsSection />}
        {scType === 1 && <CallValueSection />}
      </FormSection>
    </FormBody>
  );
};

export const ArgumentsSection: React.FC = () => {
  const { control } = useFormContext();
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
      <FormInput
        name="function"
        title="Function"
        span={2}
        tooltip={tooltip.arguments.function}
        required
      />
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            Parameter {index + 1}
          </SectionTitle>
          <FormInput
            name={`arguments[${index}].value`}
            title={`Value`}
            type="custom"
            tooltip={tooltip.arguments.value}
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

export const CallValueSection: React.FC = () => {
  const { control } = useFormContext();
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
            <HiTrash onClick={() => remove(index)} />
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
