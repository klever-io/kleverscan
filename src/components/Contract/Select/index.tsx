import { PropsWithChildren } from 'react';
import { IStakingRewards } from '@/pages/account/[account]';
import { ICollectionList } from '@/types';
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
  onMenuScrollToBottom?: () => void;
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
  isSearching?: boolean;
}

const Select: React.FC<PropsWithChildren<IFilter>> = ({
  options,
  onChange,
  onInputChange,
  onMenuOpen,
  onMenuScrollToBottom,
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
  isSearching,
  ...rest
}) => {
  const Placeholder = useCallback((props: any): React.ReactElement => {
    const Component = components.Placeholder as any;
    return <Component {...props} />;
  }, []);

  const CaretDownIcon = useCallback(() => {
    return <IoIosArrowDown />;
  }, []);

  const DropdownIndicator = useCallback((props: any): React.ReactElement => {
    const Component = components.DropdownIndicator as any;
    return (
      <Component {...props}>
        <CaretDownIcon />
      </Component>
    );
  }, []);

  const props = {
    classNamePrefix: 'react-select',
    options,
    onChange,
    onMenuOpen,
    onMenuScrollToBottom,
    noOptionsMessage,
    onCreateOption,
    onInputChange,
    isSearching,
  };

  const getPlaceholder = () => {
    if (loading) return 'Loading...';
    if (selectPlaceholder) return selectPlaceholder;

    return `Choose ${title ? title : ''}`;
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
