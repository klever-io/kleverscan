import { PropsWithChildren } from 'react';
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
  TableEmptyData,
} from './styles';
import SmartContractCard from '../SmartContracts/SmartContractCard';

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
    | 'launchPad'
    | 'smartContracts';

  header: string[];
  rowSections: (item: any) => IRowSection[];
  dataName?: string;
  request: (page: number, limit: number) => Promise<IPaginatedResponse>;
  interval?: number;
  intervalController?: React.Dispatch<React.SetStateAction<number>>;
  showLimit?: boolean;
  Filters?: React.FC;
  smaller?: boolean;
  showPagination?: boolean;
}

const onErrorHandler = () => {
  return {
    onError: (err: unknown): void => {
      console.error(err);
    },
    retry: 3,
  };
};

const Table: React.FC<PropsWithChildren<ITable>> = ({
  type,
  header,
  rowSections,
  request,
  dataName,
  interval,
  intervalController,
  Filters,
  smaller = false,
  showLimit = true,
  showPagination = true,
}) => {
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();
  const limits = [10, 20, 50];
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
      {(showLimit || Filters) && (
        <FloatContainer>
          {Filters && <Filters />}
          {showLimit ? (
            <>
              <LimitContainer>
                <span>Items per page</span>
                <LimitItems>
                  {limits?.map(value => (
                    <ItemContainer
                      key={value}
                      onClick={() => {
                        setQueryAndRouter(
                          {
                            ...router.query,
                            limit: value.toString(),
                            page: '1',
                          },
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
            </>
          ) : null}
        </FloatContainer>
      )}
      <ContainerView ref={tableRef}>
        <TableBody smaller={smaller} data-testid="table-body">
          {!isMobile &&
            !isTablet &&
            response?.items &&
            response?.items.length !== 0 && (
              <TableRow>
                {header?.map((item, index) => (
                  <HeaderItem
                    key={JSON.stringify(item)}
                    smaller={smaller}
                    totalColumns={header.length}
                    currentColumn={index}
                    dynamicWidth={rowSections(item)?.[index]?.width}
                    maxWidth={rowSections(item)?.[index]?.maxWidth}
                  >
                    {item}
                  </HeaderItem>
                ))}
              </TableRow>
            )}

          {isLoading && (
            <>
              {Array(limit)
                .fill(limit)
                .map((_, index) => (
                  <TableRow key={String(index)}>
                    {header?.map((item, index2) => {
                      return (
                        <MobileCardItem
                          isAssets={type === 'assets' || type === 'proposals'}
                          isRightAligned={isMobile || isTablet}
                          key={String(index2) + String(index)}
                          columnSpan={2}
                          isLastRow={index === limit - 1}
                          dynamicWidth={rowSections(item)?.[index2]?.width}
                          maxWidth={rowSections(item)?.[index2]?.maxWidth}
                          smaller={smaller}
                        >
                          <DoubleRow {...props}>
                            {type !== 'accounts' && <Skeleton width="100%" />}
                            <Skeleton width="100%" />
                          </DoubleRow>
                        </MobileCardItem>
                      );
                    })}
                  </TableRow>
                ))}
            </>
          )}
          {response?.items &&
            response?.items?.length > 0 &&
            response?.items?.map((item: any, index: number) => {
              let spanCount = 0;
              const isLastRow = index === response?.items?.length - 1;

              return type === 'smartContracts' && (isMobile || isTablet) ? (
                <SmartContractCard
                  key={index}
                  name={item?.name}
                  timestamp={item?.timestamp}
                  contractAddress={item?.contractAddress}
                  deployer={item?.deployer}
                  deployTxHash={item?.deployTxHash}
                  totalTransactions={item?.totalTransactions}
                />
              ) : (
                <TableRow
                  key={JSON.stringify(item)}
                  {...props}
                  rowSections={true}
                >
                  {rowSections &&
                    rowSections(item)?.map(
                      ({ element: Element, span, width, maxWidth }, index2) => {
                        const [updatedSpanCount, isRightAligned] =
                          processRowSectionsLayout(spanCount, span);
                        spanCount = updatedSpanCount;

                        return (
                          <MobileCardItem
                            isAssets={type === 'assets' || type === 'proposals'}
                            isRightAligned={
                              (isMobile || isTablet) && isRightAligned
                            }
                            key={String(index2) + String(index)}
                            columnSpan={span}
                            isLastRow={isLastRow}
                            dynamicWidth={width}
                            maxWidth={maxWidth}
                            smaller={smaller}
                            totalColumns={header.length}
                            currentColumn={index2}
                            data-testid={`table-row-${index}`}
                          >
                            {isMobile || isTablet ? (
                              <MobileHeader>{header[index2]}</MobileHeader>
                            ) : null}
                            {Element({
                              $smaller: smaller,
                            })}
                          </MobileCardItem>
                        );
                      },
                    )}
                </TableRow>
              );
            })}

          {!isFetching &&
            (!response?.items || response?.items?.length === 0) && (
              <TableEmptyData>
                <RetryContainer onClick={() => refetch()} $loading={isFetching}>
                  <span>Retry</span>
                  <IoReloadSharp size={20} />
                </RetryContainer>
                <EmptyRow {...props} data-testid="table-empty">
                  <p>Oops! Apparently no data here.</p>
                </EmptyRow>
              </TableEmptyData>
            )}
        </TableBody>
        <BackTopButton onClick={handleScrollTop} isHidden={scrollTop}>
          <BsFillArrowUpCircleFill />
        </BackTopButton>
      </ContainerView>
      {showPagination &&
        typeof response?.totalPages === 'number' &&
        response?.totalPages > 1 && (
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
