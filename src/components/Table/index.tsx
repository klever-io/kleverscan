import { IRowSection, Query } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { useMobile } from 'contexts/mobile';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Pagination from '../Pagination';
import { PaginationContainer } from '../Pagination/styles';
import Skeleton from '../Skeleton';
import {
  Body,
  Container,
  ContainerView,
  EmptyRow,
  FloatContainer,
  Header,
  ITableType,
  ItemContainer,
  LimitContainer,
  LimitText,
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
    | 'nfts'
    | 'validatorsList';

  header: string[];
  data: any[];
  body?: any;
  rowSections?: (item: any) => IRowSection[] | undefined;
  scrollUp?: boolean;
  totalPages?: number;
  dataName?: string;
  request?: (page: number, limit: number) => Promise<any>;
  query?: Query;
  interval?: number;
  intervalController?: React.Dispatch<React.SetStateAction<number>>;
}

const Table: React.FC<ITable> = ({
  type,
  header,
  data,
  body: Component,
  rowSections,
  request,
  scrollUp,
  totalPages: defaultTotalPages,
  dataName,
  query,
  interval,
  intervalController,
}) => {
  const { pathname } = useRouter();
  const props: ITableType = { type, pathname, haveData: data?.length };
  const { isMobile } = useMobile();
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(defaultTotalPages);
  const [limit, setLimit] = useState<number>(10);
  const [items, setItems] = useState(data);
  const dataRef = useRef([]) as any;
  const limits = [5, 10, 30, 50];

  useEffect(() => {
    const tabletWindow = window.innerWidth <= 1025 && window.innerWidth >= 769;
    setIsTablet(tabletWindow);
  });

  const fetchData = async () => {
    if (request && dataName) {
      const response = await request(page, limit);
      setLoading(true);
      if (!response.error) {
        setItems(response.data[dataName]);
        setTotalPages(response.pagination.totalPages);
      } else {
        setPage(1);
        setItems([]);
      }
    }
    setLoading(false);
  };

  useDidUpdateEffect(() => {
    if (!dataRef.current.length) {
      setItems(data);
      dataRef.current = data;
    }
  }, [data]);

  useDidUpdateEffect(() => {
    if (page !== 1 && intervalController) {
      intervalController(0);
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [limit]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    fetchData();
  }, [query]);

  useEffect(() => {
    setLoading(true);
    if (interval) {
      const intervalId = setInterval(() => {
        fetchData();
      }, interval);
      return () => clearInterval(intervalId);
    } else {
      fetchData();
    }
  }, [interval, limit]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <>
      {typeof scrollUp === 'boolean' &&
        typeof totalPages === 'number' &&
        !!items &&
        items?.length > 0 && (
          <FloatContainer>
            <LimitContainer>
              <span>Per page</span>
              <LimitText>
                {limits.map(value => (
                  <ItemContainer
                    key={value}
                    onClick={() => setLimit(value)}
                    active={value === limit}
                  >
                    {value}
                  </ItemContainer>
                ))}
              </LimitText>
            </LimitContainer>
          </FloatContainer>
        )}
      <ContainerView>
        <Container>
          {((!isMobile && !isTablet) || !rowSections) && !!items?.length && (
            <Header {...props} key={String(header)}>
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
            {!loading &&
              items?.map((item, index) => {
                let spanCount = 0;

                return (
                  <React.Fragment key={String(index)}>
                    {Component && <Component key={String(index)} {...item} />}
                    {rowSections && (
                      <Row key={String(index)} {...props} rowSections={true}>
                        {rowSections(item)?.map(({ element, span }, index2) => {
                          let isRightAligned = false;
                          spanCount += span || 1;
                          if (span === -1) {
                            spanCount += 1;
                          }
                          if (span !== 2 && spanCount % 2 === 0) {
                            isRightAligned = true;
                          }
                          return (
                            <MobileCardItem
                              isRightAligned={
                                (isMobile || isTablet) && isRightAligned
                              }
                              key={String(index2) + String(index)}
                              columnSpan={span}
                            >
                              {isMobile || isTablet ? (
                                <MobileHeader>{header[index2]}</MobileHeader>
                              ) : null}
                              {element}
                            </MobileCardItem>
                          );
                        })}
                      </Row>
                    )}
                  </React.Fragment>
                );
              })}
          </Body>
          {!loading && (!items || items?.length === 0) && (
            <EmptyRow {...props}>
              <p>Oops! Apparently no data here.</p>
            </EmptyRow>
          )}
        </Container>
      </ContainerView>
      {typeof scrollUp === 'boolean' &&
        typeof totalPages === 'number' &&
        totalPages > 1 && (
          <PaginationContainer>
            <Pagination
              scrollUp={scrollUp}
              count={totalPages}
              page={page}
              onPaginate={page => {
                setPage(page);
              }}
            />
          </PaginationContainer>
        )}
    </>
  );
};

export default Table;
