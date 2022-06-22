import Redis from 'ioredis';

import type { NextApiRequest, NextApiResponse } from 'next';

import { IResponse } from '@/types/index';
import api from '@/services/api';
import { Service } from '@/types/index';

const redis = new Redis({
  host: process.env.DEFAULT_REDIS_HOST || '10.196.89.28',
  port: Number(process.env.DEFAULT_REDIS_PORT) || 6379,
  connectTimeout: Number(process.env.DEFAULT_REDIS_CONNECT_TIMEOUT) || 5000,
});

interface IProps {
  route: string;
  service: Service;
  refreshTime: number;
}

interface DataResponse extends IResponse {
  data: any;
}

const middleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const { route, service, refreshTime }: IProps = req.body;
  if (redis.status === 'ready') {
    let cache = await redis.get(`cache::${route}`);

    if (cache) {
      cache = JSON.parse(cache);

      res.status(200).json(cache);
    } else {
      const response: DataResponse = await api.get({ route, service });

      if (!response.error) {
        redis.set(
          `cache::${route}`,
          JSON.stringify(response),
          'EX',
          refreshTime,
        );
      }

      res.status(200).json(response);
    }
  } else {
    const response: DataResponse = await api.get({ route, service });

    res.status(200).json(response);
  }
};

export default middleware;
