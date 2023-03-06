import { useField } from '@unform/core';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { components } from 'react-select';
import { Container, HiddenInput } from './styles';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

export interface IDropdownItem {
  label: string;
  value: any;
}

export interface IFilter extends React.InputHTMLAttributes<HTMLInputElement> {
  options?: IDropdownItem[];
  selectPlaceholder?: string;
  title?: string;
  name?: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

const Filter: React.FC<IFilter> = ({
  options: data,
  name,
  inputRef,
  selectPlaceholder,
  title,
  ...rest
}) => {
  const [selected, setSelected] = useState<IDropdownItem>({
    label: '',
    value: '',
  });

  const { fieldName, registerField, error } = useField(name || '');

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const Placeholder = (props: any) => {
    return <components.Placeholder {...props} />;
  };
  const CaretDownIcon = () => {
    return <IoIosArrowDown />;
  };
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <CaretDownIcon />
      </components.DropdownIndicator>
    );
  };

  const handleSelect = (selected: any) => {
    setSelected(selected);
  };

  return (
    <Container>
      <ReactSelect
        classNamePrefix="react-select"
        placeholder={
          selectPlaceholder ? selectPlaceholder : `Choose ${title ? title : ''}`
        }
        components={{ Placeholder, DropdownIndicator }}
        options={data}
        onChange={e => handleSelect(e)}
      />

      <HiddenInput
        {...rest}
        ref={inputRef}
        type="text"
        value={selected.value}
      />
    </Container>
  );
};

export default Filter;
