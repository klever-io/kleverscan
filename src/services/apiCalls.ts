import api from '@/services/api';
import { IBlockResponse, IStatisticsResponse } from '@/types/blocks';

export const blockCall = async (
  page = 1,
  limit = 10,
): Promise<IBlockResponse> =>
  new Promise<IBlockResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: `block/list?page=${page}&limit=${limit}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

export const yesterdayStatisticsCall = async (): Promise<IStatisticsResponse> =>
  new Promise<IStatisticsResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: 'block/statistics-by-day/1',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

export const totalStatisticsCall = async (): Promise<IStatisticsResponse> =>
  new Promise<IStatisticsResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: 'block/statistics-total/0',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });
