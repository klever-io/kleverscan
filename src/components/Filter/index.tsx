import React, { useRef, useState } from 'react';

import { Container, Content, Item, SelectorContainer } from './styles';

import { ArrowDown } from '@/assets/icons';

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

  const contentRef = useRef<any>(null);
  const selectorRef = useRef<any>(null);

  const handleDropdown = (behavior?: boolean) => {
    const to = behavior || !open;

    setOpen(to);
  };

  const getDataArray = () => [allItem].concat(data);

  const SelectorItem: React.FC<IFilterItem> = item => {
    const handleClick = () => {
      if (onClick) {
        onClick(item);
      }
      
      setSelected(item);
      handleDropdown(false);
    };

    return (
      <Item onClick={handleClick} selected={item.name === selected.name}>
        <p>{item.name}</p>
      </Item>
    );
  };

  const contentProps = {
    ref: contentRef,
    open,
    onClick: () => handleDropdown(),
  };

  const selectorProps = {
    ref: selectorRef,
    open,
  };

  return (
    <Container>
      <span>{title}</span>

      <Content {...contentProps}>
        <span>{selected.name}</span>
        <ArrowDown />

        <SelectorContainer {...selectorProps}>
          {getDataArray().map((item, index) => (
            <SelectorItem key={String(index)} {...item} />
          ))}
        </SelectorContainer>
      </Content>
    </Container>
  );
};

export default Filter;
