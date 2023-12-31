import { Service } from '../../types';
import api, {
  getHost,
  getProps,
  Method,
  withBody,
  withoutBody,
  withText,
  withTimeout,
} from '../api';
import mocks from './mocks';

interface IPricesResponse {
  price: number;
  timestamp: string;
}

describe('test api functions', () => {
  const defaultProps = {
    route: '/',
    service: Service.PROXY,
    apiVersion: process.env.DEFAULT_API_VERSION || 'v1.0',
  };

  const props1 = {
    route: 'address/list',
  };

  const props2 = {
    route: 'node/statistics',
    service: Service.PROXY,
  };

  const props3 = {
    route: 'node/overview',
    service: Service.PROXY,
  };

  const props4 = {
    route: 'transaction/list',
  };

  const query = {
    asset: 'KLV',
    page: 0,
    status: 'success',
    type: '0',
  };
  const propsQuery = {
    query,
    route: 'transaction/list',
  };

  const propsBody = {
    route: 'prices',
    service: 1,
    body: {
      names: ['KLV/USD'],
    },
  };

  const paginationOnError = {
    self: 0,
    next: 0,
    previous: 0,
    perPage: 0,
    totalPages: 0,
    totalRecords: 0,
  };

  describe('getProps function', () => {
    test('if default values are returned', () => {
      expect(getProps(defaultProps)).toStrictEqual(defaultProps);
    });
    test('if it returns correct props through the proxy instance', () => {
      expect(getProps(props1)).toStrictEqual(props1);
      const { route, query, service, apiVersion } = getProps(props1);
      expect(route).toEqual('address/list');
      expect(query).toEqual(undefined);
      expect(service).toEqual(0);
      expect(apiVersion).toEqual('v1.0');
    });
    test('if it returns correct props through the proxy instance', () => {
      expect(getProps(props2)).toStrictEqual(props2);
      const { route, query, service, apiVersion } = getProps(props2);
      expect(route).toEqual('node/statistics');
      expect(query).toEqual(undefined);
      expect(service).toEqual(Service.PROXY);
      expect(apiVersion).toEqual('v1.0');
    });
  });

  describe('getHost function', () => {
    test('with defaultProps', () => {
      const { route, query, service, apiVersion } = getProps(defaultProps);
      expect(getHost(route, query, service, apiVersion)).toEqual(
        'https://api.testnet.klever.finance/v1.0//',
      );
    });
    test('props with query', () => {
      const { route, query, service, apiVersion } = getProps(propsQuery);
      expect(getHost(route, query, service, apiVersion)).toEqual(
        'https://api.testnet.klever.finance/v1.0/transaction/list?asset=KLV&page=0&status=success&type=0',
      );
    });
  });

  describe('withoutBody function', () => {
    afterEach(() => {
      (fetch as jest.Mock).mockRestore();
    });
    describe('address route', () => {
      test('successful fetch with address route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocks.accounts),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://api.testnet.klever.finance/v1.0/address/list',
          }),
        );
        const res = await withoutBody(props1, Method.GET, 1);
        expect(res).toStrictEqual(mocks.accounts);
      });

      test('failed fetch with address route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.reject('generic error'),
        );
        const res = await withoutBody(props1, Method.GET, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'generic error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });

      test('successful fetch but status not ok', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Internal Server Error' }),
            headers: Headers,
            redirected: false,
            status: 500,
            statusText: 'Internal Server Error',
            type: 'cors',
            url: 'https://api.testnet.klever.finance/v1.0/address/list',
          }),
        );

        const res = await withoutBody(props1, Method.GET, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'Internal Server Error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });
    });

    describe('statistics route', () => {
      test('successful fetch', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocks.statistics),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://api.testnet.klever.finance/node/statistics',
          }),
        );

        const res = await withoutBody(props2, Method.GET);
        expect(res).toStrictEqual(mocks.statistics);
      });

      test('failed fetch with statistics route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.reject('generic error'),
        );
        const res = await withoutBody(props2, Method.GET, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'generic error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });

      test('successful fetch but status not ok', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Internal Server Error' }),
            headers: Headers,
            redirected: false,
            status: 500,
            statusText: 'Internal Server Error',
            type: 'cors',
            url: 'https://api.testnet.klever.finance/node/statistics',
          }),
        );

        const res = await withoutBody(props2, Method.GET, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'Internal Server Error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });
    });
  });

  describe('withBody function', () => {
    afterEach(() => {
      (fetch as jest.Mock).mockRestore();
    });
    describe('prices route', () => {
      test('successful fetch in prices route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocks.account),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://prices.endpoints.services.klever.io/v1/prices',
          }),
        );

        const res = await withBody(propsBody, Method.POST, 1);
        expect(res).toStrictEqual(mocks.account);
      });

      test('failed fetch in prices route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.reject('generic error'),
        );
        const res = await withBody(propsBody, Method.POST, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'generic error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });

      test('successful fetch but status not ok', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Internal Server Error' }),
            headers: Headers,
            redirected: false,
            status: 500,
            statusText: 'Internal Server Error',
            type: 'cors',
            url: 'https://prices.endpoints.services.klever.io/v1/prices',
          }),
        );

        const res = await withBody(propsBody, Method.POST, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'Internal Server Error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });
    });
  });

  describe('withText function', () => {
    afterEach(() => {
      (fetch as jest.Mock).mockRestore();
    });
    describe('metrics route', () => {
      test('successful fetch with metrics route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mocks.metrics),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://node.testnet.klever.finance/node/overview',
          }),
        );
        const res = await withText(props3, Method.GET, 1);
        expect(res).toEqual(mocks.metrics);
      });

      test('failed fetch with metrics route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.reject('generic error'),
        );
        const res = await withText(props3, Method.GET, 1);
        expect(res).toEqual({
          data: null,
          error: 'generic error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });

      test('successful fetch but status not ok', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Internal Server Error' }),
            headers: Headers,
            redirected: false,
            status: 500,
            statusText: 'Internal Server Error',
            type: 'cors',
            url: 'https://node.testnet.klever.finance/node/overview',
          }),
        );

        const res = await withText(props3, Method.GET, 1);
        expect(res).toStrictEqual({
          data: null,
          error: 'Internal Server Error',
          code: 'internal_error',
          pagination: paginationOnError,
        });
      });
    });
  });

  describe('withTimeout function', () => {
    test('when the promise is resolved in time', async () => {
      const fastPromise = new Promise(resolve => {
        setTimeout(() => {
          resolve('success');
        }, 10);
      });
      await expect(withTimeout(fastPromise, 20)).resolves.toBe('success');
    });
    test('when the promise is not resolved in time', async () => {
      const slowPromise = new Promise(resolve => {
        setTimeout(() => {
          resolve('success');
        }, 30);
      });
      await expect(withTimeout(slowPromise, 20)).resolves.toStrictEqual({
        code: 'internal_error',
        data: null,
        error: 'Fetch timeout',
        pagination: paginationOnError,
      });
    });
  });

  describe('api integration function tests', () => {
    describe('api.get', () => {
      test('address route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocks.accounts),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://api.testnet.klever.finance/v1.0/address/list',
          }),
        );
        const accountsCall = new Promise<any>(resolve =>
          resolve(
            api.get({
              route: 'address/list',
            }),
          ),
        );
        const res = await accountsCall;
        expect(res).toStrictEqual(mocks.accounts);
      });
    });
    describe('api.post', () => {
      test('prices route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocks.account),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://prices.endpoints.services.klever.io/v1/prices',
          }),
        );
        const prices: IPricesResponse = await api.post({
          route: 'prices',
          service: Service.PRICE,
          body: { names: ['KLV/USD'] },
        });
        expect(prices).toStrictEqual(mocks.account);
      });
    });

    describe('api.text', () => {
      test('metrics route', async () => {
        (global.fetch as jest.Mock) = jest.fn(() =>
          Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mocks.metrics),
            bodyUsed: true,
            headers: Headers,
            redirected: false,
            status: 200,
            statusText: '',
            type: 'cors',
            url: 'https://node.testnet.klever.finance/node/overview',
          }),
        );
        const metrics: string = await api.text({
          route: 'node/overview',
          service: Service.PROXY,
        });
        expect(metrics).toStrictEqual(mocks.metrics);
      });
    });
  });
});
