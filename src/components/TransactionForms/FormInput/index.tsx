import { useMulticontract } from '@/contexts/contract/multicontract';
import { setQueryAndRouter } from '@/utils';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import dynamic from 'next/dynamic';
import { NextRouter, useRouter } from 'next/router';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { FieldValues, useFormContext, UseFormGetValues } from 'react-hook-form';
import {
  Container,
  DropdownCustomLabel,
  DropdownCustomLabelSelectStyles,
  ErrorMessage,
  InfoIcon,
  InputLabel,
  RequiredSpan,
  Slider,
  StyledInput,
  StyledTextArea,
  Toggle,
  ToggleContainer,
  TooltipContainer,
  TooltipContent,
} from './styles';

const Select = dynamic(() => import('./Select'), {
  ssr: false,
  loading: () => null,
});

const DropdownCustomLabelSelect = dynamic(() => import('@/components/Select'), {
  ssr: false,
  loading: () => null,
});

export interface IBaseFormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  type?: string;
  toggleOptions?: [string, string];
  bool?: boolean;
  span?: number;
  paddingTop?: number;
  selectPlaceholder?: string;
  options?: {
    label: string;
    value: any;
  }[];
  tooltip?: string;
  defaultValue?: any;
  required?: boolean;
  zIndex?: number;
  precision?: number;
  customOnChange?: (e: any) => void;
  logoError?: string | null;
  handleScrollBottom?: () => void;
  onInputChange?: (e: any) => void;
  creatable?: boolean;
  dynamicInitialValue?: any;
}

export interface IFormInputProps extends IBaseFormInputProps {
  name: string;
}

export interface ICustomFormInputProps extends IBaseFormInputProps {
  onChange: ChangeEventHandler<any>;
}

export const customDropdownOptions = [
  { label: 'No', value: 'no' },
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
];

export const onChangeWrapper = (
  isMultiContract: boolean,
  router: NextRouter,
  getValues: UseFormGetValues<FieldValues>,
  name: string,
  customOnChange?: (e: any) => void,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!isMultiContract) {
      const nonEmptyValues = Object.keys(getValues())
        .filter(key => getValues()[key] !== '')
        .reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: getValues()[curr],
          };
        }, {});

      if (name) eval(`nonEmptyValues.${name} = e.target.value`);

      let newQuery: NextParsedUrlQuery = router.query?.contract
        ? { contract: router.query?.contract }
        : {};

      newQuery = {
        ...newQuery,
        ...router.query,
        contractDetails: JSON.stringify(nonEmptyValues),
      };

      setQueryAndRouter(newQuery, router);
    }

    customOnChange && customOnChange(e);
  };
};

const FormInput: React.FC<IFormInputProps | ICustomFormInputProps> = ({
  name,
  title,
  type,
  toggleOptions,
  span,
  paddingTop,
  bool,
  selectPlaceholder,
  defaultChecked = true,
  defaultValue,
  tooltip,
  required,
  zIndex,
  min,
  max,
  customOnChange,
  onChange,
  onInputChange,
  creatable,
  precision = 8,
  logoError = null,
  handleScrollBottom,
  dynamicInitialValue,
  ...rest
}) => {
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isCustom, setIsCustom] = useState(customDropdownOptions[0]);
  const router = useRouter();
  const { isMultiContract } = useMulticontract();
  const {
    register,
    formState: { errors },
    watch,
    unregister,
    setValue,
    getValues,
  } = useFormContext();

  let error = null;

  try {
    error = eval(`errors?.${name}`);
  } catch (e) {
    error = null;
  }

  useEffect(() => {
    name && dynamicInitialValue && setValue(name, dynamicInitialValue);
  }, [dynamicInitialValue]);

  const inputValue = name && watch(name);

  const registerProps =
    name &&
    (type !== 'number' && isCustom.value !== 'number'
      ? register(name, {
          required: {
            value: required || false,
            message: 'This field is required',
          },
          onChange: onChangeWrapper(
            isMultiContract,
            router,
            getValues,
            name,
            customOnChange,
          ),
        })
      : register(name, {
          valueAsNumber: true,
          required: {
            value: required || false,
            message: 'This field is required',
          },
          onChange: onChangeWrapper(
            isMultiContract,
            router,
            getValues,
            name,
            customOnChange,
          ),
          validate: (value: any) => {
            if (Number.isNaN(value)) {
              return 'Only numbers allowed';
            }

            if (value < (min || 0)) {
              return `Minimum value is ${min || 0}`;
            }

            if (max && value > max) {
              return `Maximum value is ${max || 100}`;
            }

            if (precision !== undefined && value) {
              let parsedValue = value;

              // remove scientific notation
              if (String(value).includes('e')) {
                parsedValue = Number(value).toFixed(
                  Number(String(value).split('-')[1]),
                );
              }
              const regex = new RegExp(
                `^-?[0-9]\\d*(\\.\\d{0,${precision}})?$`,
              );

              if (!regex.test(parsedValue)) {
                return precision > 0
                  ? `Maximum ${precision} decimals allowed`
                  : 'Only integer numbers allowed';
              }
            }

            return true;
          },
        }));

  useEffect(() => {
    return () => {
      name && unregister(name);
    };
  }, [name, unregister, isCustom]);

  const areaProps = {
    error: Boolean(error),
    logoWarning: logoError !== null ? true : false,
    value: rest.value,
    onChange: onChange as ChangeEventHandler<HTMLTextAreaElement>,
  };

  let inputProps = {
    type,
    defaultValue,
    ...areaProps,
    onChange: onChange as ChangeEventHandler<HTMLInputElement>,
    ...registerProps,
    ...rest,
  };

  const containerProps = {
    paddingTop,
    span,
    zIndex,
  };

  const selectProps = {
    title,
    selectPlaceholder,
    name: name || '',
    error: Boolean(error),
    value: inputValue,
    handleScrollBottom,
    onInputChange,
    creatable,
    ...rest,
  };

  const { ref, ...registerRest } = registerProps || {};

  const preventScroll = (e: any) => {
    e.target.blur();
  };

  (type === 'number' || isCustom.value === 'number') &&
    (inputProps = {
      ...inputProps,
      step: 1 / 10 ** precision,
      onWheel: preventScroll,
    });

  const handleKey = (e: any) => {
    if (e.key === 'Tab' && type === 'textarea') {
      e.preventDefault();
      if (areaRef.current) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        areaRef.current.value =
          areaRef.current.value.substring(0, start) +
          '\t' +
          areaRef.current.value.substring(end);

        if (typeof areaRef.current.selectionStart === 'number') {
          areaRef.current.selectionStart = start + 1;
        }
        if (typeof areaRef.current.selectionEnd === 'number') {
          areaRef.current.selectionEnd = end + 1;
        }
      }
    }
  };

  return (
    <Container {...containerProps}>
      {type !== 'hidden' && (
        <InputLabel disabled={inputProps.disabled}>
          <span>
            {title || name}
            {required && <RequiredSpan>(required)</RequiredSpan>}
          </span>
          {tooltip && (
            <TooltipContainer>
              <InfoIcon />
              <TooltipContent>
                <span>{tooltip}</span>
              </TooltipContent>
            </TooltipContainer>
          )}
          {type === 'dropdown' && (
            <DropdownCustomLabel>
              <span>Custom value?</span>
              <DropdownCustomLabelSelect
                options={customDropdownOptions}
                value={isCustom}
                onChange={(e: any) => {
                  setIsCustom(e) as any;
                }}
                styles={DropdownCustomLabelSelectStyles}
                isSearchable={false}
              />
            </DropdownCustomLabel>
          )}
        </InputLabel>
      )}
      {type === 'checkbox' && toggleOptions && (
        <>
          <ToggleContainer disabled={inputProps.disabled}>
            {toggleOptions.length > 1 && toggleOptions[0]}
            <Toggle>
              <StyledInput {...inputProps} required={false} />
              <Slider active={String(!!inputValue)} />
            </Toggle>
            {toggleOptions.length > 1 && toggleOptions[1]}
          </ToggleContainer>
        </>
      )}
      {type === 'dropdown' && isCustom.value === 'no' && (
        <Select {...selectProps} />
      )}
      {type === 'textarea' && (
        <StyledTextArea
          onKeyDown={handleKey}
          {...areaProps}
          {...registerRest}
          ref={e => {
            ref && ref(e);
            areaRef.current = e;
          }}
        />
      )}
      {type === 'hidden' && <StyledInput {...inputProps} />}
      {type !== 'checkbox' &&
        (type !== 'dropdown' || isCustom.value !== 'no') &&
        type !== 'textarea' &&
        type !== 'hidden' && <StyledInput {...inputProps} />}

      {error && (
        <ErrorMessage
          style={{ color: 'red', fontSize: '0.8rem' }}
          warning={title === 'Logo'}
        >
          {error?.message}
        </ErrorMessage>
      )}
      {logoError && (
        <ErrorMessage warning={!!logoError}>{logoError}</ErrorMessage>
      )}
    </Container>
  );
};

export default FormInput;
