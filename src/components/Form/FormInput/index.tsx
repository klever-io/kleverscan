import { description } from '@/configs/footer';
import { useField } from '@unform/core';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  InfoIcon,
  InputLabel,
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

export interface IFormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
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
  maxDecimals?: number;
}

const FormInput: React.FC<IFormInputProps> = ({
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
  maxDecimals,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, registerField, error } = useField(name);

  const inputProps = {
    ref: inputRef,
    type,
    defaultValue,
    ...rest,
  };

  const getInitialValue = useCallback(() => {
    switch (type) {
      case 'checkbox':
        if (defaultValue === undefined) {
          bool ? (defaultValue = 'true') : (defaultValue = 1);
        }
        inputProps?.defaultValue && delete inputProps.defaultValue;
        return defaultValue;
      case 'number':
      case 'datetime-local':
        return 0;
      default:
        return '';
    }
  }, [type, defaultValue, bool, inputProps]);

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    if (type !== 'textarea' && type !== 'dropdown') {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
      });
    } else if (type === 'textarea') {
      registerField({
        name: fieldName,
        ref: areaRef.current,
        path: 'value',
      });
    }
  }, [fieldName, registerField]);

  const containerProps = {
    span,
  };

  const selectProps = {
    title,
    selectPlaceholder,
    name,
    ...rest,
  };

  const handleChange = () => {
    switch (type) {
      case 'checkbox':
        bool
          ? setValue(value === 'false' ? 'true' : 'false')
          : setValue(value === 0 ? 1 : 0);
        break;
    }
  };

  const getIsChecked = () => {
    if (bool) {
      return value === 'true' ? true : false;
    }
    return value === 1 ? true : false;
  };

  const preventScroll = (e: any) => {
    e.preventDefault();
    e.target.blur();
  };

  type === 'number' && (inputProps['step'] = '0.00000001');
  type === 'number' &&
    maxDecimals &&
    (inputProps['onChange'] = ({ target }) => {
      if (target.value.length > 2) {
        const regex = new RegExp('^-?\\d+.\\d{0,' + maxDecimals + '}');
        target.value = target.value?.toString()?.match(regex)?.[0] as string;
      }
    }) &&
    (inputProps['step'] = String(1 / Math.pow(10, maxDecimals)));
  type === 'number' && (inputProps['onWheel'] = preventScroll);

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
          <span>{title} </span>
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
          <ToggleContainer
            onChange={handleChange}
            disabled={inputProps.disabled}
          >
            {toggleOptions.length > 1 && toggleOptions[0]}
            <Toggle>
              <StyledInput
                {...inputProps}
                required={false}
                value={value}
                checked={getIsChecked()}
                onChange={e => {
                  return e;
                }}
              />
              <Slider active={String(getIsChecked())} />
              {error && <span>{description}</span>}
            </Toggle>
            {toggleOptions.length > 1 && toggleOptions[1]}
          </ToggleContainer>
        </>
      )}
      {type === 'dropdown' && (
        <>
          <Select {...selectProps} inputRef={inputRef} />
          {error && <span>{description}</span>}
        </>
      )}
      {type === 'textarea' && (
        <>
          <StyledTextArea ref={areaRef} onKeyDown={handleKey} />
          {error && <span>{description}</span>}
        </>
      )}
      {type === 'hidden' && (
        <>
          <StyledInput {...inputProps} />
          {error && <span>{description}</span>}
        </>
      )}
      {type !== 'checkbox' &&
        type !== 'dropdown' &&
        type !== 'textarea' &&
        type !== 'hidden' && (
          <>
            <StyledInput {...inputProps} />
            {error && <span>{description}</span>}
          </>
        )}
    </Container>
  );
};

export default FormInput;
