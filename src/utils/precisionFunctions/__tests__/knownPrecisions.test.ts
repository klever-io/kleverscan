import api from '@/services/api';
import { KLV_PRECISION } from '../../globalVariables';
import { getPrecision } from '../index';

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

/**
 * The chain's own token is a constant, and resolving it used to cost a round
 * trip that could not start until the row request had already finished. These
 * lock in that a list denominated in KLV asks for nothing.
 */
describe('getPrecision and the chain constant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('answers for KLV without asking the API', async () => {
    await expect(getPrecision(['KLV'])).resolves.toEqual({
      KLV: KLV_PRECISION,
    });
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it('answers for a single KLV id without asking the API', async () => {
    await expect(getPrecision('KLV')).resolves.toBe(KLV_PRECISION);
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it('still asks for the assets it does not know, and only those', async () => {
    mockedPost.mockResolvedValue({
      data: { precisions: { 'DVK-34ZH': 6 } },
      error: '',
    });

    await expect(getPrecision(['KLV', 'DVK-34ZH'])).resolves.toEqual({
      KLV: KLV_PRECISION,
      'DVK-34ZH': 6,
    });
    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(mockedPost.mock.calls[0][0].body).toEqual({ assets: ['DVK-34ZH'] });
  });

  it('lets a stored precision override the constant', async () => {
    // Whatever the chain later says wins, so this can never pin a wrong value.
    localStorage.setItem('precisions', JSON.stringify({ KLV: 8 }));

    await expect(getPrecision(['KLV'])).resolves.toEqual({ KLV: 8 });
    expect(mockedPost).not.toHaveBeenCalled();
  });
});
