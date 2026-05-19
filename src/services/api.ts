import { Service } from '@/types/index';
import { asyncDoIf } from '@/utils/promiseFunctions';

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
  requestMode?: RequestMode;
  tries?: number;
}

export interface IAssetInfoRequestProps {
  assetId: string;
  tries?: number;
}

export interface IPriceRequestProps {
  base: 'KLV' | 'KFI';
  tries?: number;
}

export interface ICoinGeckoRequestProps {
  base: 'KLV' | 'KFI';
  tries?: number;
}

export interface ICoinGeckoMarketChartRequestProps
  extends ICoinGeckoRequestProps {
  days?: string | number;
}

const pagination = {
  self: 0,
  next: 0,
  previous: 0,
  perPage: 0,
  totalPages: 0,
  totalRecords: 0,
};

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

export const getHost = (
  route: string,
  query: IQuery | undefined,
  service: Service | undefined,
  apiVersion: string | undefined,
  port?: string,
): string => {
  const hostService = {
    [Service.PROXY]:
      process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.org',
    [Service.NODE]:
      process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.org',
    [Service.MULTISIGN]:
      process.env.DEFAULT_API_MULTISIGN ||
      'https://multisign.testnet.klever.org',
    [Service.EXPLORER]:
      process.env.DEFAULT_EXPLORER_HOST ||
      (typeof window !== 'undefined' ? window.location.origin : undefined) ||
      'https://testnet.kleverscan.org',
    [Service.CDN]: process.env.DEFAULT_CDN_HOST || 'https://cdn.klever.io',
  };

  let host = hostService[service || 0];
  port = process.env.DEFAULT_API_PORT || ''; // for reference: used to be 443
  let urlParam = '';

  if (host.at(-1) === '/') {
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
  };

  const get = (target: any, name: string) => {
    if (name in target) {
      return target[name];
    }

    if (name in defaultValues) {
      return defaultValues[name as keyof IProps];
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
      const requestMode: RequestMode = props?.requestMode ?? 'cors';

      const response = await fetch(getHost(route, query, service, apiVersion), {
        method: method.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: requestMode,
      });

      if (!response.ok) {
        return {
          data: null,
          error: (await response.json()).error,
          code: 'internal_error',
          pagination,
        };
      }

      return response.json();
    } catch (error) {
      return {
        data: null,
        error,
        code: 'internal_error',
        pagination,
      };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withBody = async (props: IProps, method: Method): Promise<any> => {
  const request = async () => {
    try {
      const { route, body, query, service, apiVersion } = getProps(props);
      const requestMode: RequestMode = props?.requestMode ?? 'cors';

      const response = await fetch(getHost(route, query, service, apiVersion), {
        method: method.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        mode: requestMode,
      });
      let resJson;

      try {
        resJson = await response.json();
      } catch (error) {
        if (!response.ok) {
          return {
            data: null,
            error: 'Could not parse response',
            code: 'internal_error',
            pagination,
          };
        }

        return {
          data: null,
          error: '',
          code: '',
        };
      }

      if (!response.ok) {
        return {
          data: null,
          error: resJson.error,
          code: 'internal_error',
          pagination,
        };
      }

      return resJson;
    } catch (error) {
      return { data: null, error, code: 'internal_error', pagination };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withPrice = async (props: IPriceRequestProps): Promise<any> => {
  const request = async () => {
    try {
      const response = await fetch(
        `/api/get-prices?base=${encodeURIComponent(props.base)}`,
        {
          method: Method.GET,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error', pagination };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withCoinGeckoCoin = async (
  props: ICoinGeckoRequestProps,
): Promise<any> => {
  const request = async () => {
    try {
      const response = await fetch(
        `/api/coingecko/coin?base=${encodeURIComponent(props.base)}`,
        {
          method: Method.GET,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error', pagination };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withCoinGeckoMarketChart = async (
  props: ICoinGeckoMarketChartRequestProps,
): Promise<any> => {
  const request = async () => {
    try {
      const query = new URLSearchParams({
        base: props.base,
        days: String(props.days || 1),
      });
      const response = await fetch(`/api/coingecko/market-chart?${query}`, {
        method: Method.GET,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error', pagination };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withAssetInfo = async (
  props: IAssetInfoRequestProps,
): Promise<any> => {
  const request = async () => {
    try {
      const response = await fetch(
        `/api/asset-info?asset_id=${encodeURIComponent(props.assetId)}`,
        {
          method: Method.GET,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.json();
    } catch (error) {
      return { data: null, error, code: 'internal_error', pagination };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    props.tries || 3,
  );

  return result;
};

export const withText = async (
  props: IProps,
  method: Method,
  tries = 3,
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
          pagination,
        };
      }

      return response.text();
    } catch (error) {
      return {
        data: null,
        error,
        code: 'internal_error',
        pagination,
      };
    }
  };

  let result: any;

  await asyncDoIf(
    res => (result = res),
    err => (result = Promise.resolve(err)),
    () => request(),
    tries,
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
        resolve({
          data: null,
          error: 'Fetch timeout',
          code: 'internal_error',
          pagination,
        });
      }, timeout);
    }),
  ]);
};

const api = {
  get: async (props: IProps): Promise<any> =>
    withTimeout(withoutBody(props, Method.GET)),
  post: async (props: IProps): Promise<any> =>
    withTimeout(withBody(props, Method.POST)),
  text: async (props: IProps): Promise<any> =>
    withTimeout(withText(props, Method.GET)),
  assetInfo: async (props: IAssetInfoRequestProps): Promise<any> =>
    withTimeout(withAssetInfo(props)),
  price: async (props: IPriceRequestProps): Promise<any> =>
    withTimeout(withPrice(props)),
  coinGeckoCoin: async (props: ICoinGeckoRequestProps): Promise<any> =>
    withTimeout(withCoinGeckoCoin(props)),
  coinGeckoMarketChart: async (
    props: ICoinGeckoMarketChartRequestProps,
  ): Promise<any> => withTimeout(withCoinGeckoMarketChart(props)),
};

export default api;
