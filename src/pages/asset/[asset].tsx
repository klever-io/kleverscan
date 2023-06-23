import { getStatusIcon, statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import DateFilter, { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import { EmptyRow, Status } from '@/components/Table/styles';
import Tabs, { ITabs } from '@/components/Tabs';
import Holders from '@/components/Tabs/Holders';
import Transactions from '@/components/Tabs/Transactions';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import {
  ContainerFilter,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Container,
} from '@/styles/common';
import {
  IAPR,
  IAsset,
  IAssetPage,
  IAssetPool,
  IAssetPoolResponse,
  IAssetResponse,
  IBalance,
  IFPR,
  IHoldersResponse,
  IITOResponse,
  IKDAFPR,
  IPagination,
  IParsedITO,
  IStaking,
  ITransactionsResponse,
  IUri,
} from '@/types/index';
import { parseApr, setQueryAndRouter } from '@/utils';
import { filterDate, formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseHardCodedInfo, parseHolders } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { resetDate } from '@/utils/resetDate';
import { timestampToDate } from '@/utils/timeFunctions';
import {
  AddressDiv,
  AssetHeaderContainer,
  AssetTitle,
  ContentRow,
  ContentScrollBar,
  EllipsisSpan,
  EpochDepositsWrapper,
  EpochGeneralData,
  EpochWrapper,
  ExpandableRow,
  ExpandWrapper,
  FallbackFPRRow,
  FPRFrozenContainer,
  FPRRow,
  FrozenContainer,
  Header,
  HistoryWrapper,
  HoverAnchor,
  NoDepositsContainer,
  PaginationHistory,
  Row,
  ShowDetailsButton,
  StakingHeader,
  StakingHeaderSpan,
  StakingHistoryTitle,
  UriContainer,
  WhiteListRow,
} from '@/views/assets/detail';
import { BalanceContainer, RowContent } from '@/views/proposals/detail';
import { FilterByDate } from '@/views/transactions';
import { ButtonExpand } from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { displayITOpacks, parseITOs } from '../itos';

const Asset: React.FC<IAssetPage> = ({}) => {
  const router = useRouter();
  const tableHeaders = ['Transactions', 'Holders'];
  const [selectedTab, setSelectedTab] = useState<null | string>(null);
  const [asset, setAsset] = useState<null | IAsset>(null);
  const [ITO, setITO] = useState<null | IParsedITO>(null);
  const [assetPool, setAssetPool] = useState<null | IAssetPool>(null);
  const [expand, setExpand] = useState({ whitelist: false, packs: false });
  const [txHash, setTxHash] = useState('');
  const [FPRIndex, setFPRIndex] = useState<number>(3);

  const { isMobile } = useMobile();
  const [holderQuery, setHolderQuery] = useState<string>('');
  const [transactionsPagination, setTransactionsPagination] =
    useState<null | IPagination>(null);
  const [holdersPagination, setHoldersPagination] =
    useState<null | IPagination>(null);
  const cardHeaders = ['Overview', 'More'];
  asset?.uris && cardHeaders.push('URIS');
  assetPool && cardHeaders.push('KDA Pool');
  ITO && cardHeaders.push('ITO');
  cardHeaders.push('Staking & Royalties');
  if (asset?.staking?.interestType === 'FPRI') {
    asset?.staking && cardHeaders.push('Staking History');
  }

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);

  const initialQueryState = {
    ...router.query,
  };

  useEffect(() => {
    if (router?.isReady) {
      setQueryAndRouter(initialQueryState, router);
      setSelectedTab((router.query.tab as string) || tableHeaders[0]);
      setSelectedCard((router.query.card as string) || cardHeaders[0]);
      setHolderQuery(router.query.sortBy as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectedTab !== 'Transactions' && selectedTab) {
      setQueryAndRouter({ ...router.query, sortBy: holderQuery }, router);
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
    if (asset.uris && Object.keys(asset.uris).length > 0) {
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
    setQueryAndRouter({ ...router.query, ...getFilteredDays }, router);
  };

  const resetQueryDate = () => {
    const newQuery = resetDate(router.query);
    setQueryAndRouter({ ...router.query, ...newQuery }, router);
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

  const getFPRDepositsPrecisions = async (
    asset: IAsset,
  ): Promise<{ [assetId: string]: number }> => {
    const assetsToSearch: string[] = [];
    asset.staking.fpr.forEach((data: IFPR) => {
      data.kda.forEach((kda: IKDAFPR) => {
        assetsToSearch.push(kda.kda);
      });
    });
    return getPrecision(assetsToSearch);
  };

  const addPrecisionsToFPRDeposits = (
    asset: IAsset,
    precisions: { [assetId: string]: number },
  ) => {
    asset.staking.fpr.forEach((data: IFPR) => {
      data.totalAmount = data.totalAmount / 10 ** KLV_PRECISION;
      data.TotalClaimed = data.TotalClaimed / 10 ** KLV_PRECISION;
      data.totalStaked = data.totalStaked / 10 ** asset.precision;
      data.precision = asset.precision;
      data.kda.forEach((kda: IKDAFPR) => {
        let precision = 0;
        Object.entries(precisions).forEach(([assetTicker, assetPrecision]) => {
          if (assetTicker === kda.kda) {
            precision = assetPrecision;
          }
        });
        kda.totalAmount = kda.totalAmount / 10 ** precision;
        kda.totalClaimed = kda.totalClaimed / 10 ** precision;
        kda.precision = precision;
      });
    });
  };

  const loadInitialData = async () => {
    if (router?.isReady) {
      const pathRoute = router.query?.asset as string;
      const assetId = pathRoute.split('=asset')[0];

      const assetCall = new Promise<IAssetResponse>(async (resolve, reject) => {
        const res = await api.get({
          route: `assets/${assetId}`,
        });
        if (res?.error === 'cannot find asset in database') {
          router.push('/404');
        }
        if (!res.error || res.error === '') {
          resolve(res);
        }
        reject(res.error);
      });

      const transactionCall = new Promise<ITransactionsResponse>(
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

      const ITOCall = new Promise<IITOResponse>(async (resolve, reject) => {
        const res = await api.get({
          route: `ito/${assetId}`,
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

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

      await Promise.allSettled([
        assetCall,
        transactionCall,
        holdersCall,
        ITOCall,
        assetPoolCall,
        ITOCall,
      ]).then(responses => {
        responses.forEach(async (res, index) => {
          if (res.status === 'fulfilled') {
            switch (index) {
              case 0:
                const asset = res.value as IAssetResponse;
                const parsedAsset = parseHardCodedInfo([asset?.data?.asset])[0];
                parseURIs(parsedAsset);
                if (parsedAsset?.staking?.interestType === 'FPRI') {
                  const precisions = await getFPRDepositsPrecisions(
                    parsedAsset,
                  );
                  addPrecisionsToFPRDeposits(parsedAsset, precisions);
                }
                setAsset(parsedAsset);
                break;
              case 1:
                const transactions = res.value as ITransactionsResponse;
                setTransactionsPagination(transactions?.pagination);
                break;
              case 2:
                const holders = res.value as IHoldersResponse;
                setHoldersPagination(holders?.pagination);
                break;
              case 3:
                const ITOresp = res.value as IITOResponse;
                if (ITOresp?.data?.ito) {
                  const ITO = ITOresp?.data?.ito;
                  await parseITOs([ITO]);
                  setITO(ITO as IParsedITO);
                }
                break;
              case 4:
                const assetPool = res.value as IAssetPoolResponse;
                setAssetPool(assetPool.data.pool);
                break;
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
        <Row isStakingRoyalties={false}>
          <span>
            <strong>Staking Type</strong>
          </span>
          <span>
            {asset ? parseApr(asset?.staking?.interestType) : <Skeleton />}
          </span>
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
            ([key, value]: [string, string]) => (
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

  const ITOComponent: React.FC = () => {
    const { extensionInstalled, connectExtension } = useExtension();

    useEffect(() => {
      if (extensionInstalled) {
        connectExtension();
      }
    }, [extensionInstalled]);
    return (
      <>
        {ITO && ITO.isActive ? (
          <>
            {ITO?.maxAmount ? (
              <Row isStakingRoyalties={false}>
                <span>
                  <strong>Max Amount</strong>
                </span>
                <span>{ITO.maxAmount}</span>
              </Row>
            ) : null}
            <Row isStakingRoyalties={false}>
              <span>
                <strong>Receiver Address</strong>
              </span>

              <AddressDiv>{ITO.receiverAddress} </AddressDiv>
              <Copy data={ITO.receiverAddress} />
            </Row>
            <Row isStakingRoyalties={false}>
              <span>
                <strong>White List Active</strong>
              </span>
              <span>{statusWithIcon(ITO.isWhitelistActive)}</span>
            </Row>

            {ITO?.startTime && (
              <Row isStakingRoyalties={false}>
                <span>
                  <strong>Start Time</strong>
                </span>
                <span>
                  <small>{formatDate(ITO.startTime)}</small>
                </span>
              </Row>
            )}
            {ITO?.endTime && (
              <Row isStakingRoyalties={false}>
                <span>
                  <strong>End Time</strong>
                </span>
                <span>
                  <small>{formatDate(ITO.endTime)}</small>
                </span>
              </Row>
            )}
            {ITO?.whitelistStartTime && (
              <Row isStakingRoyalties={false}>
                <span>
                  <strong>White List</strong>
                  <br />
                  <strong>Start Time</strong>
                </span>
                <span>
                  <small>{formatDate(ITO.whitelistStartTime)}</small>
                </span>
              </Row>
            )}
            {ITO?.whitelistEndTime && (
              <Row isStakingRoyalties={false}>
                <span>
                  <strong>White List</strong>
                  <br />
                  <strong>End Time</strong>
                </span>
                <span>
                  <small>{formatDate(ITO.whitelistEndTime)}</small>
                </span>
              </Row>
            )}
            {ITO?.whitelistInfo && (
              <WhiteListRow
                expandVar={expand.whitelist}
                isStakingRoyalties={false}
              >
                <ExpandWrapper expandVar={expand.whitelist}>
                  <span style={{ gap: '4px' }}>
                    <strong>White List Info</strong>
                  </span>
                  <span>
                    <ButtonExpand
                      style={{ display: 'inline' }}
                      onClick={() =>
                        setExpand({ ...expand, whitelist: !expand.whitelist })
                      }
                    >
                      {expand.whitelist ? 'Hide' : 'Expand'}
                    </ButtonExpand>
                  </span>
                </ExpandWrapper>
                {expand.whitelist && (
                  <div style={{ minWidth: 0, width: '100%' }}>
                    {ITO.whitelistInfo.map((data, index) => {
                      return (
                        <RowContent key={index}>
                          <BalanceContainer>
                            <FrozenContainer>
                              <div
                                style={{
                                  width: '100%',
                                  overflow: 'visible',
                                }}
                              >
                                <span>
                                  <strong>Address</strong>
                                </span>
                                <EllipsisSpan>
                                  <Link href={`/accounts/${data.address}`}>
                                    {data.address}
                                  </Link>
                                  <Copy data={data.address} />
                                </EllipsisSpan>
                              </div>
                              <div>
                                <span>
                                  <strong>Limit</strong>
                                </span>
                                <span>
                                  <small>{data.limit}</small>
                                </span>
                              </div>
                            </FrozenContainer>
                          </BalanceContainer>
                        </RowContent>
                      );
                    })}
                  </div>
                )}
              </WhiteListRow>
            )}
            {ITO.packData && (
              <ExpandableRow
                isStakingRoyalties={false}
                expandVar={expand.packs}
              >
                <ExpandWrapper
                  expandVar={expand.packs}
                  style={{ marginBottom: expand.packs ? '1rem' : '0' }}
                >
                  <span style={{ gap: '4px' }}>
                    <strong>Packs Data</strong>
                  </span>
                  <span>
                    {' '}
                    <ButtonExpand
                      onClick={() =>
                        setExpand({ ...expand, packs: !expand.packs })
                      }
                    >
                      {expand.packs ? 'Hide' : 'Expand'}
                    </ButtonExpand>
                  </span>
                </ExpandWrapper>
                {expand.packs && displayITOpacks(ITO, setTxHash)}
              </ExpandableRow>
            )}
          </>
        ) : (
          <EmptyRow type="assets">
            <p>No active ITO found</p>
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
            {asset?.staking.interestType === 'FPRI' ? (
              <ShowDetailsButton
                onClick={() => {
                  const updatedQuery = { ...router.query };
                  setSelectedCard('Staking History');
                  setQueryAndRouter(
                    { ...updatedQuery, card: 'Staking History' },
                    router,
                  );
                }}
              >
                Show details
              </ShowDetailsButton>
            ) : (
              asset?.staking.apr.reverse().map((apr, index) => (
                <span key={index}>
                  <p>Timestamp: {formatDate(apr.timestamp)}</p>
                  <p>Value: {toLocaleFixed((apr.value || 0) / 10 ** 2, 2)}%</p>
                </span>
              ))
            )}
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
                              <p>
                                Percentage: {transfer.percentage / 10 ** 2}%
                              </p>
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
                    {asset?.royalties?.itoPercentage && (
                      <div>
                        <strong>ITO Percentage</strong>
                        <p>
                          {`${asset.royalties.itoPercentage / 10 ** 2}%` ||
                            '--'}
                        </p>
                      </div>
                    )}
                    {asset?.royalties?.itoFixed && (
                      <div>
                        <strong>ITO Fixed</strong>
                        <p>
                          {`${
                            asset.royalties.itoFixed / 10 ** KLV_PRECISION
                          } KLV` || '--'}
                        </p>
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

  const renderHistoryContent = (historyArray: IFPR[], currentIndex: number) => (
    <EpochWrapper>
      <EpochGeneralData>
        <div>
          <strong>Epoch</strong>
          <br />
          <strong>{historyArray[currentIndex].epoch}</strong>
        </div>
        <StakingHeader>
          <StakingHeaderSpan>
            Total Staked of <br />
            {asset?.name}
            <br />
            <strong>
              {toLocaleFixed(
                historyArray[currentIndex]?.totalStaked || 0,
                historyArray[currentIndex].precision || 0,
              )}
            </strong>
          </StakingHeaderSpan>
        </StakingHeader>
      </EpochGeneralData>
    </EpochWrapper>
  );

  const renderStakingHistory = (historyArray: IFPR[], offset: number) => {
    const elements: JSX.Element[] = [];
    const fprLength = asset?.staking?.fpr?.length;
    if (typeof fprLength !== 'number') {
      return elements;
    }

    let currentIndex = fprLength - 1;
    let indexEnd = fprLength - offset;

    if (indexEnd < 0) {
      indexEnd = 0;
    }

    for (currentIndex; currentIndex >= indexEnd; currentIndex--) {
      const hasDataToRender =
        !!historyArray[currentIndex]?.totalAmount ||
        !!historyArray[currentIndex]?.TotalClaimed ||
        historyArray[currentIndex]?.kda.length > 0;
      elements.push(
        hasDataToRender ? (
          <FPRRow
            key={historyArray[currentIndex].epoch}
            isStakingRoyalties={false}
          >
            <HistoryWrapper>
              {renderHistoryContent(historyArray, currentIndex)}
              <EpochDepositsWrapper>
                {(!!historyArray[currentIndex]?.totalAmount ||
                  !!historyArray[currentIndex]?.TotalClaimed) && (
                  <FPRFrozenContainer>
                    <div>
                      <strong>KDA</strong>
                      <p>KLV</p>
                    </div>
                    <div>
                      <strong>Total deposited</strong>
                      {/* here is always KLV */}
                      <p>
                        {toLocaleFixed(
                          historyArray[currentIndex]?.totalAmount,
                          6,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>Total claimed</strong>
                      {/* here is always KLV */}
                      <p>
                        {toLocaleFixed(
                          historyArray[currentIndex]?.TotalClaimed,
                          6,
                        )}
                      </p>
                    </div>
                  </FPRFrozenContainer>
                )}

                {historyArray[currentIndex].kda.map((kda: IKDAFPR) => {
                  return (
                    <FPRFrozenContainer key={kda.kda}>
                      <div>
                        <strong>KDA</strong>
                        <p>{kda.kda}</p>
                      </div>
                      <div>
                        <strong>Total Deposited</strong>
                        <p>
                          {toLocaleFixed(kda?.totalAmount, kda.precision || 0)}
                        </p>
                      </div>
                      <div>
                        <strong>Total claimed</strong>
                        <p>
                          {toLocaleFixed(kda?.totalClaimed, kda.precision || 0)}
                        </p>
                      </div>
                    </FPRFrozenContainer>
                  );
                })}
              </EpochDepositsWrapper>
            </HistoryWrapper>
          </FPRRow>
        ) : (
          <FPRRow isStakingRoyalties={false}>
            <FallbackFPRRow>
              <HistoryWrapper>
                <EpochDepositsWrapper>
                  {renderHistoryContent(historyArray, currentIndex)}
                </EpochDepositsWrapper>
              </HistoryWrapper>
              <NoDepositsContainer>
                {asset?.assetId === 'KLV' || asset?.assetId === 'KFI' ? (
                  <>
                    <p>
                      No deposits in this epoch.
                      <br />
                      <br />
                      Deposits for KLV/KFI occur automatically from each
                      transaction.
                    </p>
                  </>
                ) : (
                  <p>No deposits in this epoch.</p>
                )}
              </NoDepositsContainer>
            </FallbackFPRRow>
          </FPRRow>
        ),
      );
    }
    return elements;
  };

  const showDefaultItems = () => {
    setFPRIndex(3);
    window.scrollTo(0, 0);
  };

  const renderFPRHeaderMsg = () => {
    if (asset?.assetId !== 'KLV' && asset?.assetId !== 'KFI') {
      return (
        <>
          {isMobile ? (
            <Tooltip
              msg={`Below are the last epochs where there might be deposits of any asset in the ${asset?.name}'s FPR Pool.`}
            />
          ) : (
            <p>
              Below are the last epochs where there might be deposits of any
              asset in the {`${asset?.name}'s`} FPR Pool.
            </p>
          )}
        </>
      );
    }
    return (
      <>
        {isMobile ? (
          <Tooltip
            msg={`Below is the registry of the last 100 epochs of ${asset?.name} total staking.\nHave in mind that deposits for KLV/KFI occur automatically from each transaction.`}
          />
        ) : (
          <>
            <p>
              {`Below is the registry of the last 100 epochs of ${asset?.name} total staking.`}
            </p>
            <p>{`Have in mind that deposits for KLV/KFI occur automatically from each transaction.`}</p>
          </>
        )}
      </>
    );
  };

  const FPRHistory: React.FC<IFPR[]> = fpr => {
    return (
      <>
        <StakingHistoryTitle>
          <strong>Flexible Proportional Return - FPR</strong>
          {renderFPRHeaderMsg()}
        </StakingHistoryTitle>
        {renderStakingHistory(fpr, FPRIndex)}
        {!((asset?.staking?.fpr?.length || 0) - FPRIndex <= 0) && (
          <PaginationHistory
            onClick={() => setFPRIndex(asset?.staking?.fpr?.length || 0)}
          >
            <strong>Show more</strong>
          </PaginationHistory>
        )}
        {!!((asset?.staking?.fpr?.length || 0) - FPRIndex <= 0) &&
          !!((asset?.staking?.fpr?.length || 0) > 3) && (
            <PaginationHistory onClick={() => showDefaultItems()}>
              <strong>Show less</strong>
            </PaginationHistory>
          )}
      </>
    );
  };

  const APRHistory: React.FC<IAPR[]> = apr => {
    return <></>;
  };

  interface IStakingHistoryProps {
    staking: IStaking | undefined;
  }

  const StakingHistory: React.FC<IStakingHistoryProps> = ({ staking }) => {
    if (!staking) return null;
    if (asset?.staking.interestType === 'APRI') {
      return APRHistory(staking.apr as IAPR[]);
    }
    return FPRHistory(staking.fpr as IFPR[]);
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
      case 'ITO':
        return <ITOComponent />;
      case 'KDA Pool':
        return <KDAPool />;
      case 'Staking History':
        return <StakingHistory staking={asset?.staking} />;
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
  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
  };
  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header);
      const updatedQuery = { ...router.query };
      delete updatedQuery.sortBy;
      delete updatedQuery.page;
      delete updatedQuery.limit;
      setQueryAndRouter({ ...updatedQuery, tab: header }, router);
    },
    dateFilterProps,
    showDataFilter: false,
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
      <CardTabContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
                setQueryAndRouter({ ...router.query, card: header }, router);
              }}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardTabContainer>

      <Tabs {...tabProps}>
        {selectedTab === 'Transactions' && (
          <TxsFiltersWrapper>
            <ContainerFilter>
              <TransactionsFilters
                disabledInput={true}
                {...transactionsFiltersProps}
              ></TransactionsFilters>
              <RightFiltersContent>
                <FilterByDate>
                  <DateFilter {...dateFilterProps} />
                </FilterByDate>
              </RightFiltersContent>
            </ContainerFilter>
          </TxsFiltersWrapper>
        )}
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export default Asset;
