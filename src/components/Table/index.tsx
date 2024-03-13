import { useMobile } from '@/contexts/mobile';
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
  Body,
  ButtonsContainer,
  Container,
  ContainerView,
  EmptyRow,
  ExportContainer,
  ExportLabel,
  FloatContainer,
  Header,
  IoReloadSharpWrapper,
  ITableType,
  ItemContainer,
  LimitContainer,
  LimitText,
  MobileCardItem,
  MobileHeader,
  RetryContainer,
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
    <>
      {typeof scrollUp === 'boolean' &&
        typeof response?.totalPages === 'number' &&
        !!response?.items &&
        showLimit && (
          <FloatContainer>
            {dataName === 'transactions' && (
              <ExportContainer>
                <ExportLabel>
                  <Tooltip
                    msg="Current filters will be applied."
                    Component={() => (
                      <div style={{ cursor: 'help' }}>Export</div>
                    )}
                  />
                </ExportLabel>
                <ButtonsContainer>
                  <ExportButton
                    items={response?.items}
                    tableRequest={tableRequest}
                    totalRecords={response?.totalPages * limit || 10000}
                  />
                  {/* <ExportButton>
                    <VscJson size={25} />
                  </ExportButton> */}
                </ButtonsContainer>
              </ExportContainer>
            )}
            <LimitContainer>
              <span>Per page</span>
              <LimitText>
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
              </LimitText>
              <IoReloadSharpWrapper $loading={isFetching}>
                <Tooltip
                  msg="Refresh"
                  customStyles={{ delayShow: 800 }}
                  Component={() => (
                    <IoReloadSharp size={20} onClick={() => refetch()} />
                  )}
                ></Tooltip>
              </IoReloadSharpWrapper>
            </LimitContainer>
          </FloatContainer>
        )}
      <ContainerView>
        <Container>
          {((!isMobile && !isTablet) || !rowSections) &&
            !!response?.items?.length && (
              <Header {...props} key={String(header)}>
                {header.map((item, index) => {
                  return <span key={JSON.stringify(item)}>{item}</span>;
                })}
              </Header>
            )}
          <Body {...props} data-testid="table-body" autoUpdate={!!interval}>
            {isLoading && (
              <>
                {Array(limit)
                  .fill(limit)
                  .map((_, index) => (
                    <Row key={String(index)} {...props}>
                      {header.map((item, index2) => (
                        <span key={JSON.stringify(item) + String(index2)}>
                          <Skeleton width="100%" />
                        </span>
                      ))}
                    </Row>
                  ))}
              </>
            )}
            {response?.items &&
              response?.items?.length > 0 &&
              response?.items?.map((item: any, index: number) => {
                let spanCount = 0;
                return (
                  <React.Fragment key={JSON.stringify(item) + String(index)}>
                    {rowSections && (
                      <Row
                        key={JSON.stringify(item) + String(index)}
                        {...props}
                        rowSections={true}
                      >
                        {rowSections(item)?.map(({ element, span }, index2) => {
                          const [updatedSpanCount, isRightAligned] =
                            processRowSectionsLayout(spanCount, span);
                          spanCount = updatedSpanCount;
                          return (
                            <MobileCardItem
                              isAssets={
                                type === 'assets' || type === 'proposals'
                              }
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
        </Container>
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
    </>
  );
};

export default Table;
