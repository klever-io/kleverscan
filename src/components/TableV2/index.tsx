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
// import { VscJson } from 'react-icons/vsc';
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
  ITableType,
  ItemContainer,
  LimitContainer,
  LimitItems,
  MobileCardItem,
  MobileHeader,
  RetryContainer,
  TableBody,
  TableContainer,
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
  rowSections?: (item: any) => IRowSection[] | undefined;
  scrollUp?: boolean;
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
  scrollUp,
  dataName,
  interval,
  intervalController,
  showLimit = true,
  Filters,
}) => {
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();
  const limits = [5, 10, 50, 100];
  const [scrollTop, setScrollTop] = useState<boolean>(false);

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
      // setPage(1);
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

  const props: ITableType = {
    type,
    pathname: router.pathname,
    haveData: response?.items?.length,
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY > 100);
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
    window.scrollTo(0, 0);
  };

  return (
    <TableContainer>
      <FloatContainer>
        {Filters && <Filters />}
        <LimitContainer>
          <span>Items Per page</span>
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

        <ExportContainer>
          <Tooltip
            msg="Refresh"
            Component={() => (
              <IoReloadSharpWrapper $loading={isFetching}>
                <IoReloadSharp size={20} onClick={() => refetch()} />
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
      <ContainerView>
        <TableBody cols={header.length}>
          {((!isMobile && !isTablet) || !rowSections) &&
            header.map((item, index) => {
              return <HeaderItem key={JSON.stringify(item)}>{item}</HeaderItem>;
            })}
          {isLoading && (
            <>
              {Array(limit)
                .fill(limit)
                .map((_, index) =>
                  header.map((item, index2) => (
                    <MobileCardItem
                      isAssets={type === 'assets' || type === 'proposals'}
                      isRightAligned={isMobile || isTablet}
                      key={String(index2) + String(index)}
                      columnSpan={1}
                      isLastRow={index === limit - 1}
                    >
                      <DoubleRow>
                        {type === 'transactions' && <Skeleton width="100%" />}
                        <Skeleton width="100%" />
                      </DoubleRow>
                    </MobileCardItem>
                  )),
                )}
            </>
          )}
          {response?.items &&
            response?.items?.length > 0 &&
            response?.items?.map((item: any, index: number) => {
              let spanCount = 0;
              const isLastRow = index === response?.items?.length - 1;

              return (
                rowSections &&
                rowSections(item)?.map(({ element, span }, index2) => {
                  const [updatedSpanCount, isRightAligned] =
                    processRowSectionsLayout(spanCount, span);
                  spanCount = updatedSpanCount;

                  return (
                    <MobileCardItem
                      isAssets={type === 'assets' || type === 'proposals'}
                      isRightAligned={(isMobile || isTablet) && isRightAligned}
                      key={String(index2) + String(index)}
                      columnSpan={span}
                      isLastRow={isLastRow}
                    >
                      {isMobile || isTablet ? (
                        <MobileHeader>{header[index2]}</MobileHeader>
                      ) : null}
                      {element}
                    </MobileCardItem>
                  );
                })
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
      {typeof scrollUp === 'boolean' &&
        typeof response?.totalPages === 'number' &&
        response?.totalPages > 1 && (
          <PaginationContainer>
            <Pagination
              scrollUp={scrollUp}
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
