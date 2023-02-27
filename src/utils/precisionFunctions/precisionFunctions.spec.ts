import api from '@/services/api';
import { getPrecisionFromApi } from '.';

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

describe('test Precisions Functions', () => {
  describe('test getPrecisionFromApi function ', () => {
    const mockPrecision = {
      data: {
        precisions: {
          'PVM-GVCI': 10,
          KLV: 6,
        },
      },
      error: '',
      code: 'successful',
    };
    test('return precision asset', async () => {
      (api.post as jest.Mock).mockReturnValue(mockPrecision);
      const precision = (await getPrecisionFromApi(['PVM-GVCI', 'KLV'])) as any;
      expect(precision).toEqual({ precisions: mockPrecision.data.precisions });
    });
  });
});
