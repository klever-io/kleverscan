import {
  IHome,
  ITransactionListResponse,
  IAccountResponse,
  IBlockResponse,
  IGeckoResponse,
  IYesterdayResponse,
  IGeckoChartResponse,
  ITransactionResponse,
} from '../../types';

import api, { Service } from '@/services/api';

const HomeServerSideProps = async () => {
  const props: IHome = {
    blocks: [],
    transactions: [],
    transactionsList: [],
    totalAccounts: 0,
    totalTransactions: 0,
    tps: '0/0',
    coinsData: [],
    yeasterdayTransactions: 0,
  };

  const blocksCall = new Promise<IBlockResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'block/list',
        refreshTime: 4,
      }),
    ),
  );

  const transactionsCall = new Promise<ITransactionResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'transaction/list',
      }),
    ),
  );

  const transactionsListCall = new Promise<ITransactionListResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'transaction/list/count/15',
      }),
    ),
  );
  const accountsCall = new Promise<IAccountResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'address/list',
      }),
    ),
  );

  const statisticsCall = new Promise<IAccountResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'node/statistics',
        service: Service.NODE,
      }),
    ),
  );

  const pushCoinData = (
    name: string,
    shortname: string,
    response: IGeckoResponse,
    chart: IGeckoChartResponse,
  ) => {
    props.coinsData.push({
      name,
      shortname,
      price: response?.market_data?.current_price.usd,
      variation: response?.market_data?.price_change_percentage_24h,
      marketCap: {
        price: response?.market_data?.market_cap.usd,
        variation: response?.market_data?.market_cap_change_percentage_24h,
      },
      volume: {
        price: response?.market_data?.total_volume.usd,
        variation: 0,
      },
      prices: chart.prices?.map(item => ({ value: item[1] })),
    });
  };

  const klvDataCall = new Promise<IGeckoResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'coins/klever',
        service: Service.GECKO,
      }),
    ),
  );
  const klvChartCall = new Promise<IGeckoChartResponse>(resolve =>
    resolve(
      api.getCached({
        route: `coins/klever/market_chart?vs_currency=usd&days=1`,
        service: Service.GECKO,
      }),
    ),
  );

  const kfiDataCall = new Promise<IGeckoResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'coins/klever-finance',
        service: Service.GECKO,
      }),
    ),
  );
  const kfiChartCall = new Promise<IGeckoChartResponse>(resolve =>
    resolve(
      api.getCached({
        route: `coins/klever-finance/market_chart?vs_currency=usd&days=1`,
        service: Service.GECKO,
      }),
    ),
  );

  const yesterdayTransactionsCall = new Promise<IYesterdayResponse>(resolve =>
    resolve(
      api.getCached({
        route: 'transaction/list/count/1',
      }),
    ),
  );

  const [
    blocks,
    transactions,
    transactionsList,
    accounts,
    statistics,
    klvData,
    klvChart,
    kfiData,
    kfiChart,
    yesterdayTransactions,
  ] = await Promise.all([
    blocksCall,
    transactionsCall,
    transactionsListCall,
    accountsCall,
    statisticsCall,
    klvDataCall,
    klvChartCall,
    kfiDataCall,
    kfiChartCall,
    yesterdayTransactionsCall,
  ]);

  if (!blocks.error) {
    props.blocks = blocks.data.blocks;
  }

  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalTransactions = transactions.pagination.totalRecords;
  }

  if (!transactionsList.error) {
    const { number_by_day } = transactionsList.data;
    props.transactionsList = number_by_day;
  }
  if (!accounts.error) {
    props.totalAccounts = accounts.pagination.totalRecords;
  }
  if (!statistics.error) {
    const chainStatistics = statistics.data.statistics.chainStatistics;

    props.tps = `${chainStatistics.liveTPS}/${chainStatistics.peakTPS}`;
  }
  pushCoinData('Klever', 'KLV', klvData, klvChart);
  // Currently hardcoded marketcap
  kfiData.market_data.market_cap.usd =
    150000 * kfiData.market_data.current_price.usd;
  pushCoinData('Klever Finance', 'KFI', kfiData, kfiChart);

  if (!yesterdayTransactions.error) {
    props.yeasterdayTransactions =
      yesterdayTransactions.data.number_by_day[0].doc_count;
  }

  return { props };
};

export default HomeServerSideProps;
