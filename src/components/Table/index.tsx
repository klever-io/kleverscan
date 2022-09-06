import { useWidth } from 'contexts/width';
import { useRouter } from 'next/router';
import React from 'react';
import { IFilterItem } from '../Filter';
import Skeleton from '../Skeleton';
import {
  Body,
  Container,
  ContainerView,
  EmptyRow,
  Header,
  ITableType,
  MobileCardItem,
  MobileHeader,
  Row,
} from './styles';

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
    | 'validator'
    | 'nodes'
    | 'networkParams'
    | 'proposals'
    | 'votes'
    | 'delegations'
    | 'nfts';

  header: string[];
  data: any[];
  body?: any;
  rowSections?: (item: any) => JSX.Element[] | undefined;
  filter?: IFilterItem;
  loading: boolean;
  columnSpans?: number[];
}

const Table: React.FC<ITable> = ({
  type,
  header,
  data,
  body: Component,
  rowSections,
  columnSpans,
  filter,
  loading,
}) => {
  const { pathname } = useRouter();
  const props: ITableType = { type, filter, pathname, haveData: data?.length };
  const { isMobile } = useWidth();

  return (
    <ContainerView>
      <Container>
        {(!isMobile || !rowSections) && (
          <Header {...props}>
            {header.map((item, index) => (
              <span key={String(index)}>{item}</span>
            ))}
          </Header>
        )}
        <Body {...props}>
          {loading && (
            <>
              {Array(5)
                .fill(5)
                .map((_, index) => (
                  <Row key={String(index)} {...props}>
                    {header.map((item, index2) => (
                      <span key={String(index2)}>
                        <Skeleton width="100%" />
                      </span>
                    ))}
                  </Row>
                ))}
            </>
          )}
          {!loading && (!data || data.length === 0) && (
            <EmptyRow {...props}>
              <p>Oops! Apparently no data here.</p>
            </EmptyRow>
          )}
          {!loading &&
            data.map((item, index) => (
              <>
                {Component && <Component key={String(index)} {...item} />}
                {rowSections && (
                  <Row key={String(index)} {...props} rowSections={true}>
                    {rowSections(item)?.map((Section, index2) => (
                      <MobileCardItem
                        key={String(index2) + String(index)}
                        columnSpan={columnSpans?.[index2]}
                      >
                        {isMobile && (
                          <MobileHeader>{header[index2]}</MobileHeader>
                        )}
                        {Section}
                      </MobileCardItem>
                    ))}
                  </Row>
                )}
              </>
            ))}
        </Body>
      </Container>
    </ContainerView>
  );
};

export default Table;
