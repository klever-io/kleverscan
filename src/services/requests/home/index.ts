import { IDaysCoins } from '@/contexts/mainPage';
import api from '@/services/api';
import {
  IAggregate,
  IAggregateResponse,
  IAsset,
  IAssetData,
  IEpochInfo,
  IGeckoChartResponse,
  IGeckoResponse,
  ITransaction,
  Node,
  Service,
} from '@/types';
import { IBlock, IBlocksResponse } from '@/types/blocks';
import { IProposal, MostTransferredToken } from '@/types/proposals';
import { getEpochInfo } from '@/utils';
import { calcApr } from '@/utils/calcApr';
import { toLocaleFixed } from '@/utils/formatFunctions';

const defaultAggregateData = {
  livePeakTPS: '0',
  metrics: {
    currentSlot: 0,
    epochFinishSlot: 0,
    epochLoadPercent: 0,
    remainingTime: '0',
  },
};

interface HomeAggregateCallResponse extends IAggregate {
  livePeakTPS: string;
  metrics: IEpochInfo;
}

const homeGetAggregateCall = async (): Promise<
  HomeAggregateCallResponse | undefined
> => {
  try {
    const aggregate: IAggregateResponse = await api.get({
      route: 'node/aggregate',
      service: Service.PROXY,
    });

    if (!aggregate.error) {
      const chainStatistics = aggregate.data.statistics;

      return {
        ...aggregate.data,
        livePeakTPS:
          toLocaleFixed(chainStatistics.liveTPS, 2) +
          '/' +
          toLocaleFixed(chainStatistics.peakTPS, 2),

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
  { totalTransactions: number; transactions: ITransaction[] } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list',
      query: {
        minify: true,
        limit: 1,
      },
    });
    if (res.error) {
      console.error(res.error);
    }
    return {
      totalTransactions: res.pagination.totalRecords,
      transactions: res.data.transactions,
    };
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
      return { totalProposals: res.pagination.totalRecords };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeLastApprovedProposalCall = async (): Promise<
  { approvedProposal: IProposal } | undefined
> => {
  try {
    const res = await api.get({
      route: 'proposals/list',
      query: {
        status: 'ApprovedProposal',
        limit: 1,
      },
    });
    if (!res.error || res.error === '') {
      return { approvedProposal: res.data.proposals?.[0] };
    }
  } catch (error) {
    console.error(error);
  }
};

const homeActiveProposalsCall = async (): Promise<
  | {
      totalActiveProposals: number;
      activeProposals: IProposal[];
    }
  | undefined
> => {
  try {
    const res = await api.get({
      route: 'proposals/list',
      query: {
        status: 'ActiveProposal',
        limit: 2,
      },
    });
    if (!res.error || res.error === '') {
      return {
        totalActiveProposals: res.pagination.totalRecords,
        activeProposals: res.data.proposals,
      };
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

const homeNodes = async (): Promise<
  | {
      nodes: Node[];
    }
  | undefined
> => {
  try {
    const res = await api.get({
      route: 'node/locations',
    });
    if (!res.error || res.error === '') {
      return { nodes: res.data.locations };
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
    const response = await api.post({
      route: `prices`,
      service: Service.KPRICES,
      body: [
        {
          base: 'KFI',
          quote: 'USD',
        },
      ],
      useApiPrice: true,
    });

    if (!response.error || response.error === '') {
      const kfiPriceData: HomeKFiPriceCallInterface = {
        kfiVolume: response[0]?.['24h_vol'],
        kfiPricesTodaysPrice: response[0]?.price,
        kfiPricesVariation: response[0]?.['24h_change'] / 100,
        kfipricesYesterdayPrice: null,
      };

      if (response[0]?.price && response[0]?.['24h_change']) {
        kfiPriceData.kfipricesYesterdayPrice =
          response[0]?.price - response[0]?.['24h_change'] / 100;
      }

      return kfiPriceData;
    }
  } catch (error) {
    console.error(error);
  }
};

const homeMostTransactedTokens = async (): Promise<
  MostTransferredToken[] | undefined
> => {
  try {
    const mostTransactedRes = await api.get({
      route: 'transaction/statistics',
      query: {
        assetType: 'Fungible',
      },
    });

    if (mostTransactedRes.error) {
      console.error(mostTransactedRes.error);
      return;
    }

    const assetsRes = await api.get({
      route: 'assets/list',
      query: {
        asset: mostTransactedRes.data.most_transacted.map(
          (token: MostTransferredToken) => token.key,
        ),
      },
    });

    const data = mostTransactedRes.data.most_transacted.map(
      (token: MostTransferredToken) => {
        const asset = assetsRes.data.assets.find(
          (asset: IAsset) => asset.assetId === token.key,
        );
        return {
          ...token,
          logo: asset.logo || '',
        };
      },
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};

const homeMostTransactedNFTs = async (): Promise<
  MostTransferredToken[] | undefined
> => {
  try {
    const mostTransactedRes = await api.get({
      route: 'transaction/statistics',
      query: {
        assetType: 'NonFungible',
      },
    });

    if (mostTransactedRes.error) {
      console.error(mostTransactedRes.error);
      return;
    }

    const assetsRes = await api.get({
      route: 'assets/list',
      query: {
        asset: mostTransactedRes.data.most_transacted.map(
          (token: MostTransferredToken) => token.key,
        ),
      },
    });

    const data = mostTransactedRes.data.most_transacted.map(
      (token: MostTransferredToken) => {
        const asset = assetsRes.data.assets.find(
          (asset: IAsset) => asset.assetId === token.key,
        );
        return {
          ...token,
          logo: asset.logo || '',
        };
      },
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};
const homeMostTransactedKDAFee = async (): Promise<
  MostTransferredToken[] | undefined
> => {
  try {
    const mostTransactedRes = await api.get({
      route: 'transaction/statistics',
      query: {
        type: 'kdafee',
      },
    });

    if (mostTransactedRes.error) {
      console.error(mostTransactedRes.error);
      return;
    }

    const assetsRes = await api.get({
      route: 'assets/list',
      query: {
        asset: mostTransactedRes.data.most_transacted.map(
          (token: MostTransferredToken) => token.key,
        ),
      },
    });

    const data = mostTransactedRes.data.most_transacted.map(
      (token: MostTransferredToken) => {
        const asset = assetsRes.data.assets.find(
          (asset: IAsset) => asset.assetId === token.key,
        );
        return {
          ...token,
          logo: asset.logo || '',
        };
      },
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};

const homeHotContracts = async (): Promise<
  { hotContracts: MostTransferredToken[] } | undefined
> => {
  try {
    const hotContractsRes = await api.get({
      route: 'sc/statistics',
    });

    if (!hotContractsRes.error || hotContractsRes.error === '') {
      return { hotContracts: hotContractsRes.data };
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
  homeLastApprovedProposalCall,
  homeMostTransactedKDAFee,
  homeMostTransactedNFTs,
  homeMostTransactedTokens,
  homeNodes,
  homeProposalsCall,
  homeTotalActiveValidators,
  homeTotalValidators,
  homeTransactionsCall,
  homeYesterdayAccountsCall,
  homeHotContracts,
};
