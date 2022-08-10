import React, { useState } from 'react';
import DateFilter, { IDateFilter } from '../DateFilter';
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

  const OnClick = () => {
    if (txIn === true) {
      setTxIn(false);
      setTxOut(true);
    } else if (txIn === false) {
      setTxIn(true);
      setTxOut(false);
    }
  };

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
            <div className="select">
              <select
                className="filterFromTo"
                onChange={e =>
                  filterFromTo && filterFromTo(Number(e.target.value))
                }
              >
                <option className="option" value={0}>
                  All Transactions
                </option>
                <option className="option" value={1}>
                  Transactions Out
                </option>
                <option className="option" value={2}>
                  Transacions In
                </option>
              </select>
            </div>
          </FilterContent>
        )}
      </TabContainer>
      {children}
    </Container>
  );
};

export default Tabs;
