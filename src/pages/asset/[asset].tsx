import { Receive } from '@/assets/icons';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import QrCodeModal from '@/components/QrCodeModal';
import Tabs, { ITabs } from '@/components/Tabs';
import Holders from '@/components/Tabs/Holders';
import Transactions from '@/components/Tabs/Transactions';
import api from '@/services/api';
import {
  IAccountAsset,
  IAsset,
  IBalance,
  IPagination,
  IResponse,
  ITransaction,
} from '@/types/index';
import {
  parseHardCodedInfo,
  parseHolders,
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
  VerifiedContainer,
} from '@/views/assets/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  totalTransactionsPage: number;
  totalHoldersPage: number;
  holders: IBalance[];
  totalRecords: number;
  page: number;
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
  holders,
  totalHoldersPage,
  totalTransactionsPage,
  totalRecords,
  page,
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

  const cardHeaders = uris
    ? ['Overview', 'More', 'URIS']
    : ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [showModal, setShowModal] = useState(false);

  const requestTransactions = async (page: number) => {
    const query = dateFilter.start
      ? {
          limit: 5,
          asset: asset.assetId,
          startdate: dateFilter.start ? dateFilter.start : undefined,
          enddate: dateFilter.end ? dateFilter.end : undefined,
        }
      : {
          limit: 5,
          asset: asset.assetId,
        };

    const res = await api.get({
      route: `transaction/list`,
      query: { page, ...query },
    });
    return res;
  };

  const requestAssetHolders = async (page: number) => {
    const response = await api.get({
      route: `assets/holders/${asset.assetId}?page=${page}`,
    });

    let parsedHolders: IBalance[] = [];
    if (!response.error) {
      const holders = response.data.accounts;
      parsedHolders = parseHolders(holders, asset.assetId, response.pagination);
    }

    return { ...response, data: { accounts: parsedHolders } };
  };

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

  const transactionsTableProps = {
    scrollUp: false,
    totalPages: totalTransactionsPage,
    dataName: 'transactions',
    request: (page: number) => requestTransactions(page),
    query: dateFilter,
  };

  const holdersTableProps = {
    scrollUp: false,
    totalPages: totalHoldersPage,
    dataName: 'accounts',
    request: (page: number) => requestAssetHolders(page),
    page,
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return (
          <Transactions
            transactions={defaultTransactions}
            precision={precision}
            transactionsTableProps={transactionsTableProps}
          />
        );
      case 'Holders':
        return (
          <Holders
            asset={asset}
            holders={holders}
            holdersTableProps={holdersTableProps}
          />
        );
      default:
        return <div />;
    }
  };
  const resetDate = () => {
    setDateFilter({
      start: '',
      end: '',
    });
  };

  const filterDate = (selectedDays: ISelectedDays) => {
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };

  const dateFilterProps = {
    resetDate,
    filterDate,
    empty: defaultTransactions.length === 0,
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
    dateFilterProps,
  };

  const isVerified = useCallback(() => {
    if (verified) {
      return <VerifiedContainer />;
    }
  }, [verified]);

  return (
    <Container>
      <Header>
        <Title
          Component={() => (
            <>
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
            </>
          )}
          route={'/assets'}
        />

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
    page: 1,
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
        route: `transaction/list?asset=${assetId}&limit=5`,
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

            const unparsedHolders = holders?.data?.accounts || [];

            props.holders = parseHolders(
              unparsedHolders,
              props?.asset?.assetId,
              holders.pagination,
            );
            props.totalHoldersPage = holders?.pagination?.totalPages || 1;
            props.totalRecords = holders?.pagination?.totalRecords || 1;
            props.page = holders?.pagination?.self || 1;
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

  if (props.asset.assetId === 'LMNFT-SM99') {
    props.asset.uris = {
      discord: '',
      facebook: 'https://facebook.com/LoveMonsterNFT',
      instagram: 'https://instagram.com/LoveMonsterNFT',
      medium: '',
      metadata:
        'https://klever-mint.mypinata.cloud/ipfs/QmNaa2KQ6NkjjESpPHEnAow9hivnsAkq2Gd6R26cHG28Er',
      metadataExtension: 'png',
      metadataImage:
        'https://klever-mint.mypinata.cloud/ipfs/QmWVmUDPBeQzv6fG93JxQxFVee8b6smFD3RQosQXJHiZTJ',
      telegram: 'https://t.me/LoveMonsterNFT',
      twitter: 'https://twitter.com/LoveMonsterNFT',
      website: 'https://lovemonsternft.com',
    };
  }

  return { props };
};

export default Asset;
