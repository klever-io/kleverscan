import api from '@/services/api';
import { toast } from 'react-toastify';
import { getPrecisionFromApi } from '../index';

// The module reaches @/pages/transactions, whose import chain ends in an ESM
// package Jest cannot transform. A factory mock never loads the real module.
jest.mock('@/pages/transactions', () => ({
  __esModule: true,
  getAssetsAndCurrenciesList: jest.fn(() => []),
  getTransactionPrecision: jest.fn(() => 8),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

const mockedPost = api.post as jest.Mock;
const mockedToast = toast.error as jest.Mock;

describe('getPrecisionFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the precisions the endpoint reports', async () => {
    mockedPost.mockResolvedValue({
      data: { precisions: { 'KID-36W3': 3 } },
      error: '',
    });

    await expect(getPrecisionFromApi(['KID-36W3'])).resolves.toEqual({
      precisions: { 'KID-36W3': 3 },
    });
    expect(mockedToast).not.toHaveBeenCalled();
  });

  it('reports a string error from the API and rejects with it', async () => {
    mockedPost.mockResolvedValue({ data: null, error: 'fetch timeout' });

    await expect(getPrecisionFromApi(['KLV'])).rejects.toThrow('Fetch timeout');
    expect(mockedToast).toHaveBeenCalledWith('Fetch timeout', {
      toastId: 'Fetch timeout',
    });
  });

  it('still reports when the error is an Error, which a transport failure yields', async () => {
    // The api layer puts the caught Error in `error` when the request never
    // completed. Formatting it as a string threw a TypeError before the toast
    // could fire, so this failure used to be entirely silent.
    mockedPost.mockResolvedValue({
      data: null,
      error: new TypeError('failed to fetch'),
    });

    await expect(getPrecisionFromApi(['KLV'])).rejects.toThrow(
      'Failed to fetch',
    );
    expect(mockedToast).toHaveBeenCalledWith('Failed to fetch', {
      toastId: 'Fetch timeout',
    });
  });

  it('rethrows when the request itself throws', async () => {
    mockedPost.mockRejectedValue(new Error('boom'));

    await expect(getPrecisionFromApi(['KLV'])).rejects.toThrow('boom');
  });
});
