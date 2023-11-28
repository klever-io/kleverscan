import { IStakingRewards } from '@/pages/account/[account]';
import { ICollectionList } from '@/types';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React, { useCallback } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { components } from 'react-select';
import { Container, TitleLabel } from './styles';

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
  onInputChange?: (value: any) => void;
  onMenuOpen?: () => void;
  title?: string;
  label?: string;
  zIndex?: number;
  collection?: ICollectionList;
  claimSelectedType?: IStakingRewards;
  isDisabled?: boolean;
  isModal?: boolean;
  selectedBucket?: string;
  error?: boolean;
  selectedValue?: IDropdownItem;
  loading?: boolean;
  defaultValue?: any;
  noOptionsMessage?: any;
  onCreateOption?: (value: any) => void;
}

const Select: React.FC<IFilter> = ({
  options,
  onChange,
  onInputChange,
  onMenuOpen,
  noOptionsMessage,
  selectPlaceholder,
  title,
  label,
  zIndex,
  collection,
  claimSelectedType,
  isDisabled,
  selectedBucket,
  error,
  loading,
  selectedValue,
  onCreateOption,
  defaultValue,
  ...rest
}) => {
  const { t } = useTranslation('transactions');
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
    onMenuOpen,
    noOptionsMessage,
    onCreateOption,
    onInputChange,
  };

  const getPlaceholder = () => {
    if (loading) return `${t('Loading')}`;
    if (selectPlaceholder) return selectPlaceholder;

    return `${t('CreateTransactions.Choose')} ${title ? title : ''}`;
  };

  return (
    <Container zIndex={zIndex} $error={error}>
      {label && <TitleLabel>{label}</TitleLabel>}
      <ReactSelect
        defaultValue={
          (collection && Object.keys(collection).length !== 0 && collection) ||
          claimSelectedType ||
          (selectedBucket && { label: selectedBucket }) ||
          defaultValue
        }
        value={selectedValue}
        placeholder={getPlaceholder()}
        components={{ Placeholder, DropdownIndicator }}
        isDisabled={loading}
        {...props}
      />
    </Container>
  );
};

export default Select;
