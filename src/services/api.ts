enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IQuery {
  [key: string]: any;
}

export interface IProps {
  route: string;
  query?: IQuery;
  apiVersion?: string;
}

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getHost = (route: string, query: IQuery, apiVersion: string) => {
  let host = process.env.DEFAULT_HOST;
  let port = process.env.DEFAULT_PORT;
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
    apiVersion: process.env.DEFAULT_API_VERSION,
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

const api = {
  get: async (props: IProps): Promise<any> => withoutBody(props, Method.GET),
};

export default api;
