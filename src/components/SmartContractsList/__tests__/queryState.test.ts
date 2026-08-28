import {
  activeOrder,
  activeSort,
  clearDeployerHref,
  deployerFilterHref,
  readDeployerFilter,
  singleParam,
} from '../queryState';

describe('singleParam', () => {
  it('takes a plain non-empty string', () => {
    expect(singleParam('asc')).toBe('asc');
  });

  it('reads an empty string as absent', () => {
    expect(singleParam('')).toBeUndefined();
  });

  it('reads a repeated parameter as absent, like the request layer does', () => {
    // smartContractsTableRequest forwards only `typeof value === 'string'`, so
    // ?sortBy=a&sortBy=b reaches the API as nothing at all. Reading the first
    // entry here would label the filter bar with a sort never sent.
    expect(singleParam(['timestamp', 'totalTransactions'])).toBeUndefined();
  });
});

describe('activeSort', () => {
  it('defaults to the busiest contracts when the URL says nothing', () => {
    // The request layer's own default, not the server's: absent sortBy is
    // filled in as totalTransactions before the call goes out.
    expect(activeSort({})).toBe('totalTransactions');
    expect(activeSort(undefined)).toBe('totalTransactions');
  });

  it('honours the one value the server actually recognises', () => {
    expect(activeSort({ sortBy: 'totalTransactions' })).toBe(
      'totalTransactions',
    );
  });

  it('reports timestamp for an explicit timestamp', () => {
    expect(activeSort({ sortBy: 'timestamp' })).toBe('timestamp');
  });

  it('reports timestamp for a value the server silently coerces', () => {
    // baseSmartContractGroup.go maps anything but totalTransactions onto
    // timestamp and returns no error, so the bar has to say timestamp rather
    // than echo the nonsense back at the reader.
    expect(activeSort({ sortBy: 'nonsense' })).toBe('timestamp');
    expect(activeSort({ sortBy: 'TOTALTRANSACTIONS' })).toBe('timestamp');
  });

  it('falls back to the request default for a repeated parameter', () => {
    expect(activeSort({ sortBy: ['timestamp', 'timestamp'] })).toBe(
      'totalTransactions',
    );
  });
});

describe('activeOrder', () => {
  it('defaults to descending', () => {
    expect(activeOrder({})).toBe('desc');
  });

  it('honours the one value the server recognises', () => {
    expect(activeOrder({ orderBy: 'asc' })).toBe('asc');
  });

  it('reports descending for anything the server coerces', () => {
    expect(activeOrder({ orderBy: 'ASC' })).toBe('desc');
    expect(activeOrder({ orderBy: 'sideways' })).toBe('desc');
    expect(activeOrder({ orderBy: ['asc', 'desc'] })).toBe('desc');
  });
});

describe('readDeployerFilter', () => {
  it('reads a deployer from the URL', () => {
    expect(readDeployerFilter({ deployer: 'klv1abc' })).toBe('klv1abc');
  });

  it('reads an empty or repeated deployer as no filter', () => {
    expect(readDeployerFilter({ deployer: '' })).toBeUndefined();
    expect(readDeployerFilter({ deployer: ['a', 'b'] })).toBeUndefined();
    expect(readDeployerFilter({})).toBeUndefined();
  });
});

describe('deployerFilterHref', () => {
  it('narrows to one deployer and carries the resolved sort', () => {
    expect(deployerFilterHref({ sortBy: 'timestamp' }, 'klv1abc')).toBe(
      '/smart-contracts?deployer=klv1abc&sortBy=timestamp&orderBy=desc',
    );
  });

  it('drops the page, because the filtered list is shorter', () => {
    // Page 12 of 207 contracts does not exist in the 14 one deployer has, and
    // keeping it would land the reader on an empty table.
    const href = deployerFilterHref({ page: '12' }, 'klv1abc');
    expect(href).not.toContain('page');
  });

  it('drops parameters this list does not use', () => {
    const href = deployerFilterHref({ utm_source: 'x', tab: 'y' }, 'klv1abc');
    expect(href).not.toContain('utm_source');
    expect(href).not.toContain('tab');
  });

  it('writes the coerced sort rather than the raw one', () => {
    // Carrying `sortBy=nonsense` forward would leave the URL disagreeing with
    // the bar, which resolves the same value to timestamp.
    expect(deployerFilterHref({ sortBy: 'nonsense' }, 'klv1abc')).toContain(
      'sortBy=timestamp',
    );
  });

  it('escapes a deployer that carries URL syntax', () => {
    const href = deployerFilterHref({}, 'klv1&sortBy=evil');
    expect(href).toContain('deployer=klv1%26sortBy%3Devil');
    expect(href).toContain('sortBy=totalTransactions');
  });

  it('replaces an existing deployer instead of adding a second', () => {
    const href = deployerFilterHref({ deployer: 'klv1old' }, 'klv1new');
    expect(href).toContain('deployer=klv1new');
    expect(href).not.toContain('klv1old');
  });
});

describe('clearDeployerHref', () => {
  it('removes the deployer and keeps the sort', () => {
    expect(
      clearDeployerHref({ deployer: 'klv1abc', sortBy: 'timestamp' }),
    ).toBe('/smart-contracts?sortBy=timestamp&orderBy=desc');
  });

  it('is a no-op shape on an already unfiltered list', () => {
    expect(clearDeployerHref({})).toBe(
      '/smart-contracts?sortBy=totalTransactions&orderBy=desc',
    );
  });
});
