import React, { useState } from 'react';
import DateFilter, { IDateFilter } from '../DateFilter';
import Filter, { IFilter } from '../Filter';
import {
  Container,
  FilterContent,
  Indicator,
  ItemContainer,
  TabContainer,
  TabContent,
} from './styles';

export interface ITabs {
  headers: string[];
  onClick?(header: string, index: number): void;
  dateFilterProps?: IDateFilter;
  filterFromTo?(op: number): void;
}

const Tabs: React.FC<ITabs> = ({
  headers,
  onClick,
  dateFilterProps,
  filterFromTo,
  children,
}) => {
  const [selected, setSelected] = useState(0);
  const [txIn, setTxIn] = useState(true);
  const [txOut, setTxOut] = useState(false);
  const [filterName, setFilterName] = useState('All Transactions');
  const OnClick = () => {
    if (txIn === true) {
      setTxIn(false);
      setTxOut(true);
    } else if (txIn === false) {
      setTxIn(true);
      setTxOut(false);
    }
  };

  const handleClickFilterName = (filter: string) => {
    switch (filter) {
      case 'All Transactions':
        filterFromTo && filterFromTo(0);
        break;
      case 'Transactions Out':
        filterFromTo && filterFromTo(1);
        break;
      case 'Transactions In':
        filterFromTo && filterFromTo(2);
        break;

      default:
        filterFromTo && filterFromTo(0);
    }
  };
  const filters: IFilter[] = [
    {
      firstItem: 'All Transactions',
      data: ['Transactions Out', 'Transactions In'],
      onClick: e => {
        handleClickFilterName(e);
      },
      current: filterName,
      overFlow: 'visible',
      inputType: 'button',
    },
  ];
  return (
    <Container>
      <TabContainer>
        <TabContent>
          {headers.map((header, index) => {
            const itemProps = {
              selected: index === selected,
              onClick: () => {
                if (onClick) {
                  onClick(header, index);
                }
                setSelected(index);
              },
            };

            return (
              <ItemContainer key={String(index)} {...itemProps}>
                <span>{header}</span>
                <Indicator selected={index === selected} />
              </ItemContainer>
            );
          })}
        </TabContent>
        {dateFilterProps && headers[selected] === 'Transactions' && (
          <FilterContent>
            <DateFilter {...dateFilterProps} />
            {filters.map((filter, index) => (
              <Filter key={index} {...filter} />
            ))}
          </FilterContent>
        )}
      </TabContainer>
      {children}
    </Container>
  );
};

export default Tabs;
