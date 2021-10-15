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

export interface IProps {
  route: string;
  query?: IQuery;
  body?: any;
  apiVersion?: string;
}

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getHost = (route: string, query: IQuery, apiVersion: string) => {
  let host =
    process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.finance';
  let port = process.env.DEFAULT_API_PORT || '443';
  let urlParam = '';

  if (!host) {
    host = 'localhost';
  } else if (host.substr(host.length - 1) === '/') {
    host = host.substring(0, host.length - 1);
  }

  if (!port) {
    port = '';
  }

  if (query) {
    urlParam = `?${buildUrlQuery(query)}`;
  }

  return `${host}${port && `:${port}`}/${apiVersion}/${route}${urlParam}`;
};

const getProps = (props: IProps) => {
  const defaultValues: IProps = {
    route: '/',
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
    const { route, query, apiVersion } = getProps(props);

    const response = await fetch(getHost(route, query, apiVersion), {
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
    const { route, body, query, apiVersion } = getProps(props);

    const response = await fetch(getHost(route, query, apiVersion), {
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

const getPrices = async (): Promise<any> => {
  try {
    const host =
      process.env.DEFAULT_PRICE_HOST ||
      'https://prices.endpoints.services.klever.io/v1';

    const response = await fetch(`${host}/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ names: ['KLV/USD'] }),
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: response.statusText,
        code: 'internal_error',
      });
    }

    const symbols: { symbols: IPrice[] } = await response.json();

    return Promise.resolve({
      data: symbols,
      error: '',
      code: 'successful',
    });
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

const api = {
  get: async (props: IProps): Promise<any> => withoutBody(props, Method.GET),
  post: async (props: IProps): Promise<any> => withBody(props, Method.POST),
  getPrices,
};

export default api;
