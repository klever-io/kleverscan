import api from '@/services/api';
import {
  IAssetsData,
  ICoinInfo,
  IGeckoChartResponse,
  IGeckoResponse,
  IPrice,
  Service,
} from '@/types';
import { calcApr } from '@/utils';
import { useEffect, useState } from 'react';
import CoinCard from './CoinCard';
import CoinCardSkeleton from './CoinCardSkeleton';

const CoinDataFetcher: React.FC<{ kfiPrices: IPrice }> = ({ kfiPrices }) => {
  const [assetsData, setAssetsData] = useState<IAssetsData>({} as IAssetsData);
  const [coins, setCoins] = useState<ICoinInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCoins = async () => {
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

      const klvDataCall = new Promise<IGeckoResponse>(
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

      const klvChartCall = new Promise<IGeckoChartResponse>(
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

      const kfiDataCall = new Promise<IGeckoResponse>(
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

      const kfiChartCall = new Promise<IGeckoChartResponse>(
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

      const klvCall = new Promise<ICoinInfo>(async (resolve, reject) => {
        const res = await api.get({
          route: `assets/KLV`,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

      const kfiCall = new Promise<ICoinInfo>(async (resolve, reject) => {
        const res = await api.get({
          route: `assets/KFI`,
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
      ];

      const responses = await Promise.allSettled(promises);

      responses.forEach(
        (response: PromiseSettledResult<any>, index: number) => {
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
            }
          }

          const data = kfiPrices.Exchanges.find(
            (exchange: any) => exchange.ExchangeName === 'Klever',
          );
          assetsData.kfi.volume = data?.Volume ?? null;
          assetsData.kfi.prices.todaysPrice = data?.Price ?? null;
          assetsData.kfi.prices.variation = data?.PriceVariation ?? null;
          if (data?.Price && data?.PriceVariation) {
            assetsData.kfi.prices.yesterdayPrice =
              data?.Price - data?.PriceVariation ?? null;
          }
        },
      );

      setCoins(coinsData);
      setAssetsData(assetsData);
      setLoading(false);
    };
    getCoins();
  }, []);

  return !loading ? (
    <CoinCard coins={coins} assetsData={assetsData} />
  ) : (
    <CoinCardSkeleton />
  );
};

export default CoinDataFetcher;
