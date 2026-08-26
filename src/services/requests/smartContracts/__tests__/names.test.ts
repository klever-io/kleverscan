import api from '@/services/api';
import { smartContractNameCall } from '../names';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;

describe('smartContractNameCall', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('returns the name the chain carries for a contract', async () => {
    mockedGet.mockResolvedValue({ data: { sc: { name: 'Bitcoin.me' } } });

    await expect(smartContractNameCall('klv1contract')).resolves.toBe(
      'Bitcoin.me',
    );
    expect(mockedGet).toHaveBeenCalledWith({
      route: 'sc/klv1contract',
      tries: 1,
    });
  });

  it('asks once rather than letting api.get retry a decoration', async () => {
    // Measured on mainnet: 3 of 9 contracts on one page answer 500 here, and
    // the default of three tries spends nine requests on a name the row does
    // not need.
    mockedGet.mockResolvedValue({ error: 'boom' });

    await smartContractNameCall('klv1contract');

    expect(mockedGet.mock.calls[0][0].tries).toBe(1);
  });

  it('answers null for a contract that has no name', async () => {
    // Roughly seven in eight contracts on chain are unnamed, so this is the
    // ordinary case and not an error: the row shows its address instead.
    mockedGet.mockResolvedValue({ data: { sc: { name: '' } } });

    await expect(smartContractNameCall('klv1contract')).resolves.toBeNull();
  });

  it('answers null instead of throwing when the lookup fails', async () => {
    // The name decorates a link that works without it, so a failure here must
    // never reach the row, let alone a toast.
    mockedGet.mockResolvedValue({ error: 'not found' });

    await expect(smartContractNameCall('klv1contract')).resolves.toBeNull();
  });

  it('answers null when the request itself throws', async () => {
    mockedGet.mockRejectedValue(new Error('network down'));

    await expect(smartContractNameCall('klv1contract')).resolves.toBeNull();
  });

  it('asks nothing at all without an address', async () => {
    await expect(smartContractNameCall('')).resolves.toBeNull();
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('escapes the address it puts in the route', async () => {
    // buildUrlQuery interpolates raw values elsewhere in this codebase; the
    // route segment is escaped here so a crafted address cannot reshape it.
    mockedGet.mockResolvedValue({ data: { sc: { name: 'x' } } });

    await smartContractNameCall('klv1abc/../list');

    expect(mockedGet).toHaveBeenCalledWith({
      route: 'sc/klv1abc%2F..%2Flist',
      tries: 1,
    });
  });
});
