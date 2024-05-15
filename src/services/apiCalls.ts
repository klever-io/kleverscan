import api from '@/services/api';
import { IPagination } from '@/types';
import { IBlockResponse, IBlockStats } from '@/types/blocks';

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

export const yesterdayStatisticsCall = async (): Promise<IBlockStats> => {
  const res = await api.get({
    route: 'block/statistics-by-day/1',
  });

  if (!res.error || res.error === '') {
    return res.data.block_stats_by_day[0];
  } else {
    return res.error;
  }
};

export const totalStatisticsCall = async (): Promise<IBlockStats> => {
  const res = await api.get({
    route: 'block/statistics-total/0',
  });

  if (!res.error || res.error === '') {
    return res.data.block_stats_total;
  } else {
    return res.error;
  }
};

export const defaultPagination: IPagination = {
  totalPages: 1,
  next: 1,
  perPage: 10,
  previous: 1,
  self: 1,
  totalRecords: 10,
};
