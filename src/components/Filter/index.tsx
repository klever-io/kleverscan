import { ArrowDown } from '@/assets/icons';
import React, { useRef, useState } from 'react';
import { Loader } from '../Loader/styles';
import {
  ArrowDownContainer,
  Container,
  Content,
  HiddenInput,
  Item,
  LoadContainer,
  SelectorContainer,
} from './styles';

export interface IFilterItem {
  item: string;
}

export interface IFilter {
  title?: string;
  firstItem?: string;
  inputType?: string;
  overFlow?: string;
  data: string[];
  onClick?(selected: string): void;
  onChange?(value: string): void;
  current: string | undefined;
  loading?: boolean;
  disabledInput?: boolean;
  isHiddenInput?: boolean;
  maxWidth?: boolean;
  haveAllText?: boolean;
  customCss?: {
    container?: string;
    content?: string;
  };
}

const Filter: React.FC<IFilter> = ({
  title,
  data,
  onClick,
  onChange,
  current,
  firstItem,
  overFlow,
  inputType = 'text',
  loading,
  disabledInput,
  isHiddenInput = true,
  maxWidth,
  haveAllText = true,
  customCss,
}) => {
  const allItem = firstItem || 'All';
  const [selected, setSelected] = useState(current || allItem);
  const [open, setOpen] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);

  const openDropdown = () => {
    if (disabledInput) return;
    if (open) {
      setOpen(false);
      focusRef.current?.focus();
    }
    if (!open && !isHiddenInput) {
      closeDropDown();
    }
  };

  const arrowOnClick = () => {
    if (disabledInput) return;
    if (!open) {
      closeDropDown();
    } else {
      setOpen(false);
    }
  };

  const closeDropDown = () => {
    setOpen(true);
    setInputValue('');
  };

  const SelectorItem: React.FC<IFilterItem> = ({ item }) => {
    const handleClick = () => {
      if (onClick) {
        onClick(item);
      }
      setSelected(item);
      openDropdown();
    };
    return (
      <Item
        onClick={handleClick}
        selected={item === selected}
        data-testid="selector-item"
      >
        <p>{item}</p>
      </Item>
    );
  };

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (value === '') {
      setInputValue('');
    } else {
      const parsedValue = value.match(/[\w-\s]+/gi)?.[0];
      if (parsedValue) {
        setInputValue(parsedValue);
      }
    }
    if (onChange) {
      onChange(value);
    }
  };
  const getDataArray = () => {
    if (haveAllText) {
      return [allItem].concat(data);
    }
    return data;
  };

  const filterArrayByInput = (input: string) => {
    if (input === '') {
      return getDataArray();
    }
    const regex = new RegExp(`${input}`, 'gi');
    return getDataArray().filter(item => String(item).match(regex)?.[0]);
  };
  const filteredArray = filterArrayByInput(inputValue);

  const contentProps = {
    ref: contentRef,
    open,
    onClick: () => openDropdown(),
  };

  const selectorProps = {
    ref: selectorRef,
    open,
    overFlow,
    onClick: () => closeDropDown(),
  };
  const getPlaceholder = () => {
    if (title === 'Coin' || title === 'Asset') {
      return 'Type the token ID';
    } else if (title === 'Contract') {
      return 'Type the contract';
    }
    return '';
  };

  return (
    <Container maxWidth={maxWidth} customCss={customCss?.container}>
      <span>{title}</span>
      <Content
        onMouseEnter={() => setDontBlur(true)}
        onMouseLeave={() => setDontBlur(false)}
        data-testid="selector"
        {...contentProps}
        customCss={customCss?.content}
      >
        {!open && (
          <HiddenInput
            onBlur={() => !dontBlur && closeDropDown()}
            value={inputValue}
            type={title !== 'Status' ? inputType : 'button'}
            ref={focusRef}
            show={!open}
            placeholder={getPlaceholder()}
            onChange={handleChange}
            isHiddenInput={isHiddenInput}
          />
        )}
        <span style={{ overflow: overFlow ? overFlow : 'hidden' }}>
          {open && selected ? selected : ''}
        </span>
        <ArrowDownContainer onClick={() => arrowOnClick()}>
          <ArrowDown />
        </ArrowDownContainer>
        {!open && (
          <SelectorContainer {...selectorProps}>
            {!filteredArray.length && !loading ? (
              <span>{title} not found!</span>
            ) : (
              filteredArray.map((item, index) => (
                <SelectorItem key={String(index)} item={item} />
              ))
            )}
            {loading && (
              <LoadContainer>
                <Loader />
              </LoadContainer>
            )}
          </SelectorContainer>
        )}
      </Content>
    </Container>
  );
};

export default Filter;
