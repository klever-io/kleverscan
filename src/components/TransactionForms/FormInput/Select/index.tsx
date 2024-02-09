import { useMulticontract } from '@/contexts/contract/multicontract';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { onChangeWrapper } from '..';
import { Container, HiddenInput } from './styles';

const BaseSelect = dynamic(() => import('@/components/Select'), {
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
  error?: boolean;
  onInputChange?: (e: any) => void;
  handleScrollBottom?: () => void;
  creatable?: boolean;
  selectFilter?: (e: any) => any;
}

const Filter: React.FC<IFilter> = ({
  options: data,
  name,
  selectPlaceholder,
  title,
  error,
  value,
  handleScrollBottom,
  onInputChange,
  creatable,
  selectFilter,
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selected, setSelected] = useState<IDropdownItem | undefined>(
    undefined,
  );

  const handleSelect = (selected: any) => {
    if (name === undefined) return;

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
    if (value !== undefined && data !== undefined && data.length > 0) {
      let selected = data?.find(item => item.value === value);
      if (selectFilter && selected) {
        selected = selectFilter(selected);
      }
      selected && setSelected(selected);
    }
  }, [value, data]);

  return (
    <Container $error={error} isOpenMenu={isSelectOpen}>
      <BaseSelect
        placeholder={
          selectPlaceholder ? selectPlaceholder : `Choose ${title ? title : ''}`
        }
        onMenuOpen={() => setIsSelectOpen(true)}
        onMenuClose={() => setIsSelectOpen(false)}
        options={data}
        onChange={e => handleSelect(e)}
        onInputChange={onInputChange}
        value={selected?.value !== undefined ? selected : undefined}
        onMenuScrollToBottom={handleScrollBottom}
        creatable={creatable}
      />

      {name && (
        <HiddenInput
          {...rest}
          type="text"
          value={selected?.value !== undefined ? selected.value : ''}
          {...register(name)}
        />
      )}
    </Container>
  );
};

export default Filter;
