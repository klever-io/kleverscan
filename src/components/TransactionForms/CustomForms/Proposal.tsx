import { getParamsList } from '@/services/requests/proposals/proposals';
import { IParamList } from '@/types';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { useQuery } from 'react-query';
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

type FormData = {
  description: string;
  epochsDuration: number;
  parameters: { [key: number]: string };
};

const parseProposal = (data: any): void => {
  if (data.parameters === undefined) {
    return;
  }

  const parametersReference = data.parameters;

  delete data.parameters;

  if (parametersReference.length === 0) return;

  const parameters: {
    [key: string]: string;
  } = {};

  parametersReference.forEach((item: any) => {
    const label = item.label;
    parameters[label] = item.value;
  });

  data.parameters = parameters;
};

const Proposal: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit } = useFormContext<FormData>();

  const { data: paramsList } = useQuery('paramsList', getParamsList);

  const onSubmit = async (data: FormData) => {
    parseProposal(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="description"
          title="Description"
          type="textarea"
          span={2}
          tooltip="Outline of the proposal"
        />
        <FormInput
          name="epochsDuration"
          title="Epochs Duration"
          type="number"
          span={2}
          max={paramsList?.[34].currentValue || 40}
          tooltip={`Number of epochs the proposal will be active, each epoch lasts 6 hours. Maximum ${
            paramsList?.[34].currentValue || 40
          } epochs`}
          required
        />
      </FormSection>
      <ParametersSection paramsList={paramsList} />
    </FormBody>
  );
};

interface IParametersProps {
  paramsList?: IParamList[];
}

export const ParametersSection: React.FC<IParametersProps> = ({
  paramsList = [],
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parameters',
  });
  return (
    <FormSection>
      <SectionTitle>
        <span>Parameters</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>
              Which network parameters the proposal is aiming to change
            </span>
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
            name={`parameters[${index}].label`}
            title={`Parameter`}
            type="dropdown"
            options={paramsList}
          />
          <FormInput
            name={`parameters[${index}].value`}
            title={`Proposed Value`}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add Parameter
      </ButtonContainer>
    </FormSection>
  );
};

export default Proposal;
