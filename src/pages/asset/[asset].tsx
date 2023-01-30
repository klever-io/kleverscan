import { Receive } from '@/assets/icons';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import QrCodeModal from '@/components/QrCodeModal';
import { EmptyRow } from '@/components/Table/styles';
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
  IUri,
} from '@/types/index';
import {
  filterDate,
  formatDate,
  parseHardCodedInfo,
  parseHolders,
  resetDate,
  timestampToDate,
  toLocaleFixed,
} from '@/utils/index';
import {
  AssetHeaderContainer,
  AssetTitle,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  CenteredRow,
  Container,
  ContentRow,
  ContentScrollBar,
  FrozenContainer,
  Header,
  HoverAnchor,
  Input,
  LetterLogo,
  Logo,
  Row,
  UriContainer,
  VerifiedContainer,
} from '@/views/assets/detail';
import { BalanceContainer, RowContent } from '@/views/proposals/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
    royalties,
  } = asset;

  let uris = {};

  if (asset.uris && asset.uris.length > 0) {
    (asset.uris as IUri[]).forEach(uri => {
      uris = {
        ...uris,
        [uri.key]: uri.value,
      };
    });
  }

  const cardHeaders = uris
    ? ['Overview', 'More', 'URIS', 'Staking & Royalties']
    : ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const router = useRouter();

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);
  const [query, setQuery] = useState(router.query);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  }, [query]);

  const requestTransactions = async (page: number, limit: number) => {
    const newQuery = { ...query, asset: asset.assetId };
    return await api.get({
      route: `transaction/list`,
      query: { page, limit, ...newQuery },
    });
  };

  const filterQueryDate = (selectedDays: ISelectedDays) => {
    const getFilteredDays = filterDate(selectedDays);
    setQuery({ ...query, ...getFilteredDays });
  };

  const resetQueryDate = () => {
    setQuery(resetDate(query));
  };

  const requestAssetHolders = async (page: number, limit: number) => {
    const response = await api.get({
      route: `assets/holders/${asset.assetId}?page=${page}&limit=${limit}`,
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
          <Row isStakingRoyalties={false}>
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
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Max Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(maxSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(initialSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Circulating Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(circulatingSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Burned Value</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(burnedValue / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
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
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Holders</strong>
          </span>
          <span>{totalRecords}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Transactions</strong>
          </span>
          <span>{totalTransactions}</span>
        </Row>
        <Row isStakingRoyalties={false}>
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
        {Object.entries(uris).length ? (
          Object.entries(uris).map(([key, value]: [string, any]) => (
            <Row key={String(key)} isStakingRoyalties={false}>
              <span>
                <strong>{key}</strong>
              </span>
              <UriContainer>
                <a href={`${value}`} target="blank">
                  {value}
                </a>
              </UriContainer>
            </Row>
          ))
        ) : (
          <EmptyRow type="assets">
            <p>No URI found</p>
          </EmptyRow>
        )}
      </>
    );
  };

  const More: React.FC = () => {
    return (
      <>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>{getIssueDate()}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>{ownerAddress ? ownerAddress : '--'}</span>
          <CenteredRow>
            <Copy data={ownerAddress} info="Issue" />
          </CenteredRow>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Precision</strong>
          </span>
          <span>{precision}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Freeze</strong>
          </span>
          <span>{String(properties.canFreeze)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Wipe</strong>
          </span>
          <span>{String(properties.canWipe)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Pause</strong>
          </span>
          <span>{String(properties.canPause)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Mint</strong>
          </span>
          <span>{String(properties.canMint)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Burn</strong>
          </span>
          <span>{String(properties.canBurn)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Change Owner</strong>
          </span>
          <span>{String(properties.canChangeOwner)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Add Roles</strong>
          </span>
          <span>{String(properties.canAddRoles)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Paused</strong>
          </span>
          <span>{String(attributes.isPaused)}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>NFT Mint Stopped</strong>
          </span>
          <span>{String(attributes.isNFTMintStopped)}</span>
        </Row>
      </>
    );
  };
  const stakingAprOrFpr = useCallback(() => {
    if (staking?.apr || staking?.fpr) {
      return (
        <ContentRow>
          <strong>{staking?.apr.length > 0 ? 'APR' : 'FPR'}</strong>
          <ContentScrollBar>
            {staking.interestType === 'FPRI'
              ? staking.fpr.reverse().map((fpr, index) => (
                  <span key={index}>
                    <p>
                      Total Amount:{' '}
                      {toLocaleFixed(
                        (fpr.totalAmount || 0) / 10 ** precision,
                        precision,
                      )}
                    </p>
                    <p>
                      Total Staked:{' '}
                      {toLocaleFixed(
                        (fpr.totalStaked || 0) / 10 ** precision,
                        precision,
                      )}
                    </p>
                    <p>Epoch: {fpr.epoch}</p>
                    <p>
                      Total Claimed:{' '}
                      {toLocaleFixed(
                        (fpr.TotalClaimed || 0) / 10 ** precision,
                        precision,
                      )}
                    </p>
                  </span>
                ))
              : staking.apr.reverse().map((apr, index) => (
                  <span key={index}>
                    <p>Timestamp: {formatDate(apr.timestamp)}</p>
                    <p>
                      Value: {toLocaleFixed((apr.value || 0) / 10 ** 2, 2)}%
                    </p>
                  </span>
                ))}
          </ContentScrollBar>
        </ContentRow>
      );
    }
    return;
  }, [staking]);

  const StakingRoyalties: React.FC = () => {
    return (
      <>
        {royalties && (
          <div>
            <Row isStakingRoyalties={true}>
              <span>
                <strong>Royalties</strong>
              </span>
              <RowContent>
                <BalanceContainer>
                  <FrozenContainer>
                    <div>
                      <strong>Address</strong>
                      <p>{royalties.address || '--'}</p>
                    </div>
                    <div>
                      <strong>Market Percentage</strong>
                      <p>
                        {(royalties.marketPercentage &&
                          royalties.marketPercentage / 10 ** 2) ||
                          '--'}
                      </p>
                    </div>
                    <div>
                      <strong>Transfer Fixed</strong>
                      <p>
                        {royalties.transferFixed
                          ? royalties.transferFixed / 10 ** 6
                          : '--'}
                      </p>
                    </div>
                    {royalties.transferPercentage ? (
                      royalties.transferPercentage.map(
                        (transfer, index) =>
                          Object.keys(transfer).length > 0 && (
                            <div key={index}>
                              <strong>Transfer Percentage</strong>
                              <p>
                                Amount:{' '}
                                {toLocaleFixed(
                                  (transfer.amount || 0) / 10 ** precision,
                                  precision,
                                )}
                              </p>
                              <p>Percentage: {transfer.percentage}</p>
                            </div>
                          ),
                      )
                    ) : (
                      <div>
                        <strong>Transfer Percentage</strong>
                        <p>Amount: --</p>
                        <p>Percentage: -- </p>
                      </div>
                    )}
                  </FrozenContainer>
                </BalanceContainer>
              </RowContent>
            </Row>
            <Row isStakingRoyalties={true}>
              <span>
                <strong>Staking</strong>
              </span>
              <RowContent>
                <BalanceContainer>
                  <FrozenContainer>
                    <div>
                      <strong>Total Staked</strong>
                      <p>
                        {toLocaleFixed(
                          (staking?.totalStaked || 0) / 10 ** precision,
                          precision,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>Current FPR Amount</strong>

                      <p>
                        {toLocaleFixed(
                          (staking?.currentFPRAmount || 0) / 10 ** precision,
                          precision,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>Min Epochs To Claim</strong>

                      <p>{staking?.minEpochsToClaim || '--'}</p>
                    </div>
                    <div>
                      <strong>Min Epochs To Unstake</strong>

                      <p>{staking?.minEpochsToUnstake || '--'}</p>
                    </div>
                    <div>
                      <strong>Min Epochs To Withdraw</strong>
                      <p>{staking?.minEpochsToWithdraw || '--'}</p>
                    </div>
                    {stakingAprOrFpr()}
                  </FrozenContainer>
                </BalanceContainer>
              </RowContent>
            </Row>
          </div>
        )}
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
      case 'Staking & Royalties':
        return <StakingRoyalties />;
      default:
        return <div />;
    }
  };

  const transactionsTableProps = {
    scrollUp: false,
    totalPages: totalTransactionsPage,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query,
  };

  const holdersTableProps = {
    scrollUp: false,
    totalPages: totalHoldersPage,
    dataName: 'accounts',
    request: (page: number, limit: number) => requestAssetHolders(page, limit),
    page,
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionsTableProps} />;
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

  const dateFilterProps = {
    resetDate: resetQueryDate,
    filterDate: filterQueryDate,
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

  const getHeader = useMemo(() => {
    return (
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
                <AssetHeaderContainer isVerfied={verified}>
                  <h1>
                    {name} ({assetId})
                  </h1>
                  {/* {!verified && (
                    <p>
                      Do you own this asset ?{' '}
                      <Link href="https://klever.finance/kleverchain-asset-verification/">
                        <a target="_blank" rel="noopener noreferrer">
                          Verify it here
                        </a>
                      </Link>
                    </p>
                  )} */}
                </AssetHeaderContainer>
                <div>{assetType}</div>
              </AssetTitle>
            </>
          )}
          route={'/assets'}
        />

        <Input />
      </Header>
    );
  }, [assetId, assetType, isVerified, logo, name, ticker]);

  return (
    <Container>
      {getHeader}
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

  const holdersCall = new Promise<IHoldersResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: `assets/holders/${assetId}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  await Promise.allSettled([assetCall, holdersCall]).then(responses => {
    responses.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        if (index === 0) {
          const asset: any = res.value;
          props.asset = parseHardCodedInfo([asset.data.asset])[0];
        } else if (index === 1) {
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
  });

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
