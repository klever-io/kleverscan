import { Service } from '@/types/index';
import { asyncDoIf } from '../utils';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IQuery {
  [key: string]: any;
}

export interface IPrice {
  name: string;
  price: number;
}

export interface IProps {
  route: string;
  query?: IQuery;
  body?: any;
  apiVersion?: string;
  service?: Service;
  refreshTime?: number;
}

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

export const getHost = (
  route: string,
  query: IQuery | undefined,
  service: Service | undefined,
  apiVersion: string | undefined,
): string => {
  const hostService = {
    [Service.PROXY]:
      process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.finance',
    [Service.PRICE]:
      process.env.DEFAULT_PRICE_HOST ||
      'https://prices.endpoints.services.klever.io/v1',
    [Service.NODE]:
      process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.finance',
    [Service.GECKO]: 'https://api.coingecko.com/api/v3',
    [Service.EXPLORER]:
      process.env.DEFAULT_EXPLORER_HOST || 'https://testnet.kleverscan.org',
  };

  let host = hostService[service || 0];
  let port = process.env.DEFAULT_API_PORT || '443';
  let urlParam = '';

  if (host.substr(host.length - 1) === '/') {
    host = host.substring(0, host.length - 1);
  }

  if (service === Service.PROXY) {
    if (port) {
      port = `:${port}`;
    }

    host = `${host}${port}/${apiVersion}`;
  }

  if (query) {
    urlParam = `?${buildUrlQuery(query)}`;
  }
  return `${host}/${route}${urlParam}`;
};

export const getProps = (props: IProps): IProps => {
  const defaultValues: IProps = {
    route: '/',
    service: Service.PROXY,
    apiVersion: process.env.DEFAULT_API_VERSION || 'v1.0',
    refreshTime: 60,
  };

  const get = (target: any, name: string) => {
    if (name in target) {
      return target[name];
    }

    if (name in defaultValues) {
      return defaultValues[name];
    }

    return undefined;
  };

  const handler = { get };

  return new Proxy(props, handler);
};

export const withoutBody = async (
  props: IProps,
  method: Method,
): Promise<any> => {
  const request = async () => {
    try {
      const { route, query, service, apiVersion } = getProps(props);

      const response = await fetch(getHost(route, query, service, apiVersion), {
        method: method.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: (await response.json()).error,
          code: 'internal_error',
        };
      }

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error' };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
  );

  return result;
};

export const withBody = async (props: IProps, method: Method): Promise<any> => {
  const request = async () => {
    try {
      const { route, body, query, service, apiVersion } = getProps(props);
      const response = await fetch(getHost(route, query, service, apiVersion), {
        method: method.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          data: null,
          error: (await response.json()).error,
          code: 'internal_error',
        };
      }

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error' };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
  );

  return result;
};

export const withText = async (props: IProps, method: Method): Promise<any> => {
  const request = async () => {
    try {
      const { route, query, service, apiVersion } = getProps(props);

      const response = await fetch(getHost(route, query, service, apiVersion), {
        method: method.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: (await response.json()).error,
          code: 'internal_error',
        };
      }

      return response.text();
    } catch (error) {
      return { data: null, error, code: 'internal_error' };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
  );

  return result;
};

export const withTimeout = async (
  promise: Promise<any>,
  timeout = 10000,
): Promise<any> => {
  return Promise.race([
    promise,
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: null, error: 'Fetch timeout', code: 'internal_error' });
      }, timeout);
    }),
  ]);
};

export const getCached = async (props: IProps): Promise<any> => {
  const request = async () => {
    try {
      const { route, query, service, apiVersion, refreshTime } =
        getProps(props);

      const body = { route, service, refreshTime };

      const response = await fetch(
        getHost('api/data', query, Service.EXPLORER, apiVersion),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        return {
          data: null,
          error: (await response.json()).error,
          code: 'internal_error',
        };
      }

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error' };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
  );

  return result;
};

const api = {
  get: async (props: IProps): Promise<any> =>
    withTimeout(withoutBody(props, Method.GET)),
  post: async (props: IProps): Promise<any> =>
    withTimeout(withBody(props, Method.POST)),
  text: async (props: IProps): Promise<any> =>
    withTimeout(withText(props, Method.GET)),
  getCached,
};

export default api;
