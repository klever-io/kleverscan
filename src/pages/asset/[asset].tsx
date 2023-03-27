import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import { EmptyRow, Status } from '@/components/Table/styles';
import Tabs, { ITabs } from '@/components/Tabs';
import Holders from '@/components/Tabs/Holders';
import Transactions from '@/components/Tabs/Transactions';
import api from '@/services/api';
import {
  IAccountAsset,
  IAsset,
  IAssetPool,
  IAssetPoolResponse,
  IAssetResponse,
  IBalance,
  IPagination,
  IResponse,
  ITransaction,
  ITransactionResponse,
  IUri,
} from '@/types/index';
import { filterDate, formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseHardCodedInfo, parseHolders } from '@/utils/parseValues';
import { resetDate } from '@/utils/resetDate';
import { timestampToDate } from '@/utils/timeFunctions';
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
  Row,
  UriContainer,
} from '@/views/assets/detail';
import { BalanceContainer, RowContent } from '@/views/proposals/detail';
import { ReceiveBackground } from '@/views/validator';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

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

interface IHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
}

const Asset: React.FC<IAssetPage> = ({}) => {
  const router = useRouter();
  const tableHeaders = ['Transactions', 'Holders'];
  const [selectedTab, setSelectedTab] = useState<null | string>(null);
  const [asset, setAsset] = useState<null | IAsset>(null);
  const [assetPool, setAssetPool] = useState<null | IAssetPool>(null);

  const [holderQuery, setHolderQuery] = useState<string>('');
  const [transactionsPagination, setTransactionsPagination] =
    useState<null | IPagination>(null);
  const [holdersPagination, setHoldersPagination] =
    useState<null | IPagination>(null);
  const cardHeaders = asset?.uris
    ? ['Overview', 'More', 'URIS', 'Staking & Royalties']
    : ['Overview', 'More'];
  assetPool && cardHeaders.push('KDA Pool');
  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);

  const initialQueryState = {
    ...router.query,
  };
  const setQueryAndRouter = (newQuery: NextParsedUrlQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (router?.isReady) {
      setQueryAndRouter(initialQueryState);
      setSelectedTab((router.query.tab as string) || tableHeaders[0]);
      setHolderQuery(router.query.sortBy as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectedTab !== 'Transactions' && selectedTab) {
      setQueryAndRouter({ ...router.query, sortBy: holderQuery });
    }
  }, [holderQuery]);

  const requestTransactions = async (page: number, limit: number) => {
    const newQuery = { ...router.query, asset: asset?.assetId || '' };
    return await api.get({
      route: `transaction/list`,
      query: { page, limit, ...newQuery },
    });
  };

  const parseURIs = (asset: IAsset) => {
    let uris = {};
    if (asset.uris && asset.uris.length > 0) {
      (asset.uris as IUri[]).forEach(uri => {
        uris = {
          ...uris,
          [uri.key]: uri.value,
        };
      });
      asset.uris = uris;
    }
  };

  const filterQueryDate = (selectedDays: ISelectedDays) => {
    const getFilteredDays = filterDate(selectedDays);
    setQueryAndRouter({ ...router.query, ...getFilteredDays });
  };

  const resetQueryDate = () => {
    const newQuery = resetDate(router.query);
    setQueryAndRouter({ ...router.query, ...newQuery });
  };

  const requestAssetHolders = async (page: number, limit: number) => {
    let newQuery = {
      ...router.query,
      sortBy: holderQuery?.toLowerCase() || '',
    };
    if (holderQuery === 'Total Balance') {
      newQuery = { ...router.query, sortBy: 'total' || '' };
    }
    if (asset) {
      const response = await api.get({
        route: `assets/holders/${asset.assetId}`,
        query: { page, limit, ...newQuery },
      });

      let parsedHolders: IBalance[] = [];
      if (!response.error) {
        const holders = response.data.accounts;
        parsedHolders = parseHolders(
          holders,
          asset.assetId,
          response.pagination,
        );
      }

      return { ...response, data: { accounts: parsedHolders } };
    }
    return { data: { accounts: [] } };
  };

  const loadInitialData = async () => {
    if (router?.isReady) {
      const pathRoute = router.query?.asset as string;
      const assetId = pathRoute.split('=asset')[0];

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

      const assetPoolCall = new Promise<IAssetPoolResponse>(
        async (resolve, reject) => {
          const res = await api.get({
            route: `assets/pool/${assetId}`,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const holdersCall = new Promise<IHoldersResponse>(
        async (resolve, reject) => {
          const res = await api.get({
            route: `assets/holders/${assetId}`,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      await Promise.allSettled([
        assetCall,
        transactionCall,
        holdersCall,
        assetPoolCall,
      ]).then(responses => {
        responses.forEach((res, index) => {
          if (res.status === 'fulfilled') {
            if (index === 0) {
              const asset: any = res.value;
              const parsedAsset = parseHardCodedInfo([asset?.data?.asset])[0];
              parseURIs(parsedAsset);
              setAsset(parsedAsset);
            } else if (index === 1) {
              const transactions: any = res.value;
              setTransactionsPagination(transactions?.pagination);
            } else if (index === 2) {
              const holders: any = res.value;
              setHoldersPagination(holders?.pagination);
            } else if (index === 3) {
              const assetPool: any = res.value;
              setAssetPool(assetPool.data.pool);
            }
          }
        });
      });
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [router?.isReady]);

  const getIssueDate = useCallback(() => {
    if (asset?.issueDate) {
      return timestampToDate(asset?.issueDate);
    }

    return '--';
  }, [asset?.issueDate]);

  const Overview: React.FC = () => {
    return (
      <>
        {asset?.ownerAddress && (
          <Row isStakingRoyalties={false}>
            <span>
              <strong>Owner</strong>
            </span>

            <span>
              <CenteredRow>
                <Link href={`/account/${asset?.ownerAddress}`}>
                  <HoverAnchor>{asset?.ownerAddress}</HoverAnchor>
                </Link>
                <Copy data={asset?.ownerAddress} info="ownerAddress" />
                <ReceiveBackground isOverflow={true}>
                  <QrCodeModal value={asset?.ownerAddress} isOverflow={true} />
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
              {asset ? (
                toLocaleFixed(
                  asset?.maxSupply / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {asset ? (
                toLocaleFixed(
                  asset?.initialSupply / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Circulating Supply</strong>
          </span>
          <span>
            <small>
              {asset ? (
                toLocaleFixed(
                  asset?.circulatingSupply / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Burned Value</strong>
          </span>
          <span>
            <small>
              {asset ? (
                toLocaleFixed(
                  asset?.burnedValue / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Total Staked</strong>
          </span>
          <span>
            <small>
              {asset ? (
                toLocaleFixed(
                  (asset?.staking?.totalStaked || 0) / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Holders</strong>
          </span>
          <span>{asset ? holdersPagination?.totalRecords : <Skeleton />}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Transactions</strong>
          </span>
          <span>
            {asset ? transactionsPagination?.totalRecords : <Skeleton />}
          </span>
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

  const KDAPool: React.FC = () => {
    const isActive = assetPool?.active;
    const ActiveIcon = getStatusIcon(isActive ? 'success' : 'fail');

    return (
      <>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Owner</strong>
          </span>

          <span>
            <CenteredRow>
              <Link href={`/account/${assetPool?.ownerAddress}`}>
                <HoverAnchor>{assetPool?.ownerAddress}</HoverAnchor>
              </Link>
              <Copy data={assetPool?.ownerAddress} info="ownerAddress" />
              <ReceiveBackground isOverflow={true}>
                <QrCodeModal
                  value={assetPool?.ownerAddress as string}
                  isOverflow={true}
                />
              </ReceiveBackground>
            </CenteredRow>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Is Active</strong>
          </span>
          <span>
            <small>
              {assetPool ? (
                <Status
                  status={isActive ? 'success' : 'fail'}
                  key={String(isActive)}
                >
                  <ActiveIcon />
                  <p>{isActive ? 'Yes' : 'No'}</p>
                </Status>
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>KLV Balance</strong>
          </span>
          <span>
            <small>
              {assetPool ? (
                toLocaleFixed(
                  assetPool?.klvBalance / 10 ** KLV_PRECISION,
                  KLV_PRECISION,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>KDA Balance</strong>
          </span>
          <span>
            <small>
              {assetPool && asset ? (
                toLocaleFixed(
                  (assetPool?.kdaBalance || 0) / 10 ** asset?.precision,
                  asset?.precision,
                )
              ) : (
                <Skeleton />
              )}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Converted Fees</strong>
          </span>
          <span>
            <small>
              {assetPool ? String(assetPool.convertedFees) : <Skeleton />}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Admin Address</strong>
          </span>
          <span>
            <small>
              {assetPool ? String(assetPool.adminAddress) : <Skeleton />}
            </small>
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Ratio</strong>
          </span>
          <span>{assetPool ? String(assetPool.ratio) : <Skeleton />}</span>
        </Row>
      </>
    );
  };

  const UriComponent: React.FC = () => {
    return (
      <>
        {Object.entries(asset?.uris || []).length ? (
          Object.entries(asset?.uris || []).map(
            ([key, value]: [string, any]) => (
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
            ),
          )
        ) : (
          <EmptyRow type="assets">
            <p>No URI found</p>
          </EmptyRow>
        )}
      </>
    );
  };

  const More: React.FC = () => {
    const statusWithIcon = (action: boolean) => {
      const StatusIcon = getStatusIcon(action ? 'success' : 'fail');

      return (
        <Status status={action ? 'success' : 'fail'} key={String(action)}>
          <StatusIcon />
          <p>{action ? 'Yes' : 'No'}</p>
        </Status>
      );
    };
    return (
      <>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>{asset ? getIssueDate() : <Skeleton />}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>
            {asset ? (
              asset?.ownerAddress ? (
                asset?.ownerAddress
              ) : (
                '--'
              )
            ) : (
              <Skeleton />
            )}
          </span>
          {asset?.ownerAddress && (
            <CenteredRow>
              <Copy data={asset?.ownerAddress} info="Issue" />
            </CenteredRow>
          )}
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Precision</strong>
          </span>
          <span>{asset ? asset.precision : <Skeleton />}</span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Freeze</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.properties.canFreeze) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Wipe</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.properties.canWipe) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Pause</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.properties.canPause) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Mint</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.properties.canMint) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Burn</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.properties.canBurn) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Change Owner</strong>
          </span>
          <span>
            {asset ? (
              statusWithIcon(asset.properties.canChangeOwner)
            ) : (
              <Skeleton />
            )}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Can Add Roles</strong>
          </span>
          <span>
            {asset ? (
              statusWithIcon(asset.properties.canAddRoles)
            ) : (
              <Skeleton />
            )}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Paused</strong>
          </span>
          <span>
            {asset ? statusWithIcon(asset.attributes.isPaused) : <Skeleton />}
          </span>
        </Row>
        <Row isStakingRoyalties={false}>
          <span>
            <strong>NFT Mint Stopped</strong>
          </span>
          <span>
            {asset ? (
              statusWithIcon(asset.attributes.isNFTMintStopped)
            ) : (
              <Skeleton />
            )}
          </span>
        </Row>
      </>
    );
  };
  const stakingAprOrFpr = useCallback(() => {
    if (asset?.staking?.apr || asset?.staking?.fpr) {
      return (
        <ContentRow>
          <strong>{asset?.staking?.apr.length > 0 ? 'APR' : 'FPR'}</strong>
          <ContentScrollBar>
            {asset?.staking.interestType === 'FPRI'
              ? asset?.staking.fpr.reverse().map((fpr, index) => (
                  <span key={index}>
                    <p>
                      Total Amount:{' '}
                      {toLocaleFixed(
                        (fpr.totalAmount || 0) / 10 ** asset?.precision,
                        asset?.precision,
                      )}
                    </p>
                    <p>
                      Total Staked:{' '}
                      {toLocaleFixed(
                        (fpr.totalStaked || 0) / 10 ** asset?.precision,
                        asset?.precision,
                      )}
                    </p>
                    <p>Epoch: {fpr.epoch}</p>
                    <p>
                      Total Claimed:{' '}
                      {toLocaleFixed(
                        (fpr.TotalClaimed || 0) / 10 ** asset?.precision,
                        asset?.precision,
                      )}
                    </p>
                  </span>
                ))
              : asset?.staking.apr.reverse().map((apr, index) => (
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
  }, [asset?.staking]);

  const StakingRoyalties: React.FC = () => {
    return (
      <>
        {asset?.royalties && (
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
                      <p>{asset?.royalties.address || '--'}</p>
                    </div>
                    <div>
                      <strong>Market Percentage</strong>
                      <p>
                        {(asset?.royalties.marketPercentage &&
                          asset?.royalties.marketPercentage / 10 ** 2) ||
                          '--'}
                      </p>
                    </div>
                    <div>
                      <strong>Transfer Fixed</strong>
                      <p>
                        {asset?.royalties.transferFixed
                          ? asset?.royalties.transferFixed / 10 ** 6
                          : '--'}
                      </p>
                    </div>
                    {asset?.royalties.transferPercentage ? (
                      asset?.royalties.transferPercentage.map(
                        (transfer, index) =>
                          Object.keys(transfer).length > 0 && (
                            <div key={index}>
                              <strong>Transfer Percentage</strong>
                              <p>
                                Amount:{' '}
                                {toLocaleFixed(
                                  (transfer.amount || 0) /
                                    10 ** asset?.precision,
                                  asset?.precision,
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
                          (asset?.staking?.totalStaked || 0) /
                            10 ** asset?.precision,
                          asset?.precision,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>Current FPR Amount</strong>

                      <p>
                        {toLocaleFixed(
                          (asset?.staking?.currentFPRAmount || 0) /
                            10 ** asset?.precision,
                          asset?.precision,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>Min Epochs To Claim</strong>

                      <p>{asset?.staking?.minEpochsToClaim || '--'}</p>
                    </div>
                    <div>
                      <strong>Min Epochs To Unstake</strong>

                      <p>{asset?.staking?.minEpochsToUnstake || '--'}</p>
                    </div>
                    <div>
                      <strong>Min Epochs To Withdraw</strong>
                      <p>{asset?.staking?.minEpochsToWithdraw || '--'}</p>
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
      case 'KDA Pool':
        return <KDAPool />;
      default:
        return <div />;
    }
  };

  const transactionsTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query: router.query,
  };

  const holdersTableProps = {
    scrollUp: false,
    dataName: 'accounts',
    request: (page: number, limit: number) => requestAssetHolders(page, limit),
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionsTableProps} />;
      case 'Holders':
        if (asset) {
          return (
            <Holders
              asset={asset}
              holdersTableProps={holdersTableProps}
              setHolderQuery={setHolderQuery}
              holderQuery={holderQuery}
            />
          );
        }
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
    onClick: header => {
      setSelectedTab(header);
      const a = {
        ...router.query,
      };
      delete a.sortBy;
      setQueryAndRouter({ ...a, tab: header });
    },
    dateFilterProps,
  };

  const getHeader = () => {
    return (
      <Header>
        <Title
          Component={() => (
            <>
              <AssetLogo
                logo={asset?.logo || ''}
                ticker={asset?.ticker || ''}
                name={asset?.name || ''}
                verified={asset?.verified}
              />
              <AssetTitle>
                <AssetHeaderContainer>
                  <h1>
                    {asset?.name} ({asset?.assetId})
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
                <div>{asset?.assetType}</div>
              </AssetTitle>
            </>
          )}
          route={'/assets'}
        />
      </Header>
    );
  };
  return (
    <Container>
      {asset ? getHeader() : <Skeleton width={200} height={40} />}
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

export default Asset;
