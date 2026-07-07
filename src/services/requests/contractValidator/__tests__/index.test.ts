import { fetchJob, fetchWalletChecks, submitCheck } from '../index';

describe('contractValidator service — paid match-check', () => {
  const ADDRESS = 'klv1contract';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('submitCheck', () => {
    it('POSTs multipart form data with the payment hash and returns the job id', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 5, message: 'check queued' }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const file = new File(['zip'], 'project.zip', {
        type: 'application/zip',
      });
      const res = await submitCheck(ADDRESS, file, '0.45.0', '1.78.0', 'a'.repeat(64));

      expect(res).toEqual({ jobId: 5, message: 'check queued' });
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe(`/api/contract-validator/${ADDRESS}/check`);
      expect(options.method).toBe('POST');

      const body = options.body as FormData;
      expect(body.get('ksc_version')).toBe('0.45.0');
      expect(body.get('rust_version')).toBe('1.78.0');
      expect(body.get('payment_tx_hash')).toBe('a'.repeat(64));
      expect(body.get('file')).toBeInstanceOf(File);
    });

    it('throws with the upstream message on a non-ok response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'payment hash already used' }),
      }) as unknown as typeof fetch;

      const file = new File(['zip'], 'project.zip');
      await expect(
        submitCheck(ADDRESS, file, '0.45.0', '', 'b'.repeat(64)),
      ).rejects.toThrow('payment hash already used');
    });

    it('omits rust_version when empty', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 1, message: 'check queued' }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const file = new File(['zip'], 'project.zip');
      await submitCheck(ADDRESS, file, '0.45.0', '', 'c'.repeat(64));

      const body = fetchMock.mock.calls[0][1].body as FormData;
      expect(body.get('rust_version')).toBeNull();
    });

    it('appends wasm_opt_version when provided', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 2, message: 'check queued' }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const file = new File(['zip'], 'project.zip');
      await submitCheck(ADDRESS, file, '0.45.0', '1.78.0', 'd'.repeat(64), '116');

      const body = fetchMock.mock.calls[0][1].body as FormData;
      expect(body.get('wasm_opt_version')).toBe('116');
    });

    it('omits wasm_opt_version when empty', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jobId: 3, message: 'check queued' }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const file = new File(['zip'], 'project.zip');
      await submitCheck(ADDRESS, file, '0.45.0', '', 'e'.repeat(64));

      const body = fetchMock.mock.calls[0][1].body as FormData;
      expect(body.get('wasm_opt_version')).toBeNull();
    });
  });

  describe('fetchJob', () => {
    it('fetches a job by id and returns it directly', async () => {
      const job = { id: 9, status: 'completed', matched: true };
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => job,
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const res = await fetchJob(ADDRESS, 9);
      expect(res).toEqual(job);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `/api/contract-validator/${ADDRESS}/jobs/9`,
      );
    });

    it('throws when the response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }) as unknown as typeof fetch;

      await expect(fetchJob(ADDRESS, 9)).rejects.toThrow('Failed to fetch job');
    });
  });

  describe('fetchWalletChecks', () => {
    const WALLET = 'klv1wallet';

    it('returns the checks array for a wallet', async () => {
      const checks = [{ id: 2, status: 'completed', matched: false }];
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ checks }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const res = await fetchWalletChecks(WALLET);
      expect(res).toEqual(checks);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `/api/contract-validator/wallet/${WALLET}/checks`,
      );
    });

    it('returns an empty array when checks is absent', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }) as unknown as typeof fetch;

      await expect(fetchWalletChecks(WALLET)).resolves.toEqual([]);
    });

    it('throws when the response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }) as unknown as typeof fetch;

      await expect(fetchWalletChecks(WALLET)).rejects.toThrow(
        'Failed to fetch validation history',
      );
    });
  });
});
