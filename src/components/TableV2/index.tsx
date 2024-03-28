import { useMobile } from '@/contexts/mobile';
import { DoubleRow } from '@/styles/common';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { useDidUpdateEffect } from '@/utils/hooks';
import { processRowSectionsLayout } from '@/utils/table';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import Pagination from '../Pagination';
import { PaginationContainer } from '../Pagination/styles';
import Skeleton from '../Skeleton';
import Tooltip from '../Tooltip';
import ExportButton from './ExportButton';
import {
  BackTopButton,
  ContainerView,
  EmptyRow,
  ExportContainer,
  FloatContainer,
  HeaderItem,
  IoReloadSharpWrapper,
  ItemContainer,
  LimitContainer,
  LimitItems,
  MobileCardItem,
  MobileHeader,
  RetryContainer,
  TableBody,
  TableContainer,
  TableRow,
  TableRowProps,
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
    | 'validatorsList'
    | 'rewards'
    | 'marketplaces'
    | 'launchPad';

  header: string[];
  rowSections?: (item: any) => IRowSection[];
  dataName?: string;
  request: (page: number, limit: number) => Promise<IPaginatedResponse>;
  interval?: number;
  intervalController?: React.Dispatch<React.SetStateAction<number>>;
  showLimit?: boolean;
  Filters?: React.FC;
}

const onErrorHandler = () => {
  return {
    onError: (err: unknown): void => {
      console.error(err);
    },
    retry: 3,
  };
};

const Table: React.FC<ITable> = ({
  type,
  header,
  rowSections,
  request,
  dataName,
  interval,
  intervalController,
  Filters,
  showLimit = true,
}) => {
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();
  const limits = [5, 10, 50, 100];
  const [scrollTop, setScrollTop] = useState<boolean>(false);

  const tableRef = React.useRef<HTMLDivElement>(null);

  const page = Number(router.query?.page) || 1;
  const limit = Number(router.query?.limit) || 10;

  const tableRequest = async (page: number, limit: number): Promise<any> => {
    let responseFormatted = {};
    try {
      const response = await request(page, limit);
      if (!response.error && dataName) {
        responseFormatted = {
          items: response.data[dataName],
          totalPages: response?.pagination?.totalPages,
        };
        return responseFormatted;
      }

      return [];
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [dataName || 'items', JSON.stringify(router.query), router.pathname],
    () =>
      tableRequest(
        Number(router.query?.page) || 1,
        Number(router.query?.limit) || 10,
      ),
    onErrorHandler(),
  );

  const props: TableRowProps = {
    pathname: router.pathname,
    haveData: response?.items?.length,
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY > (tableRef.current?.offsetTop || 100));
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useDidUpdateEffect(() => {
    if (page !== 1 && intervalController) {
      intervalController(0);
    }
    refetch();
  }, [page]);

  useEffect(() => {
    if (interval) {
      const intervalId = setInterval(() => {
        refetch();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, limit]);

  const handleScrollTop = () => {
    window.scrollTo({
      top: (tableRef.current?.offsetTop || 100) - 100,
    });
  };

  return (
    <TableContainer>
      <FloatContainer>
        {Filters && <Filters />}
        {showLimit ? (
          <LimitContainer>
            <span>Items per page</span>
            <LimitItems>
              {limits.map(value => (
                <ItemContainer
                  key={value}
                  onClick={() => {
                    setQueryAndRouter(
                      { ...router.query, limit: value.toString(), page: '1' },
                      router,
                    );
                    refetch();
                  }}
                  active={value === (Number(router.query?.limit) || limit)}
                >
                  {value}
                </ItemContainer>
              ))}
            </LimitItems>
          </LimitContainer>
        ) : null}

        <ExportContainer>
          <Tooltip
            msg="Refresh"
            Component={() => (
              <IoReloadSharpWrapper $loading={isFetching}>
                <IoReloadSharp size={22} onClick={() => refetch()} />
              </IoReloadSharpWrapper>
            )}
          />

          {dataName === 'transactions' && (
            <ExportButton
              items={response?.items}
              tableRequest={tableRequest}
              totalRecords={response?.totalPages * limit || 10000}
            />
          )}
        </ExportContainer>
      </FloatContainer>
      <ContainerView ref={tableRef}>
        <TableBody>
          {isLoading && (
            <>
              {Array(limit)
                .fill(limit)
                .map((_, index) => (
                  <TableRow key={String(index)}>
                    {header.map((item, index2) => (
                      <MobileCardItem
                        isAssets={type === 'assets' || type === 'proposals'}
                        isRightAligned={isMobile || isTablet}
                        key={String(index2) + String(index)}
                        columnSpan={2}
                        isLastRow={index === limit - 1}
                      >
                        <DoubleRow>
                          {type === 'transactions' && <Skeleton width="100%" />}
                          <Skeleton width="100%" />
                        </DoubleRow>
                      </MobileCardItem>
                    ))}
                  </TableRow>
                ))}
            </>
          )}

          {!isMobile && !isTablet && rowSections && (
            <TableRow>
              {header.map((item, index) => (
                <HeaderItem key={JSON.stringify(item)}>{item}</HeaderItem>
              ))}
            </TableRow>
          )}
          {response?.items &&
            response?.items?.length > 0 &&
            response?.items?.map((item: any, index: number) => {
              let spanCount = 0;
              const isLastRow = index === response?.items?.length - 1;

              return (
                <TableRow
                  key={JSON.stringify(item) + String(index)}
                  {...props}
                  rowSections={true}
                >
                  {rowSections &&
                    rowSections(item)?.map(({ element, span }, index2) => {
                      const [updatedSpanCount, isRightAligned] =
                        processRowSectionsLayout(spanCount, span);
                      spanCount = updatedSpanCount;
                      const isLastItem =
                        rowSections(item)?.length &&
                        index2 === rowSections(item).length - 1;
                      let itemWidth =
                        tableRef.current?.offsetWidth &&
                        (tableRef.current?.offsetWidth - 32) / header.length;
                      if (itemWidth && itemWidth > 236) {
                        itemWidth = 236;
                      }
                      if (isLastItem) {
                        itemWidth =
                          tableRef.current?.offsetWidth &&
                          tableRef.current?.offsetWidth -
                            32 -
                            (itemWidth || 0) * (header.length - 1);
                      }

                      return (
                        <MobileCardItem
                          isAssets={type === 'assets' || type === 'proposals'}
                          isRightAligned={
                            (isMobile || isTablet) && isRightAligned
                          }
                          key={String(index2) + String(index)}
                          columnSpan={span}
                          isLastRow={isLastRow}
                          dynamicWidth={itemWidth}
                        >
                          {isMobile || isTablet ? (
                            <MobileHeader>{header[index2]}</MobileHeader>
                          ) : null}
                          {element}
                        </MobileCardItem>
                      );
                    })}
                </TableRow>
              );
            })}

          {!isFetching && (!response?.items || response?.items?.length === 0) && (
            <>
              <RetryContainer onClick={() => refetch()} $loading={isFetching}>
                <span>Retry</span>
                <IoReloadSharp size={20} />
              </RetryContainer>
              <EmptyRow {...props}>
                <p>Oops! Apparently no data here.</p>
              </EmptyRow>
            </>
          )}
        </TableBody>
        <BackTopButton onClick={handleScrollTop} isHidden={scrollTop}>
          <BsFillArrowUpCircleFill />
        </BackTopButton>
      </ContainerView>
      {typeof response?.totalPages === 'number' && response?.totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            tableRef={tableRef}
            count={response?.totalPages}
            page={Number(router.query?.page) || page}
            onPaginate={page => {
              setQueryAndRouter(
                { ...router.query, page: page.toString() },
                router,
              );
            }}
          />
        </PaginationContainer>
      )}
    </TableContainer>
  );
};

export default Table;
