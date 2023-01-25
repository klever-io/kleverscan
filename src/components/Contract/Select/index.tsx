import { IStakingRewards } from '@/pages/account/[account]';
import { IKAssets } from '@/types';
import dynamic from 'next/dynamic';
import React, { useCallback, useRef } from 'react';
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
  title?: string;
  getAssets?: () => void;
  label?: string;
  precedence?: number; // z-index precedence
  collection?: IKAssets;
  claimSelectedType?: IStakingRewards;
}

const Select: React.FC<IFilter> = ({
  options,
  onChange,
  selectPlaceholder,
  title,
  getAssets,
  label,
  precedence,
  collection,
  claimSelectedType,

  ...rest
}) => {
  const getAssetsEnableRef = useRef<boolean>(true);
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

  const handleChange = (value: any) => {
    if (getAssets && getAssetsEnableRef.current) {
      getAssets();
    }

    getAssetsEnableRef.current = true;
    onChange(value);
  };

  const handleMenuOpen = () => {
    getAssets && getAssets();
    if (title !== 'Contract') getAssetsEnableRef.current = false;
  };

  const handleMenuClose = () => {
    setTimeout(() => {
      getAssetsEnableRef.current = true;
    }, 200);
  };

  const props = {
    classNamePrefix: 'react-select',
    options,
    onChange: handleChange,
    onMenuOpen: handleMenuOpen,
    onMenuClose: handleMenuClose,
  };

  return (
    <Container precedence={precedence}>
      {label && <TitleLabel>{label}</TitleLabel>}
      <ReactSelect
        defaultValue={
          (collection && Object.keys(collection).length !== 0 && collection) ||
          claimSelectedType
        }
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
