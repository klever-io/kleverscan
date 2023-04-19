import { useMobile } from '@/contexts/mobile';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { exportToCsv } from '@/utils/promiseFunctions';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { IoReloadSharp } from 'react-icons/io5';
import { TbTableExport } from 'react-icons/tb';
import { Loader } from '../Loader/styles';
// import { VscJson } from 'react-icons/vsc';
import Pagination from '../Pagination';
import { PaginationContainer } from '../Pagination/styles';
import Skeleton from '../Skeleton';
import Tooltip from '../Tooltip';
import {
  BackTopButton,
  Body,
  ButtonsContainer,
  Container,
  ContainerView,
  EmptyRow,
  ExportButton,
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
    | 'validatorsList';

  header: string[];
  rowSections?: (item: any) => IRowSection[] | undefined;
  scrollUp?: boolean;
  totalPages?: number;
  dataName?: string;
  request?: (page: number, limit: number) => Promise<IPaginatedResponse>;
  interval?: number;
  intervalController?: React.Dispatch<React.SetStateAction<number>>;
}

const Table: React.FC<ITable> = ({
  type,
  header,
  rowSections,
  request,
  scrollUp,
  totalPages: defaultTotalPages,
  dataName,
  interval,
  intervalController,
}) => {
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();
  const [loading, setLoading] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(defaultTotalPages);
  const [limit, setLimit] = useState<number>(10);
  const [items, setItems] = useState([]);
  const limits = [5, 10, 50, 100];
  const [scrollTop, setScrollTop] = useState<boolean>(false);

  const props: ITableType = {
    type,
    pathname: router.pathname,
    haveData: items?.length,
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

  const fetchData = useCallback(async () => {
    if (request && dataName) {
      if (!interval) {
        setLoading(true);
      }
      const response = await request(page, limit);
      if (!response.error) {
        setItems(response.data[dataName]);
        setTotalPages(response?.pagination?.totalPages || 1);
      } else {
        setPage(1);
        setItems([]);
      }
    }
    setLoading(false);
  }, [page, limit, request, dataName]);

  useDidUpdateEffect(() => {
    if (page !== 1 && intervalController) {
      intervalController(0);
    }
    setLoading(true);
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [limit]);

  useDidUpdateEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (page !== 1) {
      setPage(1);
    }
    setLoading(true);
    fetchData();
  }, [router.query, router.isReady]);

  useEffect(() => {
    if (interval) {
      setLoading(true);
      const intervalId = setInterval(() => {
        fetchData();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, limit]);

  const handleClickCsv = async () => {
    setLoadingCsv(true);
    await exportToCsv('transactions', items, router);
    setLoadingCsv(false);
  };

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      {typeof scrollUp === 'boolean' &&
        typeof totalPages === 'number' &&
        !!items && (
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
                    onClick={() => {
                      handleClickCsv();
                    }}
                  >
                    <Tooltip
                      msg="CSV"
                      Component={() =>
                        loadingCsv ? <Loader /> : <TbTableExport size={25} />
                      }
                    />
                  </ExportButton>
                  {/* <ExportButton>
                    <VscJson size={25} />
                  </ExportButton> */}
                </ButtonsContainer>
              </ExportContainer>
            )}
            <IoReloadSharpWrapper onClick={() => fetchData()} loading={loading}>
              <Tooltip
                msg="Refresh"
                customStyles={{ delayShow: 800 }}
                Component={() => <IoReloadSharp size={32} />}
              ></Tooltip>
            </IoReloadSharpWrapper>
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
              {header.map((item, index) => {
                return <span key={JSON.stringify(item)}>{item}</span>;
              })}
            </Header>
          )}
          <Body {...props} data-testid="table-body" autoUpdate={!!interval}>
            {loading && (
              <>
                {Array(limit)
                  .fill(limit)
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
              items &&
              items?.length > 0 &&
              items?.map((item, index) => {
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

          {!loading && (!items || items?.length === 0) && (
            <>
              <RetryContainer onClick={() => fetchData()} loading={loading}>
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
