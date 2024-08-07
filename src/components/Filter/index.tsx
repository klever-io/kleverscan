import { FilterArrowDown } from '@/assets/icons';
import React, { PropsWithChildren, useMemo, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Loader } from '../Loader/styles';
import {
  ArrowDownContainer,
  CloseContainer,
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
}

const Filter: React.FC<PropsWithChildren<IFilter>> = ({
  title,
  data,
  onClick,
  onChange,
  current: initial,
  firstItem,
  overFlow,
  inputType = 'text',
  loading,
  disabledInput,
  isHiddenInput = true,
  maxWidth,
}) => {
  const allItem = firstItem || 'All';
  const [selected, setSelected] = useState(initial || allItem);
  const [closed, setClosed] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);

  const openDropdown = () => {
    if (disabledInput) return;
    if (closed) {
      setClosed(false);
      focusRef.current?.focus();
    }
    if (!closed && !isHiddenInput) {
      closeDropDown();
    }
  };

  const arrowOnClick = () => {
    if (disabledInput) return;
    if (!closed) {
      closeDropDown();
    } else {
      setClosed(false);
    }
  };

  const closeDropDown = () => {
    setClosed(true);
    setInputValue('');
  };

  const SelectorItem: React.FC<PropsWithChildren<IFilterItem>> = ({ item }) => {
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

  const handleClear = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(allItem);
    if (onClick) {
      onClick(allItem);
    }
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
  const getDataArray = () => [allItem].concat(data);

  const filterArrayByInput = (input: string) => {
    if (input === '') {
      return getDataArray();
    }
    const regex = new RegExp(`${input}`, 'gi');
    return getDataArray().filter((item) => String(item).match(regex)?.[0]);
  };
  const filteredArray = filterArrayByInput(inputValue);

  const contentProps = useMemo(() => {
    return {
      ref: contentRef,
      open: closed,
      onClick: () => openDropdown(),
    };
  }, [contentRef, closed, openDropdown]);

  const selectorProps = {
    ref: selectorRef,
    open: closed,
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
    <Container maxWidth={maxWidth} open={!closed}>
      <span>{title}</span>
      <Content
        onMouseEnter={() => setDontBlur(true)}
        onMouseLeave={() => setDontBlur(false)}
        data-testid="selector"
        {...contentProps}
      >
        {!closed && (
          <HiddenInput
            onBlur={() => !dontBlur && closeDropDown()}
            value={inputValue}
            type={title !== 'Status' ? inputType : 'button'}
            ref={focusRef}
            show={!closed}
            placeholder={getPlaceholder()}
            onChange={handleChange}
            isHiddenInput={isHiddenInput}
          />
        )}
        <span style={{ overflow: overFlow ? overFlow : 'hidden' }}>
          {closed && selected ? selected : ''}
        </span>

        <CloseContainer empty={selected === allItem} onClick={handleClear}>
          <AiOutlineClose />
        </CloseContainer>

        <ArrowDownContainer onClick={() => arrowOnClick()} open={!closed}>
          <FilterArrowDown />
        </ArrowDownContainer>
        {!closed && (
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
