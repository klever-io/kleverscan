import { getSelectedTab } from '@/utils/index';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
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
  showTxInTxOutFilter?: boolean;
}

const Tabs: React.FC<ITabs> = ({
  headers,
  onClick,
  dateFilterProps,
  filterFromTo,
  children,
  showTxInTxOutFilter = false,
}) => {
  const router = useRouter();
  const getFilterName = () => {
    if (router.query?.role === 'sender') {
      return 'Transactions Out';
    } else if (router.query?.role === 'receiver') {
      return 'Transactions In';
    } else if (router.query?.role === '' || router.query?.role === undefined) {
      return 'All Transactions';
    }
    return 'All Transactions';
  };

  const [selected, setSelected] = useState<number>(0);
  const filterName = useCallback(getFilterName, [router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    setSelected(getSelectedTab(router.query?.tab));
  }, [router.isReady, router.query]);

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
      current: filterName(),
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
          <FilterContent data-testid="filter-container">
            <DateFilter {...dateFilterProps} />
            {showTxInTxOutFilter &&
              filters.map((filter, index) => (
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
