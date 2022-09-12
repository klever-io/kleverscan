import api from '@/services/api';
import { IBlockResponse, IStatisticsResponse } from '@/types/blocks';

export const blockCall = new Promise<IBlockResponse>(
  async (resolve, reject) => {
    const res = await api.get({
      route: 'block/list',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  },
);

export const yesterdayStatisticsCall = new Promise<IStatisticsResponse>(
  async (resolve, reject) => {
    const res = await api.get({
      route: 'block/statistics-by-day/1',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  },
);

export const totalStatisticsCall = new Promise<IStatisticsResponse>(
  async (resolve, reject) => {
    const res = await api.get({
      route: 'block/statistics-total/0',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  },
);
