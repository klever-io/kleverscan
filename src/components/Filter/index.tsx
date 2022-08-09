import React, { useRef, useState } from 'react';

import {
  ArrowDownContainer,
  Container,
  Content,
  HiddenInput,
  Item,
  SelectorContainer,
} from './styles';

import { ArrowDown } from '@/assets/icons';
import { flushSync } from 'react-dom';

export interface IFilterItem {
  name: string;
  value: any;
}

export interface IFilter {
  title: string;
  data: IFilterItem[];
  onClick?(item: IFilterItem): void;
  filterQuery: IFilterItem | undefined;
}

const Filter: React.FC<IFilter> = ({ title, data, onClick, filterQuery }) => {
  const allItem: IFilterItem = { name: 'All', value: 'all' };
  const [selected, setSelected] = useState(filterQuery || allItem);
  const [open, setOpen] = useState(true);
  const [focus, setFocus] = useState(false);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const contentRef = useRef<any>(null);
  const selectorRef = useRef<any>(null);
  const focusRef = useRef<any>(null);

  const openDropdown = () => {
    if (!focus) {
      flushSync(() => {
        setOpen(false);
        setFocus(true);
        setArrowOpen(true);
      });
      if (title !== 'Status') {
        focusRef.current.focus();
      }
    }
  };

  const arrowOnClick = () => {
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

  const SelectorItem: React.FC<IFilterItem> = item => {
    const handleClick = () => {
      if (onClick) {
        onClick(item);
      }
      setSelected(item);
      openDropdown();
      if (title !== 'Status') {
        setFocus(true);
      }
    };

    return (
      <Item onClick={handleClick} selected={item.name === selected.name}>
        <p>{item.name}</p>
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
  };

  const getDataArray = () => [allItem].concat(data);

  const filterArrayByInput = (input: string) => {
    if (input === '') {
      return getDataArray();
    }
    const regex = new RegExp(`${input}`, 'gi');
    return getDataArray().filter(item => String(item.name).match(regex)?.[0]);
  };

  const filteredArray = filterArrayByInput(inputValue);

  const contentProps = {
    ref: contentRef,
    open,
    onClick: title !== 'Status' ? () => openDropdown() : () => arrowOnClick(),
  };

  const selectorProps = {
    ref: selectorRef,
    open,
    onClick: () => closeDropDown(),
  };

  return (
    <Container>
      <span>{title}</span>
      <Content {...contentProps}>
        {focus && title !== 'Status' && (
          <HiddenInput
            value={inputValue}
            type="text"
            ref={focusRef}
            show={focus}
            onChange={e => handleChange(e)}
          />
        )}
        <span>{open && selected.name}</span>
        <ArrowDownContainer onClick={() => arrowOnClick()}>
          <ArrowDown />
        </ArrowDownContainer>

        <SelectorContainer {...selectorProps}>
          {filteredArray.map((item, index) => (
            <SelectorItem key={String(index)} {...item} />
          ))}
        </SelectorContainer>
      </Content>
    </Container>
  );
};

export default Filter;
