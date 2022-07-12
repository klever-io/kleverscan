import { useField } from '@unform/core';
import { description } from 'configs/footer';
import { useEffect, useRef, useState } from 'react';
import Select from './Select';
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
} from './styles';

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
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, registerField, error } = useField(name);

  const getInitialValue = () => {
    switch (type) {
      case 'checkbox':
        if (defaultValue === undefined) {
          bool ? (defaultValue = 'true') : (defaultValue = 1);
        }
        return defaultValue;
      case 'number':
      case 'datetime-local':
        return 0;
      default:
        return '';
    }
  };

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    if (type !== 'textarea') {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
      });
    } else {
      registerField({
        name: fieldName,
        ref: areaRef.current,
        path: 'value',
      });
    }
  }, [fieldName, registerField]);

  const inputProps = {
    ref: inputRef,
    type,
    defaultValue,
    ...rest,
  };

  const containerProps = {
    span,
  };

  const selectProps = {
    title,
    selectPlaceholder,
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

  type === 'number' && (inputProps['step'] = '1');
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

        areaRef.current!.selectionStart = start + 1;
        areaRef.current!.selectionEnd = end + 1;
      }
    }
  };

  return (
    <Container {...containerProps}>
      <InputLabel>
        {title}{' '}
        {tooltip && (
          <TooltipContainer tooltip={tooltip}>
            <InfoIcon />
          </TooltipContainer>
        )}
      </InputLabel>
      {type === 'checkbox' && toggleOptions && (
        <>
          <ToggleContainer onChange={handleChange}>
            {toggleOptions.length > 1 && toggleOptions[0]}
            <Toggle>
              <StyledInput
                {...inputProps}
                required={false}
                value={value}
                checked={getIsChecked()}
              />
              <Slider />
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
      {type !== 'checkbox' && type !== 'dropdown' && type !== 'textarea' && (
        <>
          <StyledInput {...inputProps} />
          {error && <span>{description}</span>}
        </>
      )}
    </Container>
  );
};

export default FormInput;
