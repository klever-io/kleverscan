import api from '@/services/api';
import FakeTimers from '@sinonjs/fake-timers';
import { asyncDoIf, doIf } from '.';
import mocks from '../mocks';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

jest.mock('@/services/api', () => {
  return {
    getCached: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  };
});

describe('test Promise Functions', () => {
  const clock = FakeTimers.install();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('test asyncDoIf function', () => {
    (api.get as jest.Mock).mockReturnValueOnce(mocks.addressList);
    const request = async () => {
      return await api.get({
        route: 'address/list',
      });
    };
    let results: any;
    test('Return Promise void', async () => {
      asyncDoIf(
        res => (results = res),
        err => (results = err),
        () => request(),
      );
      await clock.tickAsync(5000);
      expect(results).toStrictEqual(mocks.addressList);
    });
  });

  describe('test doIf function', () => {
    test('return Promise void', async () => {
      const expected = undefined;
      const result = doIf(
        () => true,
        () => undefined,
        () => true,
        100,
        200,
      );
      await clock.tickAsync(5000);

      await expect(result).resolves.toBe(expected);
    });
  });
});
