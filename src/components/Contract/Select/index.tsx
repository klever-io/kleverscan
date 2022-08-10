import dynamic from 'next/dynamic';
import React, { useCallback } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { components } from 'react-select';
import { Container } from './styles';

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
  onChange: (value: any) => void;
  title?: string;
}

const Select: React.FC<IFilter> = ({
  options,
  onChange,
  selectPlaceholder,
  title,
  ...rest
}) => {
  const Placeholder = useCallback((props: any) => {
    return <components.Placeholder {...props} />;
  }, []);

  const CaretDownIcon = useCallback(() => {
    return <IoIosArrowDown />;
  }, []);

  const DropdownIndicator = useCallback((props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <CaretDownIcon />
      </components.DropdownIndicator>
    );
  }, []);

  const props = {
    classNamePrefix: 'react-select',
    options,
    onChange,
  };

  return (
    <Container>
      <ReactSelect
        placeholder={
          selectPlaceholder ? selectPlaceholder : `Choose ${title ? title : ''}`
        }
        components={{ Placeholder, DropdownIndicator }}
        {...props}
      />
    </Container>
  );
};

export default Select;
