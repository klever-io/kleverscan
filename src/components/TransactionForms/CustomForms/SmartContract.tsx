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

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

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

const bitValuesBytes0_1 = {
  payable: 2,
  payableBySC: 4,
};

const bitValuesBytes2_3 = {
  upgradable: 1,
  readable: 4,
};

const toggleOptions: [string, string] = ['False', 'True'];

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

  const [fileData, setFileData] = React.useState<string>('');
  const [propertiesString, setPropertiesString] = React.useState<string>(
    (0x506).toString(2),
  );

  const scType = watch('scType');

  const onSubmit = async (dataRef: FormData) => {
    const data = JSON.parse(JSON.stringify(dataRef));

    if (scType === 0) {
      parseFunctionArguments(data, setMetadata);
    }
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

        <FormInput
          name="address"
          span={2}
          title={scType === 0 ? 'Contract Address' : 'Contract Owner Address'}
          tooltip={scType === 0 ? tooltip.address : tooltip.deployAddress}
          required
        />

        {scType === 1 && (
          <FormInput
            title="Contract Binary"
            type="file"
            onChange={(e: any) => {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                const fileBytes = e.target.result;

                const hex = Buffer.from(fileBytes).toString('hex');

                const propertiesHex = parseInt(propertiesString, 2)
                  .toString(16)
                  .padStart(4, '0');

                setMetadata(hex + '@0500@' + propertiesHex);
                setFileData(hex);
              };
              reader.readAsArrayBuffer(e.target.files[0]);
            }}
            onClick={(e: any) => {
              e.target.value = '';
            }}
            required
            span={2}
            tooltip={tooltip.data}
          />
        )}
        {scType === 1 && fileData.length > 0 && (
          <PropertiesSection
            propertiesString={propertiesString}
            setPropertiesString={setPropertiesString}
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

interface IProperties {
  propertiesString: string;
  setPropertiesString: (propertiesString: string) => void;
}

export const PropertiesSection: React.FC<IProperties> = ({
  propertiesString,
  setPropertiesString,
}) => {
  const { metadata, setMetadata } = useMulticontract();

  const bitsOfByte0_1 = propertiesString
    .split('')
    .reverse()
    .join('')
    .slice(0, 8);
  const bitsOfByte2_3 = propertiesString
    .split('')
    .reverse()
    .join('')
    .slice(8, 16);

  const isUpgradable =
    bitsOfByte2_3[Math.log2(bitValuesBytes2_3.upgradable)] === '1';
  const isReadable =
    bitsOfByte2_3[Math.log2(bitValuesBytes2_3.readable)] === '1';
  const isPayable = bitsOfByte0_1[Math.log2(bitValuesBytes0_1.payable)] === '1';
  const isPayableBySC =
    bitsOfByte0_1[Math.log2(bitValuesBytes0_1.payableBySC)] === '1';

  const togglePropery = (property: string) => {
    const newProperties = propertiesString.split('').reverse();

    const byte = property === 'upgradable' || property === 'readable' ? 2 : 0;

    if (byte === 0) {
      const bit = Math.log2(bitValuesBytes0_1[property]);
      newProperties[bit] = newProperties[bit] === '0' ? '1' : '0';
    }

    if (byte === 2) {
      const bit = Math.log2(bitValuesBytes2_3[property]) + 8;
      newProperties[bit] = newProperties[bit] === '0' ? '1' : '0';
    }

    newProperties.reverse();

    const newPropertiesHex = parseInt(newProperties.join(''), 2)
      .toString(16)
      .padStart(4, '0');

    const metadataProperties = metadata.split('@')[2] || '0506';
    const newMetadataProperties =
      metadata.split('@').slice(0, 2).join('@') + '@' + newPropertiesHex;

    setMetadata(newMetadataProperties);

    setPropertiesString(newProperties.join(''));
  };

  return (
    <FormSection inner>
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
        title="Upgradable"
        type="checkbox"
        checked={isUpgradable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.upgradable}
        onChange={() => togglePropery('upgradable')}
        required
      />
      <FormInput
        title="Readable"
        type="checkbox"
        checked={isReadable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.readable}
        onChange={() => togglePropery('readable')}
        required
      />
      <FormInput
        title="Payable"
        type="checkbox"
        checked={isPayable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.payable}
        onChange={() => togglePropery('payable')}
        required
      />
      <FormInput
        title="PayableBySC"
        type="checkbox"
        checked={isPayableBySC}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.payableBySC}
        onChange={() => togglePropery('payableBySC')}
        required
      />
    </FormSection>
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
