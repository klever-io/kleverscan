import dynamic from 'next/dynamic';
import { ChangeEventHandler, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Container,
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

export interface IBaseFormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  type?: string;
  toggleOptions?: [string, string];
  bool?: boolean;
  span?: number;
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
}

export interface IFormInputProps extends IBaseFormInputProps {
  name: string;
}

export interface ICustomFormInputProps extends IBaseFormInputProps {
  onChange: ChangeEventHandler<any>;
}

const FormInput: React.FC<IFormInputProps | ICustomFormInputProps> = ({
  name,
  title,
  type,
  toggleOptions,
  span,
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
  precision = 8,
  ...rest
}) => {
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    formState: { errors },
    watch,
    unregister,
  } = useFormContext();

  let error = null;

  try {
    error = eval(`errors?.${name}`);
  } catch (e) {
    error = null;
  }

  const inputValue = name && watch(name);

  const registerProps =
    name &&
    (type !== 'number'
      ? register(name, {
          value: defaultValue,
          required: {
            value: required || false,
            message: 'This field is required',
          },
          onChange: customOnChange,
        })
      : register(name, {
          valueAsNumber: true,
          value: defaultValue,
          required: {
            value: required || false,
            message: 'This field is required',
          },
          onChange: customOnChange,
          validate: (value: any) => {
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
  }, [name, unregister]);

  const areaProps = {
    error: Boolean(error),
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
    span,
    zIndex,
  };

  const selectProps = {
    title,
    selectPlaceholder,
    name: name || '',
    error: Boolean(error),
    value: inputValue,
    ...rest,
  };

  const { ref, ...registerRest } = registerProps || {};

  const preventScroll = (e: any) => {
    e.preventDefault();
    e.target.blur();
  };

  type === 'number' &&
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
            {required && <RequiredSpan> (required)</RequiredSpan>}
          </span>
          {tooltip && (
            <TooltipContainer>
              <InfoIcon />
              <TooltipContent>
                <span>{tooltip}</span>
              </TooltipContent>
            </TooltipContainer>
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
      {type === 'dropdown' && <Select {...selectProps} />}
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
        type !== 'dropdown' &&
        type !== 'textarea' &&
        type !== 'hidden' && <StyledInput {...inputProps} />}

      {error && (
        <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
          {error?.message}
        </ErrorMessage>
      )}
    </Container>
  );
};

export default FormInput;
