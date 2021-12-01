enum Method {
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

export enum Service {
  PROXY,
  PRICE,
  NODE,
  GECKO,
}

export interface IProps {
  route: string;
  query?: IQuery;
  body?: any;
  apiVersion?: string;
  service?: Service;
}

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getHost = (
  route: string,
  query: IQuery,
  service: Service,
  apiVersion: string,
) => {
  const hostService = {
    [Service.PROXY]:
      process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.finance',
    [Service.PRICE]:
      process.env.DEFAULT_PRICE_HOST ||
      'https://prices.endpoints.services.klever.io/v1',
    [Service.NODE]:
      process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.finance',
    [Service.GECKO]: 'https://api.coingecko.com/api/v3',
  };

  let host = hostService[service];
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

const getProps = (props: IProps) => {
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
      return defaultValues[name];
    }

    return undefined;
  };

  const handler = { get };

  return new Proxy(props, handler);
};

const withoutBody = async (props: IProps, method: Method): Promise<any> => {
  try {
    const { route, query, service, apiVersion } = getProps(props);

    if (service === Service.PRICE) {
      // console.log(getHost(route, query, service, apiVersion));
    }

    const response = await fetch(getHost(route, query, service, apiVersion), {
      method: method.toString(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: response.statusText,
        code: 'internal_error',
      });
    }

    return response.json();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

const withBody = async (props: IProps, method: Method): Promise<any> => {
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
      return Promise.resolve({
        data: null,
        error: response.statusText,
        code: 'internal_error',
      });
    }

    return response.json();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error ' });
  }
};

const withTimeout = async (promise: Promise<any>, timeout = 5000) => {
  return Promise.race([
    promise,
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: null, error: 'Fetch timeout', code: 'internal_error' });
      }, timeout);
    }),
  ]);
};

const api = {
  get: async (props: IProps): Promise<any> =>
    withTimeout(withoutBody(props, Method.GET)),
  post: async (props: IProps): Promise<any> =>
    withTimeout(withBody(props, Method.POST)),
};

export default api;
