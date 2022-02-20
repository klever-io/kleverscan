import React from 'react';
import { IFilterItem } from '../Filter';
import Skeleton from '../Skeleton';

import { Body, Container, EmptyRow, Header, ITableType, Row } from './styles';

export interface ITable {
  type:
    | 'transactions'
    | 'blocks'
    | 'accounts'
    | 'assets'
    | 'transactionDetail'
    | 'buckets'
    | 'accounts'
    | 'assetsPage'
    | 'holders'
    | 'validators'
    | 'nodes'
    | 'networkParams'
    | 'proposals'
    | 'votes';

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
          <>
            {Array(10)
              .fill(10)
              .map((_, index) => (
                <Row key={String(index)} {...props}>
                  {header.map((_, index2) => (
                    <span key={String(index2)}>
                      <Skeleton width="100%" />
                    </span>
                  ))}
                </Row>
              ))}
          </>
        )}
        {!loading && data.length === 0 && (
          <EmptyRow {...props}>
            <p>Oops! Apparently no data here.</p>
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
