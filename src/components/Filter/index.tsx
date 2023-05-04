import { ArrowDown } from '@/assets/icons';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
  onClick?(selected: string, filterType: string): void;
  onChange?(value: string): void;
  current: string | undefined;
  loading?: boolean;
  disabledInput?: boolean;
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
}) => {
  const allItem = firstItem || 'All';
  const [selected, setSelected] = useState(current || allItem);
  const [open, setOpen] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [focus, setFocus] = useState(false);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);

  const openDropdown = () => {
    if (disabledInput) return;
    if (!focus) {
      flushSync(() => {
        setOpen(false);
        setFocus(true);
        setArrowOpen(true);
      });

      focusRef.current?.focus();
    }
  };

  const arrowOnClick = () => {
    if (disabledInput) return;
    if (arrowOpen) {
      closeDropDown();
    } else {
      setArrowOpen(true);
      setOpen(false);
      setFocus(true);
    }
  };

  const closeDropDown = () => {
    setArrowOpen(false);
    setOpen(true);
    setFocus(false);
    setInputValue('');
  };

  const SelectorItem: React.FC<IFilterItem> = ({ item }) => {
    const handleClick = () => {
      if (onClick) {
        onClick(item, '');
        // dont know why, but need to pass a string in this onClick fn, any string just for TS purposes
        // since the fn calls are all with hard coded 2nd parameter in the parent component
      }
      setSelected(item);
      openDropdown();

      setFocus(true);
    };
    return (
      <Item onClick={handleClick} selected={item === selected}>
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
  const getDataArray = () => [allItem].concat(data);

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
    <Container>
      <span>{title}</span>
      <Content
        onMouseEnter={() => setDontBlur(true)}
        onMouseLeave={() => setDontBlur(false)}
        {...contentProps}
      >
        {focus && (
          <HiddenInput
            onBlur={() => !dontBlur && closeDropDown()}
            value={inputValue}
            type={title !== 'Status' ? inputType : 'button'}
            ref={focusRef}
            show={focus}
            placeholder={getPlaceholder()}
            onChange={handleChange}
          />
        )}
        <span style={{ overflow: overFlow ? overFlow : 'hidden' }}>
          {open && selected ? selected : ''}
        </span>
        <ArrowDownContainer onClick={() => arrowOnClick()}>
          <ArrowDown />
        </ArrowDownContainer>
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
      </Content>
    </Container>
  );
};

export default Filter;
