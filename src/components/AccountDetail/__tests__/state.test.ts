import {
  CARD_OVERVIEW,
  CARD_PERMISSION,
  DIRECTION_ALL,
  DIRECTION_IN,
  DIRECTION_OUT,
  accountListHeaders,
  accountListTabIndex,
  accountPermissionsKnown,
  resolvedListTab,
  transactionDirectionLabel,
  visibleAccountCard,
  withoutRole,
} from '@/components/AccountDetail/state';

const headers = (proprietary: string | null, buckets: boolean) =>
  accountListHeaders({
    assets: 'Assets',
    proprietary,
    transactions: 'Transactions',
    buckets: buckets ? 'Buckets' : null,
    rewards: buckets ? 'Rewards' : null,
    contracts: 'Smart Contracts',
  });

describe('visibleAccountCard', () => {
  it('highlights nothing until the URL is read', () => {
    expect(visibleAccountCard(CARD_PERMISSION, false, true, true)).toBeNull();
  });

  it('keeps Permission while the account is still loading', () => {
    expect(visibleAccountCard(CARD_PERMISSION, true, false, false)).toBe(
      CARD_PERMISSION,
    );
  });

  it('drops Permission when the loaded account has none', () => {
    expect(visibleAccountCard(CARD_PERMISSION, true, true, false)).toBe(
      CARD_OVERVIEW,
    );
  });

  it('keeps Permission when the loaded account has permissions', () => {
    expect(visibleAccountCard(CARD_PERMISSION, true, true, true)).toBe(
      CARD_PERMISSION,
    );
  });

  it('opens Overview for any other card value', () => {
    expect(visibleAccountCard(null, true, true, true)).toBe(CARD_OVERVIEW);
    expect(visibleAccountCard('Info', true, true, true)).toBe(CARD_OVERVIEW);
  });
});

describe('accountListHeaders', () => {
  it('inserts proprietary assets and buckets without moving the fixed tabs', () => {
    expect(headers('Proprietary Assets', true)).toEqual([
      'Assets',
      'Proprietary Assets',
      'Transactions',
      'Buckets',
      'Rewards',
      'Smart Contracts',
    ]);
  });

  it('omits the conditional tabs', () => {
    expect(headers(null, false)).toEqual([
      'Assets',
      'Transactions',
      'Smart Contracts',
    ]);
  });
});

describe('accountListTabIndex', () => {
  const list = headers(null, false);

  it('highlights nothing until the URL is read', () => {
    expect(accountListTabIndex(list, 'Transactions', false, true)).toBe(-1);
  });

  it('opens the first tab when the URL names none', () => {
    expect(accountListTabIndex(list, null, true, true)).toBe(0);
    expect(accountListTabIndex(list, '', true, true)).toBe(0);
  });

  it('shows the highlighted header when the URL names a tab the account does not have', () => {
    const index = accountListTabIndex(list, 'Buckets', true, true);
    expect(index).toBe(0);
    expect(resolvedListTab(list, index)).toBe('Assets');
  });

  it('shows nothing while the URL has not been read', () => {
    expect(resolvedListTab(list, -1)).toBeNull();
  });

  it('highlights nothing when the account has no tabs', () => {
    expect(accountListTabIndex([], null, true, true)).toBe(-1);
    expect(accountListTabIndex([], 'Buckets', true, true)).toBe(-1);
  });

  it('waits for a tab that the account data has not added yet', () => {
    expect(accountListTabIndex(list, 'Buckets', true, false)).toBe(-1);
  });

  it('falls back once the account data is in and the tab is still absent', () => {
    expect(accountListTabIndex(list, 'Buckets', true, true)).toBe(0);
  });

  it('selects a tab that is already in the list', () => {
    expect(accountListTabIndex(list, 'Transactions', true, false)).toBe(1);
  });
});

describe('transactionDirectionLabel', () => {
  const address = 'klv1example';

  it('ignores role and uses fromAddress and toAddress', () => {
    expect(transactionDirectionLabel({ role: 'sender' }, address)).toBe(
      DIRECTION_ALL,
    );
    expect(
      transactionDirectionLabel({ fromAddress: address, role: 'receiver' }, address),
    ).toBe(DIRECTION_OUT);
    expect(transactionDirectionLabel({ toAddress: address }, address)).toBe(
      DIRECTION_IN,
    );
  });

  it('ignores a direction that names a different account', () => {
    expect(
      transactionDirectionLabel({ fromAddress: 'klv1other' }, address),
    ).toBe(DIRECTION_ALL);
  });

  it('reads the first value when a query key is repeated', () => {
    expect(
      transactionDirectionLabel(
        { fromAddress: [address, 'klv1other'] },
        address,
      ),
    ).toBe(DIRECTION_OUT);
    expect(
      transactionDirectionLabel({ toAddress: [address, 'klv1other'] }, address),
    ).toBe(DIRECTION_IN);
  });

  it('shows every transaction when the page has no address yet', () => {
    expect(
      transactionDirectionLabel({ fromAddress: address }, ''),
    ).toBe(DIRECTION_ALL);
  });
});

describe('account query and the legacy role filter', () => {
  it('counts a finished account call as known even when it returned nothing', () => {
    expect(accountPermissionsKnown(true)).toBe(true);
    expect(accountPermissionsKnown(false)).toBe(false);
    expect(
      visibleAccountCard(CARD_PERMISSION, true, accountPermissionsKnown(true), false),
    ).toBe(CARD_OVERVIEW);
  });

  it('drops a legacy role and leaves the other filters', () => {
    expect(
      withoutRole({ role: 'sender', fromAddress: 'klv1example' }),
    ).toEqual({ fromAddress: 'klv1example' });
    expect(withoutRole({ fromAddress: 'klv1example' })).toBeNull();
  });
});
