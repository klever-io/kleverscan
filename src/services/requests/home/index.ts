import { IDaysCoins } from '@/contexts/mainPage';
import api from '@/services/api';
import {
  IAggregateResponse,
  IAssetData,
  IEpochInfo,
  IGeckoChartResponse,
  IGeckoResponse,
  ITransaction,
  Service,
} from '@/types';
import { IBlock, IBlocksResponse } from '@/types/blocks';
import { getEpochInfo } from '@/utils';
import { calcApr } from '@/utils/calcApr';

const defaultAggregateData = {
  actualTPS: 0,
  metrics: {
    currentSlot: 0,
    epochFinishSlot: 0,
    epochLoadPercent: 0,
    remainingTime: '0',
  },
};

const homeGetAggregateCall = async (): Promise<
  { actualTPS: number; metrics: IEpochInfo } | undefined
> => {
  try {
    const aggregate: IAggregateResponse = await api.get({
      route: 'node/aggregate',
      service: Service.PROXY,
    });

    if (!aggregate.error) {
      const chainStatistics = aggregate.data.statistics;

      return {
        actualTPS: chainStatistics.liveTPS / chainStatistics.peakTPS,
        metrics: getEpochInfo(aggregate.data.overview),
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeGetBlocksCall = async (): Promise<
  { blocks: IBlock[] } | undefined
> => {
  try {
    const blocks: IBlocksResponse = await api.get({
      route: 'node/aggregate?blockMinified=false',
      service: Service.PROXY,
    });
    if (!blocks.error) {
      return { blocks: blocks.data?.blocks };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeAccountsCall = async (): Promise<
  { totalAccounts: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'address/list',
    });
    if (!res.error || res.error === '') {
      return { totalAccounts: res.pagination.totalRecords };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeYesterdayAccountsCall = async (): Promise<
  { newAccounts: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'address/list/count/1',
    });
    if (!res.error || res.error === '') {
      return {
        newAccounts: res.data.number_by_day[0].doc_count,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeTransactionsCall = async (): Promise<
  { totalTransactions: number; transcations: ITransaction[] } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list?minify=true',
    });
    if (!res.error || res.error === '') {
      return {
        totalTransactions: res.pagination.totalRecords,
        transcations: res.data.transactions,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeBeforeYesterdayTransactionsCall = async (): Promise<
  { newTransactions: number; beforeYesterdayTxs: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list/count/2',
    });

    if (!res.error || res.error === '') {
      const data = {
        newTransactions: 0,
        beforeYesterdayTxs: res.data?.number_by_day[1]?.doc_count,
      };
      if (res.data?.number_by_day?.length > 0) {
        data.newTransactions = res.data?.number_by_day[0]?.doc_count;
      }
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const homeProposalsCall = async (): Promise<
  { totalProposals: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'proposals/list',
    });
    if (!res.error || res.error === '') {
      if (typeof res.pagination.totalRecords === 'number') {
        return { totalProposals: res.pagination.totalRecords };
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const homeActiveProposalsCall = async (): Promise<
  { totalActiveProposals: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'proposals/list',
      query: { status: 'ActiveProposal' },
    });
    if (!res.error || res.error === '') {
      if (typeof res.pagination.totalRecords === 'number') {
        return { totalActiveProposals: res.pagination.totalRecords };
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const homeTotalValidators = async (): Promise<
  { totalValidators: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'validator/list',
    });
    if (!res.error || res.error === '') {
      if (typeof res.pagination.totalRecords === 'number') {
        return { totalValidators: res.pagination.totalRecords };
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const homeTotalActiveValidators = async (): Promise<
  | {
      totalActiveValidators: number;
    }
  | undefined
> => {
  try {
    const res = await api.get({
      route: 'validator/list',
      query: { list: 'eligible' },
    });
    if (!res.error || res.error === '') {
      if (typeof res.pagination.totalRecords === 'number') {
        return { totalActiveValidators: res.pagination.totalRecords };
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const homeKlvDataCall = async (): Promise<IGeckoResponse | undefined> => {
  try {
    const res = await api.get({
      route: 'coins/klever',
      service: Service.GECKO,
      useApiProxy: true,
    });

    if (!res.error || res.error === '') {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};
7;

const homeKlvChartCall = async (
  days?: IDaysCoins,
): Promise<IGeckoChartResponse | undefined> => {
  try {
    const res = await api.get({
      route: `coins/klever/market_chart?vs_currency=usd&days=${days?.KLV || 1}`,
      service: Service.GECKO,
    });

    if (!res.error || res.error === '') {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

const homeKfiDataCall = async (): Promise<IGeckoResponse | undefined> => {
  try {
    const res = await api.get({
      route: 'coins/klever-finance',
      service: Service.GECKO,
    });

    if (!res.error || res.error === '') {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

export interface IHomeKFIChartCall {
  market_caps: {
    [key: number]: number;
  };
  prices: {
    [key: number]: number;
  };
  total_volumes: {
    [key: number]: number;
  };
}

const homeKfiChartCall = async (
  days?: IDaysCoins,
): Promise<IGeckoChartResponse | undefined> => {
  try {
    const res = await api.get({
      route: `coins/klever-finance/market_chart?vs_currency=usd&days=${
        days?.KFI || 1
      }`,
      service: Service.GECKO,
    });

    if (!res.error || res.error === '') {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

const homeKlvCall = async (): Promise<IAssetData | undefined> => {
  try {
    const res = await api.get({
      route: `assets/KLV?minify=true`,
    });

    if (!res.error || res.error === '') {
      const initialKlv = 0;

      const klvData: IAssetData = {
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
      };
      klvData.estimatedAprYesterday = calcApr(res?.data.asset, 4, 0) * 100;
      klvData.estimatedAprBeforeYesterday =
        calcApr(res?.data.asset, 4, 4) * 100;

      if (klvData.staking) {
        klvData.staking.totalStaking =
          res?.data?.asset?.staking?.totalStaked / 1000000 || null;
        klvData.staking.dayBeforeTotalStaking =
          res?.data?.asset?.staking?.fpr
            .slice(-4)
            .reduce(
              (acc: number, curr: { totalStaked: number }) =>
                acc + curr.totalStaked,
              initialKlv,
            ) /
          (4 * 1000000);
      }

      klvData.circulatingSupply =
        res?.data?.asset?.circulatingSupply / 1000000 || null;

      return klvData;
    }
  } catch (error) {
    console.error(error);
  }
};

const homeKfiCall = async (): Promise<IAssetData | undefined> => {
  try {
    const res = await api.get({
      route: `assets/KFI?minify=true`,
    });

    if (!res.error || res.error === '') {
      const initialKfi = 0;

      const kfiData: IAssetData = {
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
      };

      kfiData.estimatedAprYesterday = calcApr(res?.data.asset, 4, 0);
      kfiData.estimatedAprBeforeYesterday = calcApr(res?.data.asset, 4, 4);

      if (kfiData.staking) {
        kfiData.staking.totalStaking =
          res?.data?.asset?.staking?.totalStaked / 1000000 || null;

        kfiData.staking.dayBeforeTotalStaking =
          res?.data?.asset?.staking?.fpr
            .slice(-4)
            .reduce(
              (acc: number, curr: { totalStaked: number }) =>
                acc + curr.totalStaked,
              initialKfi,
            ) /
          (4 * 1000000);
        // sum last 4 total staked positions and divide by 4
      }

      kfiData.circulatingSupply = res?.data?.asset?.circulatingSupply / 1000000;
      return kfiData;
    }
  } catch (error) {
    console.error(error);
  }
};

interface HomeKFiPriceCallInterface {
  kfiVolume: number | null;
  kfiPricesTodaysPrice: number | null;
  kfiPricesVariation: number | null;
  kfipricesYesterdayPrice: number | null;
}

const homeKfiPriceCall = async (): Promise<
  HomeKFiPriceCallInterface | undefined
> => {
  try {
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
      const data = res?.data?.prices?.Exchanges.find(
        (exchange: any) => exchange.ExchangeName === 'Klever',
      );

      if (!data) return;

      const kfiPriceData: HomeKFiPriceCallInterface = {
        kfiVolume: data.Volume ?? null,
        kfiPricesTodaysPrice: data.Price ?? null,
        kfiPricesVariation: data.PriceVariation ?? null,
        kfipricesYesterdayPrice: null,
      };

      if (data.Price && data.PriceVariation) {
        kfiPriceData.kfipricesYesterdayPrice = data.Price - data.PriceVariation;
      }

      return kfiPriceData;
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  defaultAggregateData,
  homeAccountsCall,
  homeActiveProposalsCall,
  homeBeforeYesterdayTransactionsCall,
  homeGetAggregateCall,
  homeGetBlocksCall,
  homeKfiCall,
  homeKfiChartCall,
  homeKfiDataCall,
  homeKfiPriceCall,
  homeKlvCall,
  homeKlvChartCall,
  homeKlvDataCall,
  homeProposalsCall,
  homeTotalActiveValidators,
  homeTotalValidators,
  homeTransactionsCall,
  homeYesterdayAccountsCall,
};
