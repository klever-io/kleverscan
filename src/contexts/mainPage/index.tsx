import api from '@/services/api';
import {
  IAccountResponse,
  IAggregateResponse,
  IAssetsData,
  ICoinInfo,
  IEpochInfo,
  IGeckoChartResponse,
  IGeckoResponse,
  IPrice,
  ITransaction,
  ITransactionListResponse,
  ITransactionsResponse,
  IYesterdayResponse,
  Service,
} from '@/types';
import { IBlock } from '@/types/blocks';
import { getEpochInfo } from '@/utils';
import { calcApr } from '@/utils/calcApr';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface IDaysCoins {
  [coinName: string]: string | number;
}
export interface IHomeData {
  actualTPS: string;
  blocks: IBlock[];
  metrics: IEpochInfo;
  newTransactions: number;
  beforeYesterdayTransactions: number;
  newAccounts: number;
  totalAccounts: number;
  transactions: ITransaction[];
  totalTransactions: number;
  counterEpoch: number;
  assetsData: IAssetsData;
  coins: ICoinInfo[];
  loadingCards: boolean;
  loadingBlocks: boolean;
  loadingCoins: boolean;
  getCoins: (days: IDaysCoins) => Promise<void>;
  legacyGetCoins: () => Promise<void>;
}

export const HomeData = createContext({} as IHomeData);

export const HomeDataProvider: React.FC = ({ children }) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [counterEpoch, setCounterEpoch] = useState(0);
  const [lastPercentage, setLastPercentage] = useState<number | null>(null);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [newAccounts, setNewAccounts] = useState(0);
  const [actualTPS, setActualTPS] = useState<string>('');
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [metrics, setMetrics] = useState<IEpochInfo>({
    currentSlot: 0,
    epochFinishSlot: 0,
    remainingTime: '',
    epochLoadPercent: 0,
  });
  const [newTransactions, setNewTransactions] = useState(0);
  const [beforeYesterdayTransactions, setBeforeYesterdayTransactions] =
    useState(0);
  const [assetsData, setAssetsData] = useState<IAssetsData>({} as IAssetsData);
  const [coins, setCoins] = useState<ICoinInfo[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    if (metrics.epochLoadPercent === 0 && lastPercentage !== null) {
      setCounterEpoch(counterEpoch + 1);
    }
    setLastPercentage(metrics.epochLoadPercent);
  }, [metrics.epochLoadPercent]);

  const getAggregate = useCallback(async () => {
    const aggregate: IAggregateResponse = await api.get({
      route: 'node/aggregate',
      service: Service.PROXY,
    });

    if (!aggregate.error) {
      const chainStatistics = aggregate.data.statistics;

      setMetrics(getEpochInfo(aggregate.data.overview));
      setActualTPS(`${chainStatistics.liveTPS} / ${chainStatistics.peakTPS}`);
      setBlocks(aggregate.data?.blocks);
    }
  }, []);

  const getCardsData = useCallback(async () => {
    // case 0:
    const accountsCall = new Promise<IAccountResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: 'address/list',
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );
    // case 1:
    const yesterdayAccountsCall = new Promise<IYesterdayResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: 'address/list/count/1',
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );
    // case 2:
    const transactionsCall = new Promise<ITransactionsResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: 'transaction/list?minify=true',
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    // case 3:
    const beforeYesterdayTransactionsCall =
      new Promise<ITransactionListResponse>(async (resolve, reject) => {
        const res = await api.get({
          route: 'transaction/list/count/2',
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

    const promises = [
      accountsCall,
      yesterdayAccountsCall,
      transactionsCall,
      beforeYesterdayTransactionsCall,
    ];

    await Promise.allSettled(promises).then(responses => {
      responses.forEach((res, index) => {
        if (res.status !== 'rejected') {
          const { value }: any = res;
          switch (index) {
            case 0:
              setTotalAccounts(value.pagination.totalRecords);
              break;

            case 1:
              setNewAccounts(value.data.number_by_day[0].doc_count);
              break;

            case 2:
              const newTotalTransactions = value.pagination.totalRecords;
              if (!totalTransactions) {
                setTotalTransactions(newTotalTransactions);
              } else if (
                totalTransactions &&
                totalTransactions < newTotalTransactions
              )
                setTotalTransactions(value.pagination.totalRecords);

              setTransactions(value.data.transactions);
              break;
            case 3:
              if (value.data?.number_by_day?.length > 0)
                setNewTransactions(value.data?.number_by_day[0]?.doc_count);

              setBeforeYesterdayTransactions(
                value.data?.number_by_day[1]?.doc_count,
              );

            default:
              break;
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    (async () => {
      const promises = [getAggregate(), getCardsData()];

      await Promise.allSettled(promises);

      setLoadingCards(false);
      setLoadingBlocks(false);
    })();
  }, []);

  //Statistics, Tx, Blocks
  useEffect(() => {
    const statisticsWatcher = setInterval(async () => {
      await getAggregate();
    }, statisticsWatcherTimeout);

    const cardWatcher = setInterval(async () => {
      getCardsData();
    }, cardWatcherInterval);

    return () => {
      clearInterval(statisticsWatcher);
      clearInterval(cardWatcher);
    };
  }, []);

  //Coins
  const getCoins = async (days: IDaysCoins) => {
    const coinsData: ICoinInfo[] = [];
    const assetsData: IAssetsData = {
      klv: {
        prices: {
          todaysPrice: null,
          yesterdayPrice: null,
          variation: null,
        },
        estimatedAprYesterday: 0,
        estimatedAprBeforeYesterday: 0,
        staking: {
          totalStaking: null,
          dayBeforeTotalStaking: null,
        },
        volume: null,
        circulatingSupply: null,
      },
      kfi: {
        prices: {
          todaysPrice: null,
          yesterdayPrice: null,
          variation: null,
        },
        estimatedAprYesterday: 0,
        estimatedAprBeforeYesterday: 0,
        staking: {
          totalStaking: null,
          dayBeforeTotalStaking: null,
        },
        volume: null,
        circulatingSupply: null,
      },
    };
    const pushCoinData = (
      name: string,
      shortname: string,
      response: IGeckoResponse,
      chart: IGeckoChartResponse,
    ) => {
      coinsData.push({
        name,
        shortname,
        price: response?.market_data?.current_price.usd || 0,
        variation: response?.market_data?.price_change_percentage_24h || 0,
        marketCap: {
          price: response?.market_data?.market_cap.usd || 0,
          variation:
            response?.market_data?.market_cap_change_percentage_24h || 0,
        },
        volume: {
          price: response?.market_data?.total_volume.usd || 0,
          variation: 0,
        },
        prices: chart.prices?.map(item => ({ value: item[1] })) || [],
      });
    };

    const klvDataCall = new Promise<IGeckoResponse>(async (resolve, reject) => {
      const res = await api.get({
        route: 'coins/klever',
        service: Service.GECKO,
        useApiProxy: true,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const klvChartCall = new Promise<IGeckoChartResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: `coins/klever/market_chart?vs_currency=usd&days=${
            days.KLV || 1
          }`,
          service: Service.GECKO,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    const kfiDataCall = new Promise<IGeckoResponse>(async (resolve, reject) => {
      const res = await api.get({
        route: 'coins/klever-finance',
        service: Service.GECKO,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiChartCall = new Promise<IGeckoChartResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: `coins/klever-finance/market_chart?vs_currency=usd&days=${
            days.KFI || 1
          }`,
          service: Service.GECKO,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    const klvCall = new Promise<ICoinInfo>(async (resolve, reject) => {
      const res = await api.get({
        route: `assets/KLV?minify=true`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiCall = new Promise<ICoinInfo>(async (resolve, reject) => {
      const res = await api.get({
        route: `assets/KFI?minify=true`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiPriceCall = new Promise<IPrice>(async (resolve, reject) => {
      const res = await api.post({
        route: `prices/coinstats`,
        service: Service.PROXY,
        body: {
          ID: 'kfi',
          Name: 'kfi',
          Currency: 'USD',
        },
        useApiProxy: true,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const promises = [
      klvDataCall,
      klvChartCall,
      kfiDataCall,
      kfiChartCall,
      klvCall,
      kfiCall,
      kfiPriceCall,
    ];

    const responses = await Promise.allSettled(promises);

    responses.forEach((response: PromiseSettledResult<any>, index: number) => {
      if (response.status !== 'rejected') {
        const { value }: any = response;

        switch (index) {
          case 0:
            if (responses[1].status !== 'rejected') {
              pushCoinData(
                'Klever',
                'KLV',
                response.value,
                responses[1].value as IGeckoChartResponse,
              );
            }
            break;
          case 2:
            if (responses[3].status !== 'rejected') {
              pushCoinData(
                'Klever Finance',
                'KFI',
                response.value,
                responses[3].value as IGeckoChartResponse,
              );
            }
            break;
          case 4:
            const initialKlv = 0;
            assetsData.klv.estimatedAprYesterday =
              calcApr(value?.data.asset, 4, 0) * 100;

            assetsData.klv.estimatedAprBeforeYesterday =
              calcApr(value?.data.asset, 4, 4) * 100;

            assetsData.klv.staking.totalStaking =
              value?.data?.asset?.staking?.totalStaked / 1000000 || null;

            assetsData.klv.staking.dayBeforeTotalStaking =
              value?.data?.asset?.staking?.fpr
                .slice(-4)
                .reduce(
                  (acc: number, curr: { totalStaked: number }) =>
                    acc + curr.totalStaked,
                  initialKlv,
                ) /
              (4 * 1000000);

            assetsData.klv.circulatingSupply =
              value?.data?.asset?.circulatingSupply / 1000000 || null;

            break;

          case 5:
            const initialKfi = 0;
            assetsData.kfi.estimatedAprYesterday = calcApr(
              value?.data.asset,
              4,
              0,
            );
            assetsData.kfi.estimatedAprBeforeYesterday = calcApr(
              value?.data.asset,
              4,
              4,
            );

            assetsData.kfi.staking.totalStaking =
              value?.data?.asset?.staking?.totalStaked / 1000000 || null;

            assetsData.kfi.staking.dayBeforeTotalStaking =
              value?.data?.asset?.staking?.fpr
                .slice(-4)
                .reduce(
                  (acc: number, curr: { totalStaked: number }) =>
                    acc + curr.totalStaked,
                  initialKfi,
                ) /
              (4 * 1000000);
            // sum last 4 total staked positions and divide by 4

            assetsData.kfi.circulatingSupply =
              value?.data?.asset?.circulatingSupply / 1000000;

            break;

          case 6:
            if (!value.error) {
              const data = value?.data?.prices?.Exchanges.find(
                (exchange: any) => exchange.ExchangeName === 'Klever',
              );

              if (!data) return;

              assetsData.kfi.volume = data.Volume ?? null;
              assetsData.kfi.prices.todaysPrice = data.Price ?? null;
              assetsData.kfi.prices.variation = data.PriceVariation ?? null;
              if (data.Price && data.PriceVariation) {
                assetsData.kfi.prices.yesterdayPrice =
                  data.Price - data.PriceVariation ?? null;
              }
            }
        }
      }
    });

    setCoins(coinsData);
    setAssetsData(assetsData);
    setLoadingCoins(false);
  };

  const legacyGetCoins = async () => {
    const coinsData: ICoinInfo[] = [];
    const assetsData: IAssetsData = {
      klv: {
        prices: {
          todaysPrice: null,
          yesterdayPrice: null,
          variation: null,
        },
        estimatedAprYesterday: 0,
        estimatedAprBeforeYesterday: 0,
        staking: {
          totalStaking: null,
          dayBeforeTotalStaking: null,
        },
        volume: null,
        circulatingSupply: null,
      },
      kfi: {
        prices: {
          todaysPrice: null,
          yesterdayPrice: null,
          variation: null,
        },
        estimatedAprYesterday: 0,
        estimatedAprBeforeYesterday: 0,
        staking: {
          totalStaking: null,
          dayBeforeTotalStaking: null,
        },
        volume: null,
        circulatingSupply: null,
      },
    };
    const pushCoinData = (
      name: string,
      shortname: string,
      response: IGeckoResponse,
      chart: IGeckoChartResponse,
    ) => {
      coinsData.push({
        name,
        shortname,
        price: response?.market_data?.current_price.usd || 0,
        variation: response?.market_data?.price_change_percentage_24h || 0,
        marketCap: {
          price: response?.market_data?.market_cap.usd || 0,
          variation:
            response?.market_data?.market_cap_change_percentage_24h || 0,
        },
        volume: {
          price: response?.market_data?.total_volume.usd || 0,
          variation: 0,
        },
        prices: chart.prices?.map(item => ({ value: item[1] })) || [],
      });
    };

    const klvDataCall = new Promise<IGeckoResponse>(async (resolve, reject) => {
      const res = await api.get({
        route: 'coins/klever',
        service: Service.GECKO,
        useApiProxy: true,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const klvChartCall = new Promise<IGeckoChartResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: `coins/klever/market_chart?vs_currency=usd&days=1`,
          service: Service.GECKO,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    const kfiDataCall = new Promise<IGeckoResponse>(async (resolve, reject) => {
      const res = await api.get({
        route: 'coins/klever-finance',
        service: Service.GECKO,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiChartCall = new Promise<IGeckoChartResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: `coins/klever-finance/market_chart?vs_currency=usd&days=1`,
          service: Service.GECKO,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    const klvCall = new Promise<ICoinInfo>(async (resolve, reject) => {
      const res = await api.get({
        route: `assets/KLV?minify=true`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiCall = new Promise<ICoinInfo>(async (resolve, reject) => {
      const res = await api.get({
        route: `assets/KFI?minify=true`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const kfiPriceCall = new Promise<IPrice>(async (resolve, reject) => {
      const res = await api.post({
        route: `coinstats`,
        service: Service.PRICE,
        body: {
          ID: 'kfi',
          Name: 'kfi',
          Currency: 'USD',
        },
        useApiProxy: true,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    });

    const promises = [
      klvDataCall,
      klvChartCall,
      kfiDataCall,
      kfiChartCall,
      klvCall,
      kfiCall,
      kfiPriceCall,
    ];

    const responses = await Promise.allSettled(promises);

    responses.forEach((response: PromiseSettledResult<any>, index: number) => {
      if (response.status !== 'rejected') {
        const { value }: any = response;

        switch (index) {
          case 0:
            if (responses[1].status !== 'rejected') {
              pushCoinData(
                'Klever',
                'KLV',
                response.value,
                responses[1].value as IGeckoChartResponse,
              );
            }
            break;
          case 2:
            if (responses[3].status !== 'rejected') {
              pushCoinData(
                'Klever Finance',
                'KFI',
                response.value,
                responses[3].value as IGeckoChartResponse,
              );
            }
            break;
          case 4:
            const initialKlv = 0;
            assetsData.klv.estimatedAprYesterday =
              calcApr(value?.data.asset, 4, 0) * 100;

            assetsData.klv.estimatedAprBeforeYesterday =
              calcApr(value?.data.asset, 4, 4) * 100;

            assetsData.klv.staking.totalStaking =
              value?.data?.asset?.staking?.totalStaked / 1000000 || null;

            assetsData.klv.staking.dayBeforeTotalStaking =
              value?.data?.asset?.staking?.fpr
                .slice(-4)
                .reduce(
                  (acc: number, curr: { totalStaked: number }) =>
                    acc + curr.totalStaked,
                  initialKlv,
                ) /
              (4 * 1000000);

            assetsData.klv.circulatingSupply =
              value?.data?.asset?.circulatingSupply / 1000000 || null;

            break;

          case 5:
            const initialKfi = 0;
            assetsData.kfi.estimatedAprYesterday = calcApr(
              value?.data.asset,
              4,
              0,
            );
            assetsData.kfi.estimatedAprBeforeYesterday = calcApr(
              value?.data.asset,
              4,
              4,
            );

            assetsData.kfi.staking.totalStaking =
              value?.data?.asset?.staking?.totalStaked / 1000000 || null;

            assetsData.kfi.staking.dayBeforeTotalStaking =
              value?.data?.asset?.staking?.fpr
                .slice(-4)
                .reduce(
                  (acc: number, curr: { totalStaked: number }) =>
                    acc + curr.totalStaked,
                  initialKfi,
                ) /
              (4 * 1000000);
            // sum last 4 total staked positions and divide by 4

            assetsData.kfi.circulatingSupply =
              value?.data?.asset?.circulatingSupply / 1000000;

            break;

          case 6:
            if (!value.code) {
              const data = value.Exchanges.find(
                (exchange: any) => exchange.ExchangeName === 'Klever',
              );
              assetsData.kfi.volume = data.Volume ?? null;
              assetsData.kfi.prices.todaysPrice = data.Price ?? null;
              assetsData.kfi.prices.variation = data.PriceVariation ?? null;
              if (data.Price && data.PriceVariation) {
                assetsData.kfi.prices.yesterdayPrice =
                  data.Price - data.PriceVariation ?? null;
              }
            }
        }
      }
    });

    setCoins(coinsData);
    setAssetsData(assetsData);
    setLoadingCoins(false);
  };

  useEffect(() => {
    legacyGetCoins();
    // getCoins({
    //   kfi: 1,
    //   klv: 1,
    // });
  }, []);

  const values: IHomeData = {
    actualTPS,
    blocks,
    metrics,
    newTransactions,
    beforeYesterdayTransactions,
    newAccounts,
    totalAccounts,
    transactions,
    totalTransactions,
    counterEpoch,
    coins,
    assetsData,
    loadingCards,
    loadingBlocks,
    loadingCoins,
    getCoins,
    legacyGetCoins,
  };

  return <HomeData.Provider value={values}>{children}</HomeData.Provider>;
};

export const useHomeData = (): IHomeData => useContext(HomeData);
