import api from '@/services/api';
import {
  IAccountResponse,
  IBlockResponse,
  IGeckoChartResponse,
  IGeckoResponse,
  IHome,
  ITransactionListResponse,
  Service,
} from '@/types/index';
import { useEffect } from 'react';
import { calcApr, getEpochInfo } from '..';

export const useHomePageData = (): IHome => {
  const props: IHome = {
    blocks: [],
    transactionsList: [],
    defaultTotalAccounts: 0,
    defaultEpochInfo: {
      currentSlot: 0,
      epochFinishSlot: 0,
      epochLoadPercent: 0,
      remainingTime: '0 sec',
    },
    tps: '0 / 0',
    coinsData: [],
    yesterdayTransactions: 0,
    beforeYesterdayTransactions: 0,
    yesterdayAccounts: 0,
    assetsData: {
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
    },
  };

  useEffect(() => {
    const getHomepageData = async () => {
      const pushCoinData = (
        name: string,
        shortname: string,
        response: IGeckoResponse,
        chart: IGeckoChartResponse,
      ) => {
        props.coinsData.push({
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

      const blocksCall = new Promise<IBlockResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'block/list',
            refreshTime: 4,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const transactionsCall = new Promise<IBlockResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const transactionsListCall = new Promise<ITransactionListResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list/count/15',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const accountsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'address/list',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const statisticsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'node/statistics',
            service: Service.PROXY,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const metricsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.get({
            route: 'node/overview',
            service: Service.PROXY,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const klvDataCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'coins/klever',
            service: Service.GECKO,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const klvChartCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: `coins/klever/market_chart?vs_currency=usd&days=1`,
            service: Service.GECKO,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const kfiDataCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'coins/klever-finance',
            service: Service.GECKO,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const kfiChartCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: `coins/klever-finance/market_chart?vs_currency=usd&days=1`,
            service: Service.GECKO,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const yesterdayTransactionsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list/count/1',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const beforeYesterdayTransactionsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: `transaction/list?startdate=${
              new Date().getTime() - 86400000 * 2
            }&enddate=${new Date().getTime() - 86400000}`,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const yesterdayAccountsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'address/list/count/1',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const klvCall = new Promise<IAccountResponse>(async (resolve, reject) => {
        const res = await api.get({
          route: `assets/KLV`,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

      const kfiCall = new Promise<IAccountResponse>(async (resolve, reject) => {
        const res = await api.get({
          route: `assets/KFI`,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

      // const klvPriceCall = new Promise<IAccountResponse>(
      //   async (resolve, reject) => {
      //     const res = await api.post({
      //       route: `coinstats`,
      //       service: Service.PRICE,
      //       body: {
      //         ID: '38',
      //         Name: 'klv',
      //         Currency: 'USD',
      //       },
      //     });

      //     if (!res.error || res.error === '') {
      //       resolve(res);
      //     }

      //     reject(res.error);
      //   },
      // );

      const kfiPriceCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.post({
            route: `coinstats`,
            service: Service.PRICE,
            body: {
              ID: 'kfi',
              Name: 'kfi',
              Currency: 'USD',
            },
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const promises = [
        blocksCall,
        transactionsListCall,
        accountsCall,
        statisticsCall,
        metricsCall,
        klvDataCall,
        klvChartCall,
        kfiDataCall,
        kfiChartCall,
        yesterdayTransactionsCall,
        beforeYesterdayTransactionsCall,
        yesterdayAccountsCall,
        klvCall,
        kfiCall,
        kfiPriceCall,
      ];

      await Promise.allSettled(promises).then(responses => {
        responses.forEach(async (res, index) => {
          if (res.status !== 'rejected') {
            const { value }: any = res;

            switch (index) {
              case 0:
                props.blocks = value.data.blocks;
                break;

              case 1:
                const { number_by_day } = value.data;
                props.transactionsList = number_by_day;
                break;

              case 2:
                props.defaultTotalAccounts = value.pagination.totalRecords;
                break;

              case 3:
                const chainStatistics = value.data.statistics.chainStatistics;
                props.tps = `${chainStatistics.liveTPS} / ${chainStatistics.peakTPS}`;
                break;

              case 4:
                if (value) {
                  props.defaultEpochInfo = getEpochInfo(value.data.overview);
                }

                break;

              case 5:
                if (responses[7].status !== 'rejected') {
                  const klvChart: any = responses[7].value;
                  pushCoinData('Klever', 'KLV', value, klvChart);
                }
                break;

              case 7:
                if (value?.market_data?.market_cap) {
                  value.market_data.market_cap.usd =
                    150000 * value.market_data.current_price.usd;
                }
                break;

              case 8:
                if (responses[8].status !== 'rejected') {
                  const kfiData: any = responses[8].value;
                  pushCoinData('Klever Finance', 'KFI', kfiData, value);
                }
                break;

              case 9:
                if (value.data?.number_by_day?.length > 0)
                  props.yesterdayTransactions =
                    value.data?.number_by_day[0]?.doc_count;

                break;

              case 10:
                if (value.pagination.totalRecords > 0)
                  props.beforeYesterdayTransactions =
                    value.pagination.totalRecords;

                break;

              case 11:
                if (value.data?.number_by_day?.length > 0)
                  props.yesterdayAccounts =
                    value.data?.number_by_day[0]?.doc_count;
                break;

              case 12:
                const initialKlv = 0;
                props.assetsData.klv.estimatedAprYesterday =
                  calcApr(value?.data.asset, 4, 0) * 100;

                props.assetsData.klv.estimatedAprBeforeYesterday =
                  calcApr(value?.data.asset, 4, 4) * 100;

                props.assetsData.klv.staking.totalStaking =
                  value?.data?.asset?.staking?.totalStaked / 1000000 || null;

                props.assetsData.klv.staking.dayBeforeTotalStaking =
                  value?.data?.asset?.staking?.fpr
                    .slice(-4)
                    .reduce(
                      (acc: number, curr: { totalStaked: number }) =>
                        acc + curr.totalStaked,
                      initialKlv,
                    ) /
                  (4 * 1000000);

                props.assetsData.klv.circulatingSupply =
                  value?.data?.asset?.circulatingSupply / 1000000 || null;

                break;

              case 13:
                const initialKfi = 0;
                props.assetsData.kfi.estimatedAprYesterday = calcApr(
                  value?.data.asset,
                  4,
                  0,
                );
                props.assetsData.kfi.estimatedAprBeforeYesterday = calcApr(
                  value?.data.asset,
                  4,
                  4,
                );

                props.assetsData.kfi.staking.totalStaking =
                  value?.data?.asset?.staking?.totalStaked / 1000000 || null;

                props.assetsData.kfi.staking.dayBeforeTotalStaking =
                  value?.data?.asset?.staking?.fpr
                    .slice(-4)
                    .reduce(
                      (acc: number, curr: { totalStaked: number }) =>
                        acc + curr.totalStaked,
                      initialKfi,
                    ) /
                  (4 * 1000000);
                // sum last 4 total staked positions and divide by 4

                props.assetsData.kfi.circulatingSupply =
                  value?.data?.asset?.circulatingSupply / 1000000;

                break;

              case 14:
                if (!value.code) {
                  const data = value.Exchanges.find(
                    (exchange: any) => exchange.ExchangeName === 'Klever',
                  );
                  props.assetsData.kfi.volume = data.Volume ?? null;
                  props.assetsData.kfi.prices.todaysPrice = data.Price ?? null;
                  props.assetsData.kfi.prices.variation =
                    data.PriceVariation ?? null;
                  if (data.Price && data.PriceVariation) {
                    props.assetsData.kfi.prices.yesterdayPrice =
                      data.Price - data.PriceVariation ?? null;
                  }
                }

                break;

              default:
                break;
            }
          }
        });
      });
    };
    getHomepageData();
  }, []);

  return props;
};
