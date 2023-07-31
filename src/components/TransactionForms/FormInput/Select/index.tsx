import { useMulticontract } from '@/contexts/contract/multicontract';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { components } from 'react-select';
import { onChangeWrapper } from '..';
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
  name: string;
  error?: boolean;
}

const Filter: React.FC<IFilter> = ({
  options: data,
  name,
  selectPlaceholder,
  title,
  error,
  value,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const { isMultiContract } = useMulticontract();

  const router = useRouter();

  const [selected, setSelected] = useState<IDropdownItem | undefined>(
    undefined,
  );

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
    const e = {
      target: {
        name,
        value: selected.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChangeWrapper(isMultiContract, router, getValues, name)(e);

    setSelected(selected);
    setValue(name, selected.value, { shouldValidate: true });
  };

  useEffect(() => {
    if (value !== undefined) {
      const selected = data?.find(item => item.value === value);
      selected && setSelected(selected);
    }
  }, [value]);

  return (
    <Container $error={error}>
      <ReactSelect
        classNamePrefix="react-select"
        placeholder={
          selectPlaceholder ? selectPlaceholder : `Choose ${title ? title : ''}`
        }
        components={{ Placeholder, DropdownIndicator }}
        options={data}
        onChange={e => handleSelect(e)}
        value={selected?.value !== undefined ? selected : undefined}
      />

      <HiddenInput
        {...rest}
        type="text"
        value={selected?.value}
        {...register(name)}
      />
    </Container>
  );
};

export default Filter;
