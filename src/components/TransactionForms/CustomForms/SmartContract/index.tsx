import { useMulticontract } from '@/contexts/contract/multicontract';
import { ABI, ABIType } from '@/types/contracts';
import { useDidUpdateEffect } from '@/utils/hooks';
import { getNetwork } from '@/utils/networkFunctions';
import { encodeByType, bytesToHex, getJSType } from '@klever/connect-contracts';
import type { ContractABI } from '@klever/connect-contracts';
import React, { PropsWithChildren, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../../FormInput';
import { FormBody, FormSection } from '../../styles';
import { IContractProps } from '../index';
import { smartContractTooltips as tooltip } from '../utils/tooltips';
import { ArgumentsSection } from './ArgumentsSection';
import { CallValueSection } from './CallValueSection';
import { PropertiesSection } from './PropertiesSection';

const emptyABI = { types: {} } as ContractABI;

const encodeABIValue = (
  value: unknown,
  type: string,
  isNested = true,
  abi: ContractABI = emptyABI,
): string => {
  try {
    return bytesToHex(encodeByType(value, type, abi, isNested));
  } catch {
    return '';
  }
};

const encodeLengthPlusData = (
  value: string | unknown[],
  innerType: string,
  isNested = true,
  abi: ContractABI = emptyABI,
): string => {
  if (typeof value !== 'string') {
    const data = value
      .map(v => encodeABIValue(v, innerType, true, abi))
      .join('');
    if (!isNested) return data;
    const length = value.length.toString(16).padStart(8, '0');
    return length + data;
  } else {
    const byteArr = new TextEncoder().encode(value);
    const dataHex = bytesToHex(byteArr);
    if (!isNested) return dataHex;
    const length = byteArr.length.toString(16).padStart(8, '0');
    return length + dataHex;
  }
};

interface Argument {
  value: string | number | any[] | Record<string, any>;
  type: 'string' | 'number' | 'array' | string;
  raw_type: string;
  required: boolean;
}

type FormData = {
  scType: number;
  address: string;
  function?: string;
  arguments?: Argument[];
  callValue: {
    [coin: string]: number;
  };
};

export interface ABIMap {
  functions?: ABIFunctionMap;
  construct?: ABIFunction;
  types?: Record<string, ABIType>;
}

interface ABIFunctionMap {
  [functionName: string]: ABIFunction;
}

type ABIFunction = {
  allowedAssets?: string[];
  arguments: ABIFunctionArguments;
};

export interface ABIFunctionArguments {
  [argumentName: string]: {
    type: string;
    raw_type: string;
    required: boolean;
  };
}

const parseFunctionArguments = (
  data: FormData,
  setMetadata: any,
  abi: ABIMap | null,
  scType: number | string,
  metadata: string,
) => {
  const { arguments: args } = data;

  const { function: functionName } = data;

  delete data.arguments;
  delete data.function;

  const parsedArgsString = getParsedArgumentsString(args, abi);
  if (scType === 1) {
    // Deploy
    if (metadata?.length === 0) {
      return;
    }

    let contractBinaryAndParams = metadata.split('@').slice(0, 3).join('@');

    if (parsedArgsString?.length > 0) {
      contractBinaryAndParams += `@${parsedArgsString}`;
    }

    setMetadata(contractBinaryAndParams);

    return;
  } else if (scType === 2) {
    // Upgrade
    if (metadata?.length === 0) {
      return;
    }

    let contractBinaryAndParams = metadata.split('@').slice(0, 3).join('@');

    contractBinaryAndParams = contractBinaryAndParams.startsWith(
      'upgradeContract@',
    )
      ? (contractBinaryAndParams = `${contractBinaryAndParams}`)
      : (contractBinaryAndParams = `upgradeContract@${contractBinaryAndParams}`);
    if (parsedArgsString?.length > 0) {
      contractBinaryAndParams += `@${parsedArgsString}`;
    }

    setMetadata(contractBinaryAndParams);
    return;
  } else {
    // Invoke
    if (parsedArgsString?.length === 0) {
      setMetadata(functionName);
      return;
    }
    const parsedData = `${functionName}@${parsedArgsString}`;

    delete data.arguments;
    delete data.function;

    setMetadata(parsedData);
    return;
  }
};

const parseAbiStructs = (abi: string): Record<string, ABIType> => {
  const parsedAbi: ABI = JSON.parse(abi);

  const result = {} as Record<string, ABIType>;
  Object.keys(parsedAbi?.types).forEach(typeItem => {
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
  const types: Record<string, ABIType> = parsedAbi.types || {};

  const functions: ABIFunctionMap = {};
  parsedAbi.endpoints.forEach(endpoint => {
    if (endpoint.mutability === 'readonly') return;

    const funcName = endpoint.name;
    const inputs = endpoint.inputs.reduce((acc, input) => {
      const isOptional = input.type.startsWith('Option');
      let type = getJSType(input.type);
      if (type === input.type) {
        type = types[input.type]?.type || 'object';
      }
      acc[input.name] = {
        type,
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

  if (parsedAbi.constructor.inputs?.length > 0) {
    constructor = {
      arguments: parsedAbi.constructor.inputs.reduce((acc, input) => {
        const isOptional = input.type.toLowerCase().startsWith('option');
        let type = getJSType(input.type);
        if (type === input.type) {
          type = types[input.type]?.type || 'object';
        }
        acc[input.name] = {
          type,
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
  const newCallValue: { [coin: string]: number } = {};

  ((callValue as unknown as any[]) || []).forEach(value => {
    const { label, amount } = value;
    newCallValue[label] = amount;
  });

  data.callValue = newCallValue;
};

const getParsedArgumentsString = (
  args: Argument[] | undefined,
  abi: ABIMap | null,
): string => {
  const parsedArgs = (args || []).map(value => {
    return parseArgument(value.value, value.raw_type, abi, value.type);
  });

  return parsedArgs.join('@');
};

export const parseArgument = (
  value: any,
  raw_type: string,
  abi: ABIMap | null,
  jsType?: string,
) => {
  let parsedValue = '';

  const required = !raw_type?.startsWith('Option');
  let type = jsType || getJSType(raw_type || '');
  if (type === 'struct') type = 'object';

  if (type === raw_type && abi?.types?.[raw_type]?.type === 'enum') {
    raw_type = 'u64';
  }

  if (typeof value === 'number' && isNaN(value)) {
    return '';
  }
  if (value === null || value === undefined) {
    return '';
  }

  const contractABI = abi
    ? ({ types: abi.types || {} } as ContractABI)
    : emptyABI;

  if (type === 'object' && abi !== null) {
    let argument: Record<string, any> = {};
    try {
      argument = JSON.parse(value as string);
    } catch (error) {
      return '';
    }
    const struct = abi.types?.[raw_type];
    if (struct && argument !== null) {
      const structFields: string[] = Object.entries(struct?.fields || []).map(
        ([key, v]) => {
          const objectValue = argument[v.name];
          const objectType = v.type;
          const parsedValue = encodeABIValue(
            objectValue,
            objectType,
            true,
            contractABI,
          );
          return parsedValue;
        },
      );
      parsedValue = structFields.join('');
    }
  } else if (type === 'array' && abi !== null) {
    let argument = [];
    try {
      argument = JSON.parse(value as string);
    } catch (error) {
      return '';
    }

    if (!Array.isArray(argument) || argument?.length === 0) {
      return '';
    }
    const isOptional = raw_type.toLowerCase().startsWith('option');
    const nonOptionalType = isOptional
      ? (raw_type.match(/<(.*)>/) || [])[1]
      : raw_type;
    const innerType = nonOptionalType.split('<')[1].split('>')[0];

    parsedValue = encodeLengthPlusData(
      argument,
      innerType,
      true,
      contractABI,
    ) as string;
  } else if (type === 'variadic' && abi !== null) {
    let argument = [];
    try {
      argument = JSON.parse(value as string);
    } catch (error) {
      return '';
    }

    if (!Array.isArray(argument) || argument?.length === 0) {
      return '';
    }
    parsedValue = encodeABIValue([argument], raw_type);
  } else {
    const valueType = required
      ? raw_type
      : (raw_type.match(/<(.*)>/) || [])[1] || raw_type;
    parsedValue = encodeABIValue(value, valueType, !required);
  }

  if (parsedValue === '') {
    return '';
  }

  if (!required) parsedValue = `01${parsedValue}`;

  return parsedValue;
};

const SmartContract: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch, getValues } = useFormContext<FormData>();
  const { metadata, setMetadata } = useMulticontract();

  const [fileData, setFileData] = React.useState<string>('');
  const [abi, setAbi] = React.useState<ABIMap | null>(null);
  const [propertiesString, setPropertiesString] = React.useState<string>(
    (0x506).toString(2),
  );
  const network = getNetwork();

  const scType: number | string = watch('scType') as number | string;

  useDidUpdateEffect(() => {
    setMetadata('');
  }, [scType]);

  const functions = useMemo(() => abi?.functions || undefined, [abi]);

  const func: ABIFunction | undefined =
    scType === 1
      ? abi?.construct || {
          arguments: {},
        }
      : scType === 2
        ? abi?.functions?.upgrade || {
            arguments: {},
          }
        : functions?.[watch('function') || ''];

  const hasFunctions = functions && Object.keys(functions)?.length > 0;

  const onSubmit = async (dataRef: FormData) => {
    const data = JSON.parse(JSON.stringify(dataRef));

    if (data.scType === 2) {
      data.scType = 0;
    }

    parseFunctionArguments(data, setMetadata, abi, scType, metadata);
    parseCallValue(data);
    await handleFormSubmit(data);
  };

  const handleImportAbi = async (e: any) => {
    const abi = await (e.target.files[0] as File).text();

    const data = {} as ABIMap;
    const { functions, constructor } = parseAbiFunctions(abi);

    if (Object.keys(functions)?.length > 0) {
      data['functions'] = functions;
    }

    data['construct'] = constructor;

    const types = parseAbiStructs(abi);
    if (Object.keys(types)?.length > 0) {
      data['types'] = types;
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

  const showAddressCondition = scType !== 1;
  const showAbiAndArgumentsCondition =
    scType === 0 || (scType !== 0 && fileData?.length > 0);

  const callValuesCondition =
    (scType === 0 && hasFunctions && func?.allowedAssets) ||
    !hasFunctions ||
    (scType !== 0 && fileData?.length > 0);

  const formInputProps: any = {
    name: 'function',
    title: 'Function',
    type: hasFunctions ? 'dropdown' : 'text',
    span: 2,
    tooltip: tooltip.arguments.function,
    required: true,
  };

  const hasSCType = scType !== undefined && scType !== '';

  if (hasFunctions)
    formInputProps['options'] =
      functions &&
      Object.keys(functions).map(func => ({
        label: func,
        value: func,
      }));
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
            { label: 'Upgrade', value: 2 },
          ]}
          required
          disableCustom
        />
        {hasSCType && (
          <>
            {showAddressCondition && (
              <FormInput
                name="address"
                span={2}
                title={
                  scType !== 1 ? 'Contract Address' : 'Contract Owner Address'
                }
                tooltip={scType !== 1 ? tooltip.address : tooltip.deployAddress}
                required
              />
            )}

            {scType !== 0 && (
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
                    if (scType === 1) {
                      setMetadata(hex + '@0500@' + propertiesHex);
                    } else {
                      setMetadata(hex + '@' + propertiesHex);
                    }
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
            {scType !== 0 && fileData?.length > 0 && (
              <PropertiesSection
                propertiesString={propertiesString}
                setPropertiesString={setPropertiesString}
              />
            )}
            {showAbiAndArgumentsCondition && (
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
            )}
            {scType === 0 && <FormInput {...formInputProps} />}
            {showAbiAndArgumentsCondition && (
              <ArgumentsSection
                arguments={
                  scType === 1
                    ? abi?.construct?.arguments || undefined
                    : func?.arguments || undefined
                }
                types={abi?.types}
                handleInputChange={handleInputChange}
                hasAbi={abi !== null}
              />
            )}
            {callValuesCondition && (
              <CallValueSection
                allowedAssets={
                  scType === 1
                    ? abi?.construct?.allowedAssets
                    : func?.allowedAssets
                }
              />
            )}
          </>
        )}
      </FormSection>
    </FormBody>
  );
};

export default SmartContract;
