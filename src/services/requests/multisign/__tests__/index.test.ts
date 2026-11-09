import api from '@/services/api';
import { requestMultisign } from '../index';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: { warning: jest.fn(), error: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;

const signers = [
  { address: 'klv1a', weight: 1, signed: true },
  { address: 'klv1b', weight: 1, signed: false },
];

describe('requestMultisign', () => {
  beforeEach(() => mockedGet.mockReset());

  it('exposes the lowercase threshold the API sends as Threshold', async () => {
    mockedGet.mockResolvedValue([{ hash: 'a', threshold: 2, signers }]);

    const result = await requestMultisign('klv1a');

    expect(result).toEqual([{ hash: 'a', Threshold: 2, signers }]);
    expect(result[0]).not.toHaveProperty('threshold');
  });

  it('keeps reading the capitalised key the old API sent', async () => {
    mockedGet.mockResolvedValue([{ hash: 'a', Threshold: 3, signers }]);

    const [tx] = await requestMultisign('klv1a');

    expect(tx.Threshold).toBe(3);
  });

  it('skips entries that are not objects instead of losing the list', async () => {
    mockedGet.mockResolvedValue([null, 'x', { hash: 'a', threshold: 1 }]);

    expect(await requestMultisign('klv1a')).toEqual([
      { hash: 'a', Threshold: 1 },
    ]);
  });

  it('returns an empty list when the API answers with an error', async () => {
    mockedGet.mockResolvedValue({ data: null, error: 'x' });

    expect(await requestMultisign('klv1a')).toEqual([]);
  });

  it('returns an empty list when the body is not a list', async () => {
    mockedGet.mockResolvedValue({ hash: 'a', threshold: 1 });

    expect(await requestMultisign('klv1a')).toEqual([]);
  });

  it('does not call the API without a wallet', async () => {
    expect(await requestMultisign('')).toEqual([]);
    expect(mockedGet).not.toHaveBeenCalled();
  });
});
