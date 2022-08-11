import { ArrowLeft, Certified, Receive } from '@/assets/icons';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import AssetLogo from '@/components/Logo/AssetLogo';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import QrCodeModal from '@/components/QrCodeModal';
import Tabs, { ITabs } from '@/components/Tabs';
import Holders from '@/components/Tabs/Holders';
import Transactions from '@/components/Tabs/Transactions';
import api from '@/services/api';
import {
  IAccountAsset,
  IAsset,
  IPagination,
  IResponse,
  ITransaction,
} from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import {
  parseHardCodedInfo,
  timestampToDate,
  toLocaleFixed,
} from '@/utils/index';
import {
  AssetTitle,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  CenteredRow,
  Container,
  Header,
  HoverAnchor,
  Input,
  LetterLogo,
  Logo,
  Row,
  Title,
} from '@/views/assets/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  totalTransactionsPage: number;
  totalHoldersPage: number;
  holders: IAccountAsset[];
  totalRecords: number;
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

interface IHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Asset: React.FC<IAssetPage> = ({
  asset,
  transactions: defaultTransactions,
  totalTransactions,
  holders: defaultHolders,
  totalHoldersPage,
  totalTransactionsPage: defaultTotalTransactionsPage,
  totalRecords,
}) => {
  const {
    name,
    logo,
    ticker,
    uris,
    assetId,
    assetType,
    issueDate,
    ownerAddress,
    precision,
    maxSupply,
    initialSupply,
    circulatingSupply,
    burnedValue,
    staking,
    properties,
    attributes,
    verified,
  } = asset;

  const router = useRouter();
  const cardHeaders = uris
    ? ['Overview', 'More', 'URIS']
    : ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const [transactionsPage, setTransactionsPage] = useState(1);
  const [totalTransactionsPage, setTotalTransactionsPage] = useState(
    defaultTotalTransactionsPage,
  );
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [holdersPage, setHoldersPage] = useState(1);
  const [holders, setHolders] = useState(defaultHolders);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingHolders, setLoadingHolders] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useDidUpdateEffect(() => {
    setLoadingTransactions(true);
    const fetchData = async () => {
      setLoadingTransactions(true);

      const query = dateFilter.start
        ? {
            page: transactionsPage,
            asset: asset.assetId,
            startdate: dateFilter.start ? dateFilter.start : undefined,
            enddate: dateFilter.end ? dateFilter.end : undefined,
          }
        : {
            page: transactionsPage,
            asset: asset.assetId,
          };

      const response: ITransactionResponse = await api.get({
        route: `transaction/list`,
        query,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
        setTotalTransactionsPage(response.pagination.totalPages);
        setLoadingTransactions(false);
      }
    };

    fetchData();
  }, [transactionsPage, dateFilter]);

  useDidUpdateEffect(() => {
    setLoadingHolders(true);
    const fetchData = async () => {
      const response: IHoldersResponse = await api.get({
        route: `assets/holders/${asset.assetId}?page=${holdersPage}`,
      });
      if (!response.error) {
        setHolders(response.data.accounts);
        setLoadingHolders(false);
      }
    };

    fetchData();
  }, [holdersPage]);

  const getIssueDate = useCallback(() => {
    if (issueDate) {
      return timestampToDate(issueDate);
    }

    return '--';
  }, [issueDate]);

  const Overview: React.FC = () => {
    return (
      <>
        {ownerAddress && (
          <Row>
            <span>
              <strong>Owner</strong>
            </span>

            <span>
              <CenteredRow>
                <Link href={`/account/${ownerAddress}`}>
                  <HoverAnchor>{ownerAddress}</HoverAnchor>
                </Link>
                <Copy data={ownerAddress} info="ownerAddress" />
                <ReceiveBackground>
                  <Receive onClick={() => setShowModal(!showModal)} />
                  <QrCodeModal
                    show={showModal}
                    setShowModal={() => setShowModal(false)}
                    value={ownerAddress}
                    onClose={() => setShowModal(false)}
                  />
                </ReceiveBackground>
              </CenteredRow>
            </span>
          </Row>
        )}
        <Row>
          <span>
            <strong>Max Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(maxSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(initialSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Circulating Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(circulatingSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Burned Value</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(burnedValue / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Total Staked</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(
                (staking?.totalStaked || 0) / 10 ** precision,
                precision,
              )}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Holders</strong>
          </span>
          <span>{totalRecords}</span>
        </Row>
        <Row>
          <span>
            <strong>Transactions</strong>
          </span>
          <span>{totalTransactions}</span>
        </Row>
        <Row>
          <span>
            <strong>Market Cap</strong>
          </span>
          <span>--</span>
        </Row>
      </>
    );
  };

  const UriComponent: React.FC = () => {
    return (
      <>
        {Object.entries(uris).map(([key, value]: [string, any]) => (
          <Row key={String(key)}>
            <span>
              <strong>{key}</strong>
            </span>
            <a href={`${value}`} target="blank">
              {value}
            </a>
          </Row>
        ))}
      </>
    );
  };

  const More: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>{getIssueDate()}</span>
        </Row>
        <Row>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>{ownerAddress ? ownerAddress : '--'}</span>
          <CenteredRow>
            <Copy data={ownerAddress} info="Issue" />
          </CenteredRow>
        </Row>
        <Row>
          <span>
            <strong>Precision</strong>
          </span>
          <span>{precision}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Freeze</strong>
          </span>
          <span>{String(properties.canFreeze)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Wipe</strong>
          </span>
          <span>{String(properties.canWipe)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Pause</strong>
          </span>
          <span>{String(properties.canPause)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Mint</strong>
          </span>
          <span>{String(properties.canMint)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Burn</strong>
          </span>
          <span>{String(properties.canBurn)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Change Owner</strong>
          </span>
          <span>{String(properties.canChangeOwner)}</span>
        </Row>
        <Row>
          <span>
            <strong>Can Add Roles</strong>
          </span>
          <span>{String(properties.canAddRoles)}</span>
        </Row>
        <Row>
          <span>
            <strong>Paused</strong>
          </span>
          <span>{String(attributes.isPaused)}</span>
        </Row>
        <Row>
          <span>
            <strong>NFT Mint Stopped</strong>
          </span>
          <span>{String(attributes.isNFTMintStopped)}</span>
        </Row>
      </>
    );
  };

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case 'Overview':
        return <Overview />;
      case 'More':
        return <More />;
      case 'URIS':
        return <UriComponent />;
      default:
        return <div />;
    }
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return (
          <>
            <Transactions
              transactions={transactions}
              precision={precision}
              loading={loadingTransactions}
            />
            <PaginationContainer>
              <Pagination
                scrollUp={false}
                count={totalTransactionsPage}
                page={transactionsPage}
                onPaginate={page => {
                  setTransactionsPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      case 'Holders':
        return (
          <>
            <Holders asset={asset} holders={holders} loading={loadingHolders} />
            <PaginationContainer>
              <Pagination
                scrollUp={false}
                count={totalHoldersPage}
                page={holdersPage}
                onPaginate={page => {
                  setHoldersPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      default:
        return <div />;
    }
  };
  const resetDate = () => {
    setTransactionsPage(1);
    setDateFilter({
      start: '',
      end: '',
    });
  };

  const filterDate = (selectedDays: ISelectedDays) => {
    setTransactionsPage(1);
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
    dateFilterProps: {
      resetDate,
      filterDate,
      empty: transactions.length === 0,
    },
  };

  const isVerified = useCallback(() => {
    if (verified) {
      return <Certified className="isVerified" />;
    }
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/assets')}>
            <ArrowLeft />
          </div>
          <AssetLogo
            LetterLogo={LetterLogo}
            isVerified={isVerified}
            Logo={Logo}
            logo={logo}
            ticker={ticker}
            name={name}
          />
          <AssetTitle>
            <h1>
              {name} ({assetId})
            </h1>
            <div>{assetType}</div>
          </AssetTitle>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => setSelectedCard(header)}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardContainer>

      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAssetPage> = async ({
  params,
}) => {
  const props: IAssetPage = {
    asset: {} as IAsset,
    transactions: [],
    totalTransactions: 0,
    totalHoldersPage: 0,
    totalTransactionsPage: 0,
    holders: [],
    totalRecords: 0,
  };

  const redirectProps = { redirect: { destination: '/404', permanent: false } };
  let assetNotFound = false;

  const assetId = params?.asset;

  const assetCall = new Promise<IAssetResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: `assets/${assetId}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  const transactionCall = new Promise<ITransactionResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: `transaction/list?asset=${assetId}`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  const holdersCall = new Promise<IHoldersResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: `assets/holders/${assetId}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  await Promise.allSettled([assetCall, transactionCall, holdersCall]).then(
    responses => {
      responses.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          if (index === 0) {
            const asset: any = res.value;
            props.asset = parseHardCodedInfo([asset.data.asset])[0];
          } else if (index === 1) {
            const transactions: any = res.value;

            props.transactions = transactions?.data?.transactions;
            props.totalTransactions = transactions?.pagination?.totalRecords;
            props.totalTransactionsPage = transactions?.pagination?.totalPages;
          } else if (index === 2) {
            const holders: any = res.value;

            props.holders = holders?.data?.accounts || 0;
            props.totalHoldersPage = holders?.pagination?.totalPages || 0;
            props.totalRecords = holders?.pagination?.totalRecords || 0;
          }
        } else if (index == 0) {
          assetNotFound = true;
        }
      });
    },
  );

  if (assetNotFound) {
    return redirectProps;
  }

  return { props };
};

export default Asset;
