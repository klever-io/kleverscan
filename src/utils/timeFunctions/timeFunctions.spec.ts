import FakeTimers from '@sinonjs/fake-timers';
import { getAge } from '.';

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

describe('test Time Functions', () => {
  const clock = FakeTimers.install();
  const timestamp2 = 1654194050246;
  const timestamp3 = 1654195050246;
  const timestamp4 = 1654205050246;

  describe('test getAge function', () => {
    clock.setSystemTime(new Date(timestamp2));
    test('with fixed date through mocked Date constructor', () => {
      expect(getAge(new Date(timestamp2))).toEqual('0 sec');
      expect(getAge(new Date(timestamp3))).toEqual('16 mins');
      expect(getAge(new Date(timestamp4))).toEqual('3 hours');
    });
  });
});
