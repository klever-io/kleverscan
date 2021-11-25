import React from 'react';
import { IFilterItem } from '../Filter';

import { Body, Container, EmptyRow, Header, ITableType } from './styles';

export interface ITable {
  type: 'transactions' | 'blocks' | 'accounts' | 'assets' | 'transactionDetail' | 'buckets' | 'accounts' | 'assetsPage';
  header: string[];
  data: any[];
  body: any;
  filter?: IFilterItem;
  loading: boolean;
}

const Table: React.FC<ITable> = ({
  type,
  header,
  data,
  body: Component,
  filter,
  loading,
}) => {
  const props: ITableType = { type, filter };

  return (
    <Container>
      <Header {...props}>
        {header.map((item, index) => (
          <span key={String(index)}>{item}</span>
        ))}
      </Header>
      <Body>
        {loading && (
          <span>Loading...</span>
          // TODO: Create loader
        )}
        {!loading && data.length === 0 && (
          <EmptyRow {...props}>
            <p>Oops! Apparently no data loaded.</p>
          </EmptyRow>
        )}
        {!loading &&
          data.map((item, index) => (
            <Component key={String(index)} {...item} />
          ))}
      </Body>
    </Container>
  );
};

export default Table;
