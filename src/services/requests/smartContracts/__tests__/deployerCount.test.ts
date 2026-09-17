import api from '@/services/api';
import { deployerContractCountCall } from '../deployerCount';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;

describe('deployerContractCountCall', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('reads the count from the record total', async () => {
    mockedGet.mockResolvedValue({ pagination: { totalRecords: 44 } });

    await expect(deployerContractCountCall('klv1abc')).resolves.toBe(44);
  });

  it('asks for one row, because only the total is used', async () => {
    // Measured on mainnet: the unfiltered call ships a full page of rows for a
    // number the cell renders in two characters.
    mockedGet.mockResolvedValue({ pagination: { totalRecords: 1 } });

    await deployerContractCountCall('klv1abc');

    expect(mockedGet).toHaveBeenCalledWith({
      route: 'sc/list',
      query: { deployer: 'klv1abc', limit: 1 },
      tries: 1,
    });
  });

  it('asks once rather than letting api.get retry a decoration', async () => {
    mockedGet.mockResolvedValue({ pagination: { totalRecords: 3 } });

    await deployerContractCountCall('klv1abc');

    expect(mockedGet.mock.calls[0][0].tries).toBe(1);
  });

  it('answers nothing for an empty address without asking', async () => {
    await expect(deployerContractCountCall('')).resolves.toBeNull();
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('throws on a failed lookup rather than calling it zero contracts', async () => {
    // An errored query stays stale so a later mount asks again; a null is
    // settled for the hour. Collapsing them would hide the count all session.
    mockedGet.mockResolvedValue({ error: 'boom' });

    await expect(deployerContractCountCall('klv1abc')).rejects.toThrow(
      'deployer count unavailable',
    );
  });

  it('lets a thrown request through for the same reason', async () => {
    mockedGet.mockRejectedValue(new Error('network down'));

    await expect(deployerContractCountCall('klv1abc')).rejects.toThrow(
      'network down',
    );
  });

  // The inverse of the guard: a total that is not a usable whole count must
  // come back as null, because the cell prints it and the link beside it is
  // suppressed at 1. A fraction or a NaN would get both of those wrong.
  it.each([
    ['a missing pagination block', {}],
    ['a missing total', { pagination: {} }],
    ['a string total', { pagination: { totalRecords: '44' } }],
    ['a fractional total', { pagination: { totalRecords: 4.5 } }],
    ['a negative total', { pagination: { totalRecords: -1 } }],
    ['a non-finite total', { pagination: { totalRecords: Infinity } }],
    ['a NaN total', { pagination: { totalRecords: NaN } }],
  ])('answers nothing for %s', async (_label, response) => {
    mockedGet.mockResolvedValue(response);

    await expect(deployerContractCountCall('klv1abc')).resolves.toBeNull();
  });

  it('accepts zero, which is a real answer', async () => {
    mockedGet.mockResolvedValue({ pagination: { totalRecords: 0 } });

    await expect(deployerContractCountCall('klv1abc')).resolves.toBe(0);
  });
});
