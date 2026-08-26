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
import { MdArrowDownward } from 'react-icons/md';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  HeaderSortButton,
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

export interface ITable<TCard = Record<string, never>> {
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
    | 'smartContracts'
    | 'smartContractsInvokes';

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
  refreshKey?: number;
  /**
   * Opt-in clickable column headers that switch the API sort field
   * (descending only). Labels must match `header` entries exactly.
   */
  sortableColumns?: string[];
  activeSortColumn?: string;
  onSortColumn?: (column: string) => void;
  /**
   * Opt-in replacement for the generic labeled card on mobile and tablet.
   * `item` is `any` for the same reason `rowSections` above is: this table
   * serves every list on the site and the row type differs per caller.
   */
  MobileCard?: React.ComponentType<{ item: any; index: number } & TCard>;
  /**
   * Extra props for MobileCard, on top of `item` and `index`. Passing them
   * here keeps the component type stable: a card built as a closure per
   * render remounts every row and restarts its animations mid-scroll. The
   * generic ties the two together, so a card whose props are missing from
   * the bag fails to compile rather than at render time.
   */
  mobileCardProps?: TCard;
  /**
   * Opt-in for tables whose rows are a single line: the loading placeholder
   * then draws one line per cell too, instead of the two-line default that
   * suits tables stacking a value over a label.
   */
  singleLineSkeleton?: boolean;
}

const onErrorHandler = () => {
  return {
    onError: (err: unknown): void => {
      console.error(err);
    },
    retry: 3,
  };
};

const Table = <TCard,>({
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
  refreshKey,
  sortableColumns,
  activeSortColumn,
  onSortColumn,
  MobileCard,
  mobileCardProps,
  singleLineSkeleton = false,
}: PropsWithChildren<ITable<TCard>>) => {
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

      return { items: [], totalPages: 0 };
    } catch (error) {
      // React Query rejects an undefined result outright ("data is
      // undefined") instead of storing it, so a failed request would land the
      // table in an error state; an empty page shows the empty state.
      console.error(error);
      return { items: [], totalPages: 0 };
    }
  };

  const {
    data: response,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: [
      dataName || 'items',
      JSON.stringify(router.query),
      router.pathname,
      refreshKey,
    ],

    queryFn: () =>
      tableRequest(
        Number(router.query?.page) || 1,
        Number(router.query?.limit) || 10,
      ),

    // Keep the current rows on screen while the next page loads. Swapping
    // them for placeholders and back made paging flicker.
    placeholderData: keepPreviousData,

    // A step out and back is a common move, and every list here costs a
    // round trip the API answers in about a second. Inside this window the
    // rows a reader just looked at are shown again without asking for them a
    // second time. A page load, a filter change and the refresh control all
    // bypass it, so nothing here can pin a stale list on screen.
    //
    // Only a list that actually has rows. `tableRequest` turns every failure
    // into an empty result and react-query files that as a success, so
    // without this an API that was briefly down would keep answering "no data
    // here" from cache for ten seconds instead of retrying on the next mount.
    staleTime: query =>
      (query.state.data as { items?: unknown[] } | undefined)?.items?.length
        ? 10_000
        : 0,

    ...onErrorHandler(),
  });

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
        <TableBody
          smaller={smaller}
          data-testid="table-body"
          $stale={isFetching && isPlaceholderData}
        >
          {/* The header stays while fetching: dropping it made the table lose
              its height and snap back once the rows arrived. */}
          {!isMobile &&
            !isTablet &&
            (isLoading || (response?.items && response.items.length !== 0)) && (
              <TableRow data-testid="table-header">
                {header?.map((item, index) => (
                  <HeaderItem
                    key={JSON.stringify(item)}
                    smaller={smaller}
                    totalColumns={header.length}
                    currentColumn={index}
                    dynamicWidth={rowSections(item)?.[index]?.width}
                    maxWidth={rowSections(item)?.[index]?.maxWidth}
                  >
                    {sortableColumns?.includes(item) && onSortColumn ? (
                      <HeaderSortButton
                        type="button"
                        $active={item === activeSortColumn}
                        onClick={() => onSortColumn(item)}
                        aria-label={
                          item === activeSortColumn
                            ? `Sorted by ${item}, descending`
                            : `Sort by ${item}, descending`
                        }
                      >
                        {item}
                        <MdArrowDownward size={12} />
                      </HeaderSortButton>
                    ) : (
                      item
                    )}
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
                            {!singleLineSkeleton && <Skeleton width="100%" />}
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

              if ((isMobile || isTablet) && MobileCard) {
                return (
                  <MobileCard
                    key={JSON.stringify(item)}
                    {...(mobileCardProps as TCard)}
                    item={item}
                    index={index}
                  />
                );
              }

              if (type === 'smartContracts' && (isMobile || isTablet)) {
                return (
                  <SmartContractCard
                    key={index}
                    name={item?.name}
                    timestamp={item?.timestamp}
                    contractAddress={item?.contractAddress}
                    deployer={item?.deployer}
                    deployTxHash={item?.deployTxHash}
                    totalTransactions={item?.totalTransactions}
                  />
                );
              }

              return (
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
                            <Element $smaller={smaller} />
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
