import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ABI, ABIStruct, ABITypeMap } from '@/types/contracts';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../FormInput/styles';
import { NamedKDASelect } from '../KDASelect/Named';
import {
  ButtonContainer,
  FormBody,
  FormSection,
  SectionTitle,
  SelectContainer,
} from '../styles';
import {
  encodeBigNumber,
  encodeLengthPlusData,
  removeWrapper,
  twosComplement,
} from './utils';
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
    value: string | number | any[] | Record<string, any>;
    type: 'string' | 'number' | 'array' | string;
    raw_type: string;
  }[];
  callValue: {
    [coin: string]: number;
  };
};

interface ABIMap {
  functions?: ABIFunctionMap;
  construct: ABIFunction;
  structs?: Record<string, ABIStruct>;
}

interface ABIFunctionMap {
  [functionName: string]: ABIFunction;
}

type ABIFunction = {
  allowedAssets?: string[];
  arguments: ABIFunctionArguments;
};

interface ABIFunctionArguments {
  [argumentName: string]: {
    type: string;
    raw_type: string;
    required: boolean;
  };
}

const bitValuesBytes0_1 = {
  payable: 2,
  payableBySC: 4,
};

const bitValuesBytes2_3 = {
  upgradable: 1,
  readable: 4,
};

const toggleOptions: [string, string] = ['False', 'True'];

const parseABIValue = (value: any, type: string) => {
  switch (type) {
    case 'u64':
    case 'i64':
      if (value < 0) {
        return twosComplement(value, 64);
      }
      const parsedValue = value.toString(16).padStart(16, '0');
      return parsedValue;
    case 'u32':
    case 'i32':
    case 'usize':
    case 'isize':
      if (value < 0) {
        return twosComplement(value, 32);
      }
      return value.toString(16).padStart(8, '0');
    case 'u16':
    case 'i16':
      if (value < 0) {
        return twosComplement(value, 16);
      }
      return value.toString(16).padStart(4, '0');
    case 'u8':
    case 'i8':
      if (value < 0) {
        return twosComplement(value, 8);
      }
      return value.toString(16).padStart(2, '0');
    case 'BigUint':
    case 'BigInt':
      return encodeBigNumber(value);
    case 'bool':
      return value ? '01' : '00';
    case 'ManagedBuffer':
    case 'BoxedBytes':
    case '&[u8]':
    case 'Vec<u8>':
    case 'String':
    case '&str':
    case 'bytes':
    case 'TokenIdentifier':
      return encodeLengthPlusData(value);
    default:
      return value;
  }
};
const parseFunctionArguments = (
  data: FormData,
  setMetadata: any,
  abi: ABIMap | null,
  scType: number,
  metadata: string,
) => {
  const { arguments: args } = data;

  const { function: func } = data;

  const parsedArgs = (args || []).map(value => {
    const { value: argValue, type, raw_type } = value;

    if (typeof argValue === 'number' && isNaN(argValue)) {
      return '';
    }
    if (argValue === null || argValue === undefined) {
      return '';
    }

    if (type === 'object' && abi !== null) {
      let argument = {};
      try {
        argument = JSON.parse(argValue as string);
      } catch (error) {
        return '';
      }
      const struct = abi.structs?.[raw_type];
      if (struct && argument !== null) {
        const structFields: string[] = Object.entries(struct?.fields || []).map(
          ([key, v]) => {
            const objectValue = argument[v.name];
            const objectType = v.type;
            const parsedValue = parseABIValue(objectValue, objectType);
            return parsedValue;
          },
        );

        return structFields.join('');
      }
    }

    if (typeof argValue === 'string') {
      return Buffer.from(argValue).toString('hex');
    } else if (typeof argValue === 'number') {
      const parsedNumber = argValue.toString(16);
      if (parsedNumber.length % 2 !== 0) {
        return `0${parsedNumber}`;
      }
      return parsedNumber;
    } else if (typeof argValue === 'boolean') {
      return argValue ? '01' : '00';
    }
  });

  if (scType === 1) {
    let parsedData = metadata.split('@').slice(0, 3).join('@');

    if (parsedArgs.length > 0) {
      parsedData += `@${parsedArgs.join('@')}`;
      setMetadata(parsedData);
    }
    return;
  } else {
    const parsedData = `${func}@${parsedArgs.join('@')}`;

    delete data.arguments;
    delete data.function;

    setMetadata(parsedData);
    return;
  }
};

const mapType = (abiType: string) => {
  const isOptional = abiType.toLowerCase().startsWith('option');
  let cleanType = isOptional ? (abiType.match(/<(.*)>/) || [])[1] : abiType;

  cleanType = cleanType.toLowerCase();

  cleanType = cleanType.split('<')[0];

  for (const [key, values] of Object.entries(ABITypeMap)) {
    if (values.includes(cleanType)) {
      return key;
    }
  }

  return 'object';
};

const parseAbiStructs = (abi: string): Record<string, ABIStruct> => {
  const parsedAbi: ABI = JSON.parse(abi);

  const result = {} as Record<string, ABIStruct>;
  Object.keys(parsedAbi?.types).forEach(typeItem => {
    if (parsedAbi?.types[typeItem].type !== 'struct') return;

    const struct = typeItem;
    const structFields = parsedAbi?.types[typeItem];

    result[struct] = structFields;
  });

  return result;
};
const parseAbiFunctions = (
  abi: string,
): { functions: ABIFunctionMap; constructor: ABIFunction } => {
  const parsedAbi: ABI = JSON.parse(abi);

  const functions: ABIFunctionMap = {};
  parsedAbi.endpoints.forEach(endpoint => {
    if (endpoint.mutability === 'readonly') return;

    const funcName = endpoint.name;
    const inputs = endpoint.inputs.reduce((acc, input) => {
      const isOptional = input.type.toLowerCase().startsWith('option');
      acc[input.name] = {
        type: mapType(input.type),
        required: !isOptional,
        raw_type: input.type,
      };
      return acc;
    }, {} as ABIFunctionArguments);

    functions[funcName] = { arguments: {} };

    functions[funcName].arguments = inputs;
    functions[funcName].allowedAssets = endpoint.payableInTokens;
  });

  let constructor: ABIFunction = {
    arguments: {},
  };

  if (parsedAbi.constructor.inputs.length > 0) {
    constructor = {
      arguments: parsedAbi.constructor.inputs.reduce((acc, input) => {
        const isOptional = input.type.toLowerCase().startsWith('option');
        acc[input.name] = {
          type: mapType(input.type),
          required: !isOptional,
          raw_type: input.type,
        };
        return acc;
      }, {} as ABIFunctionArguments),
      allowedAssets: parsedAbi.constructor.payableInTokens,
    };
  }

  return { functions, constructor };
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
  const { handleSubmit, watch, setValue, getValues } =
    useFormContext<FormData>();
  const { metadata, setMetadata, queue } = useMulticontract();
  const { walletAddress } = useExtension();

  const [fileData, setFileData] = React.useState<string>('');
  const [abi, setAbi] = React.useState<ABIMap | null>(null);
  const [propertiesString, setPropertiesString] = React.useState<string>(
    (0x506).toString(2),
  );

  const scType = watch('scType');

  const functions = abi?.functions || {};

  const func: ABIFunction =
    scType === 1
      ? abi?.constructor || {
          arguments: {},
        }
      : functions?.[watch('function') || ''];

  const hasFunctions = Object.keys(functions).length > 0;

  const onSubmit = async (dataRef: FormData) => {
    const data = JSON.parse(JSON.stringify(dataRef));

    parseFunctionArguments(data, setMetadata, abi, scType, metadata);
    parseCallValue(data);
    await handleFormSubmit(data);
  };

  useEffect(() => {
    if (scType === 1) {
      setValue('address', walletAddress);
    } else {
      setValue('address', '');
    }
  }, [scType]);

  const handleImportAbi = async (e: any) => {
    const abi = await (e.target.files[0] as File).text();

    const data = {} as ABIMap;
    const { functions, constructor } = parseAbiFunctions(abi);

    if (Object.keys(functions).length > 0) {
      data['functions'] = functions;
    }

    data['construct'] = constructor;

    const structs = parseAbiStructs(abi);
    if (Object.keys(structs).length > 0) {
      data['structs'] = structs;
    }

    try {
      setAbi(data);
    } catch (error) {
      toast.error('Invalid ABI file');
      console.error(error);
      e.target.value = '';
      return;
    }
  };

  const handleInputChange = (e: React.FocusEvent<HTMLInputElement>) => {
    parseFunctionArguments(getValues(), setMetadata, abi, scType, metadata);
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
          disableCustom
        />

        <FormInput
          name="address"
          dynamicInitialValue={scType === 0 ? '' : walletAddress}
          span={2}
          title={scType === 1 ? 'Contract Address' : 'Contract Owner Address'}
          tooltip={scType === 1 ? tooltip.address : tooltip.deployAddress}
          required
        />

        {scType === 1 && (
          <FormInput
            title="Contract Binary"
            type="file"
            accept=".wasm"
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
        {scType === 0 ||
          (scType === 1 && fileData.length > 0 && (
            <FormInput
              title="Contract ABI"
              type="file"
              accept=".json"
              span={2}
              tooltip={tooltip.abi}
              onChange={handleImportAbi}
              onClick={(e: any) => {
                setAbi(null);
                e.target.value = '';
              }}
            />
          ))}
        {scType === 0 && (
          <FormInput
            name="function"
            title="Function"
            type={hasFunctions ? 'dropdown' : 'text'}
            options={
              hasFunctions
                ? Object.keys(functions).map(func => ({
                    label: func,
                    value: func,
                  }))
                : []
            }
            span={2}
            tooltip={tooltip.arguments.function}
            required
          />
        )}
        {scType === 0 ||
          (scType === 1 && fileData.length > 0 && (
            <ArgumentsSection
              arguments={
                scType === 1 ? abi?.construct?.arguments || {} : func?.arguments
              }
              handleInputChange={handleInputChange}
            />
          ))}
        {(scType === 0 && hasFunctions && func?.allowedAssets) ||
          !hasFunctions ||
          (scType === 1 && fileData.length > 0 && (
            <CallValueSection
              allowedAssets={
                scType === 1
                  ? abi?.construct?.allowedAssets
                  : func?.allowedAssets
              }
            />
          ))}
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

interface IArguments {
  arguments?: ABIFunctionArguments;
  handleInputChange: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const ArgumentsSection: React.FC<IArguments> = ({
  arguments: args,
  handleInputChange,
}) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arguments',
  });

  useEffect(() => {
    if (args) {
      fields.forEach(_ => {
        remove();
      });

      append(
        Object.keys(args).map(key => ({
          name: key,
          type: args[key].type,
          raw_type: args[key].raw_type,
          value: args[key].type === 'number' ? NaN : '',
          required: args[key].required,
        })),
      );
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
              { label: 'Boolean', value: 'checkbox' },
              // { label: 'Array', value: 'array' }, // Can't parse without ABI
              // { label: 'Object', value: 'object' },
            ]}
            placeholder="Add Argument"
          />
        </SelectContainer>
      )}
    </FormSection>
  );
};

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

export default SmartContract;
