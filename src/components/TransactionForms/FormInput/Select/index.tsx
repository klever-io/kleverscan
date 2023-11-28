import { useMulticontract } from '@/contexts/contract/multicontract';
import { useTranslation } from 'next-i18next';
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
  name: string;
  error?: boolean;
  onInputChange?: (e: any) => void;
  handleScrollBottom?: () => void;
  creatable?: boolean;
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
  ...rest
}) => {
  const { t } = useTranslation('transactions');
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
      <BaseSelect
        placeholder={
          selectPlaceholder
            ? selectPlaceholder
            : `${t('CreateTransactions.Choose')} ${title ? title : ''}`
        }
        options={data}
        onChange={e => handleSelect(e)}
        onInputChange={onInputChange}
        value={selected?.value !== undefined ? selected : undefined}
        onMenuScrollToBottom={handleScrollBottom}
        creatable={creatable}
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
