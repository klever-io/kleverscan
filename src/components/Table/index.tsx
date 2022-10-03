import { Query } from '@/types/index';
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
    | 'nfts'
    | 'validatorsList';

  header: string[];
  data: any[];
  body?: any;
  rowSections?: (item: any) => JSX.Element[] | undefined;
  columnSpans?: number[];
  scrollUp?: boolean;
  totalPages?: number;
  dataName?: string;
  request?: (page: number) => Promise<any>;
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
  columnSpans,
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
  const [items, setItems] = useState(data);
  const dataRef = useRef([]) as any;
  const router = useRouter();

  useEffect(() => {
    const tabletWindow = window.innerWidth <= 1025 && window.innerWidth >= 769;
    setIsTablet(tabletWindow);
  });

  const fetchData = async () => {
    if (!interval && request && dataName) {
      // TODO: check if this "if" with interval check is still necessary after fixing blocks updating effect
      setLoading(true);
    }
    if (request && dataName) {
      const response = await request(page);
      if (!response.error) {
        setItems(response.data[dataName]);
        setTotalPages(response.pagination.totalPages);
      } else {
        setPage(1);
        setItems([]);
      }
      setLoading(false);
    }
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
    if (page !== 1) {
      setPage(1);
    }
    fetchData();
  }, [query]);

  useEffect(() => {
    if (interval) {
      const intervalId = setInterval(() => {
        fetchData();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <>
      <ContainerView>
        <Container>
          {((!isMobile && !isTablet) || !rowSections) && !!items?.length && (
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
            {!loading &&
              items?.map((item, index) => (
                <>
                  {Component && <Component key={String(index)} {...item} />}
                  {rowSections && (
                    <Row key={String(index)} {...props} rowSections={true}>
                      {rowSections(item)?.map((Section, index2) => (
                        <MobileCardItem
                          key={String(index2) + String(index)}
                          columnSpan={columnSpans?.[index2]}
                        >
                          {isMobile || isTablet ? (
                            <MobileHeader>{header[index2]}</MobileHeader>
                          ) : null}
                          {Section}
                        </MobileCardItem>
                      ))}
                    </Row>
                  )}
                </>
              ))}
          </Body>
          {!loading && (!items || items?.length === 0) && (
            <EmptyRow {...props}>
              <p>Oops! Apparently no data here.</p>
            </EmptyRow>
          )}
        </Container>
      </ContainerView>
      {typeof scrollUp === 'boolean' && typeof totalPages === 'number' && (
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
