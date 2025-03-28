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
  useApiProxy?: boolean;
  requestMode?: RequestMode;
  tries?: number;
}

export interface IDirectusRequestProps {
  requestParams: any[];
  requestFunction: string;
  tries?: number;
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
    [Service.GECKO]: 'https://api.coingecko.com/api/v3',
    [Service.MULTISIGN]:
      process.env.DEFAULT_API_MULTISIGN ||
      'https://multisign.testnet.klever.org',
    [Service.EXPLORER]:
      process.env.DEFAULT_EXPLORER_HOST || 'https://testnet.kleverscan.org',
    [Service.CDN]: process.env.DEFAULT_CDN_HOST || 'https://cdn.klever.io',
  };

  let host = hostService[service || 0];
  port = process.env.DEFAULT_API_PORT || ''; // for reference: used to be 443
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
    if (props.useApiProxy) {
      try {
        // use next api as proxy for get requests, to avoid gecko errors (when fetching prices)
        const response = await fetch('/api/proxy', {
          method: Method.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...getProps(props),
            method: method.toString(),
          }),
        });

        return response.json();
      } catch (error) {
        return { data: null, error, code: 'internal_error', pagination };
      }
    } else if (!props.useApiProxy) {
      try {
        const { route, query, service, apiVersion } = getProps(props);
        const requestMode: RequestMode = props?.requestMode ?? 'cors';

        const response = await fetch(
          getHost(route, query, service, apiVersion),
          {
            method: method.toString(),
            headers: {
              'Content-Type': 'application/json',
            },
            mode: requestMode,
          },
        );

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
    if (props.useApiProxy) {
      try {
        // use next api as proxy for post requests, to avoid cors from api-gateway (when fetching prices)
        const response = await fetch('/api/proxy', {
          method: method.toString(),
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...getProps(props),
            method: method.toString(),
          }),
        });

        return response.json();
      } catch (error) {
        return { data: null, error, code: 'internal_error', pagination };
      }
    } else if (!props.useApiProxy) {
      try {
        const { route, body, query, service, apiVersion } = getProps(props);
        const requestMode: RequestMode = props?.requestMode ?? 'cors';

        const response = await fetch(
          getHost(route, query, service, apiVersion),
          {
            method: method.toString(),
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            mode: requestMode,
          },
        );
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
export const withDirectus = async (
  props: IDirectusRequestProps,
): Promise<any> => {
  const request = async () => {
    try {
      // use next api as proxy for post requests, to avoid cors from api-gateway (when fetching prices)
      const response = await fetch('/api/directus', {
        method: Method.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...props,
        }),
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
  directus: async (props: IDirectusRequestProps): Promise<any> =>
    withTimeout(withDirectus(props)),
};

export default api;
