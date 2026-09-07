/// <reference types="cypress" />

/**
 * Accounts E2E stubs the live address list and detail APIs so CI is not flaky
 * under testnet rate limits while still exercising the real list → detail UI.
 */

const accountsAmount = 10;
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

/** 62-char bech32-shaped addresses unique per index. */
const addressFor = (index: number): string => {
  const n = String(index + 1).padStart(2, '0');
  // "klv1account" (11) + 2 digits + 49 padding = 62
  return `klv1account${n}${'q'.repeat(49)}`;
};

const rawAccounts = Array.from({ length: accountsAmount }, (_, index) => ({
  address: addressFor(index),
  nonce: index,
  balance: 1_000_000_000 * (accountsAmount - index),
  frozenBalance: 100_000_000,
  allowance: 0,
  permissions: [],
  // Accounts 0 and 2 share the genesis second, the rest are a second apart; account 2 is also the stubbed genesis validator.
  timestamp: index === 2 ? 1_700_000_000 : 1_700_000_000 + index,
  assets: {},
}));

const listResponse = {
  data: {
    accounts: rawAccounts,
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 10,
    totalPages: 1,
    totalRecords: accountsAmount,
  },
  error: '',
  code: 'successful',
};

/**
 * The summary counts an explicit date range now, not a day bucket. Width alone
 * does not identify a request: the current and the previous 24 hours are both
 * one day wide, so they are told apart by where the window ENDS. `now` is the
 * window ending at the request, `previous` the one ending a day earlier, and
 * the wide tile is the only one spanning more than a day.
 */
const WINDOW_COUNTS = { now: 3, previous: 9, wide: 21 };

const detailResponseFor = (index: number) => {
  const account = rawAccounts[index];
  return {
    data: {
      account: {
        ...account,
        name: `E2E Account ${index + 1}`,
      },
    },
    error: '',
    code: 'successful',
  };
};

/** Block 0 answers milliseconds while the stub accounts carry seconds, the mismatch mainnet returns in this field. */
const GENESIS_BLOCK_MS = 1_700_000_000_000;

const blockZeroResponse = {
  data: { block: { nonce: 0, timestamp: GENESIS_BLOCK_MS } },
  error: '',
  code: 'successful',
};

/** Account 2 registered in the genesis block, account 3 long after it. */
const validatorListResponse = {
  data: {
    validators: [
      {
        ownerAddress: addressFor(2),
        registerNonce: 0,
        list: 'elected',
      },
      {
        ownerAddress: addressFor(3),
        registerNonce: 500_000,
        list: 'eligible',
      },
    ],
  },
  pagination: { totalRecords: 2 },
  error: '',
  code: 'successful',
};

const stubAccountsApis = (): void => {
  // Scope to API version path only so Next.js /account/<address> navigations
  // are not intercepted as JSON.

  cy.intercept('GET', '**/v1.0/block/by-nonce/0*', {
    statusCode: 200,
    body: blockZeroResponse,
  }).as('blockZero');

  cy.intercept('GET', '**/v1.0/validator/list*', {
    statusCode: 200,
    body: validatorListResponse,
  }).as('validatorList');

  cy.intercept('GET', '**/v1.0/address/list*', {
    statusCode: 200,
    body: listResponse,
  }).as('accountList');

  // Registered after the broad stub so it wins for its own URLs: the summary
  // and the table share this route and differ only by the date range. An
  // undated request falls through to the stub above.
  const DAY_MS = 24 * 60 * 60 * 1000;
  cy.intercept('GET', '**/v1.0/address/list?*', req => {
    const url = new URL(req.url);
    const startParam = url.searchParams.get('startdate');
    const endParam = url.searchParams.get('enddate');
    if (!startParam || !endParam) return;

    // Only the summary's whole-day windows. The genesis-validator filter also
    // dates its request, but over a 1000ms window, and swallowing that one
    // emptied the table.
    const span = Number(endParam) - Number(startParam);
    if (span % DAY_MS !== 0) return;

    // Whole days back from now: 0 for the window ending at the request.
    const offset = Math.round((Date.now() - Number(endParam)) / DAY_MS);
    const totalRecords =
      span > DAY_MS
        ? WINDOW_COUNTS.wide
        : offset === 0
          ? WINDOW_COUNTS.now
          : WINDOW_COUNTS.previous;

    req.reply({
      statusCode: 200,
      body: {
        data: { accounts: [] },
        pagination: { totalRecords },
        error: '',
        code: 'successful',
      },
    });
  }).as('accountCount');

  rawAccounts.forEach((account, index) => {
    cy.intercept('GET', `**/v1.0/address/${account.address}*`, {
      statusCode: 200,
      body: detailResponseFor(index),
    }).as(`accountDetail${index}`);
  });
};

describe('Accounts Page', () => {
  beforeEach(() => {
    stubAccountsApis();
    cy.visit('/accounts');
  });

  it('should load the accounts page', () => {
    cy.get('h1').contains('Accounts').should('be.visible');
  });

  it('should list stubbed accounts with detail links', () => {
    cy.wait('@accountList', { timeout: 15000 });
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      accountsAmount,
    );

    // Assert every stubbed account is linked (desktop + mobile may both render
    // table-row testids; do not assume one link per row element).
    rawAccounts.forEach(account => {
      cy.get(`a[href*="${account.address}"]`).should('exist');
    });
  });

  it('marks each row with the account-link testid the smoke suite clicks', () => {
    cy.wait('@accountList', { timeout: 15000 });
    cy.get('[data-testid="account-link"]', { timeout: 15000 })
      .should('have.length.at.least', accountsAmount)
      .first()
      .should('have.attr', 'href')
      .and('include', '/account/');
  });

  it('shortens the address below the desktop breakpoint', () => {
    // Below the 1025px tablet breakpoint this is the card; the ellipsis is what parseAddress puts in the middle.
    cy.wait('@accountList', { timeout: 15000 });
    cy.get('[data-testid="account-link"]', { timeout: 15000 })
      .first()
      .invoke('text')
      .should('match', /^klv1.*\.\.\..+$/);
  });

  it('badges what the chain says each account is', () => {
    cy.wait('@accountList', { timeout: 15000 });
    // The validator set is fetched after the table on purpose, so it gets its own wait.
    cy.wait('@validatorList', { timeout: 15000 });

    const rowOf = (index: number) =>
      cy.get(`[data-testid="table-row-${index}"]`, { timeout: 15000 });

    // Account 0 carries the genesis moment in seconds: a comparison that skips the unit finds nothing here.
    rowOf(0).should('contain.text', 'Foundation');

    // Created a second later, so no badge at all.
    rowOf(1)
      .should('not.contain.text', 'Foundation')
      .and('not.contain.text', 'alidator');

    // Registered and created in the genesis block, so both badges show.
    rowOf(2)
      .should('contain.text', 'Genesis validator')
      .and('contain.text', 'Foundation');

    // Registered later: the plain role badge.
    rowOf(3)
      .should('contain.text', 'Validator')
      .and('not.contain.text', 'Genesis validator');
  });

  it('narrows the list to genesis validators, and back again', () => {
    // The stub returns the same ten accounts for every address/list call, so what is
    // asserted is the narrowing: account 2 is the only registerNonce-zero owner.
    cy.wait('@accountList', { timeout: 15000 });
    cy.get('[data-testid="account-link"]', { timeout: 15000 }).should(
      'have.length.at.least',
      accountsAmount,
    );

    cy.visit('/accounts?type=genesisValidator');
    cy.wait('@validatorList', { timeout: 15000 });

    cy.get('[data-testid="account-link"]', { timeout: 15000 }).should(
      'have.length',
      1,
    );
    cy.contains('Genesis validator').should('exist');

    // An unrecognised value must fall back to the whole list, not filter on it or show nothing.
    cy.visit('/accounts?type=nonsense');
    cy.wait('@accountList', { timeout: 15000 });
    cy.get('[data-testid="account-link"]', { timeout: 15000 }).should(
      'have.length.at.least',
      accountsAmount,
    );
    // The control has to agree with the list it sits above: it read "nonsense" over an unfiltered list until this was fixed.
    cy.get('[data-testid="selector"]').should('have.text', 'All');
  });

  it('shows the summary figures over their own rolling windows', () => {
    cy.wait('@accountCount', { timeout: 15000 });

    // The testid, not the aria-label: the loading shape carries the same label, so waiting on the label alone lands on the skeleton's empty tiles.
    cy.get('[data-testid="accounts-summary"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        // totalRecords from the stubbed pagination, anchored so a longer number merely containing these digits cannot satisfy it.
        cy.contains(/^10$/).should('exist');
        // The window tile spans a fixed seven windows now, so the label is
        // fixed too; it no longer counts the days that happened to answer.
        cy.contains(/^across 7 days$/).should('exist');
        // The 24h tile against the window before it: 3 against 9.
        cy.contains('-6 vs previous 24h').should('exist');
        // Renamed when the comparison stopped being a calendar day.
        cy.contains('vs yesterday').should('not.exist');
      });
  });
});

/** Everything above runs below the tablet breakpoint (the card). The desktop table is a
 *  different path, including the header probe that calls `rowSections` with a string; that has crashed a page here before. */
describe('Accounts Page, desktop table', () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
    stubAccountsApis();
    cy.visit('/accounts');
  });

  it('renders the column headers, which means the header probe survived', () => {
    cy.wait('@accountList', { timeout: 15000 });

    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.contains('Address').should('exist');
        cy.contains('Nonce').should('exist');
        cy.contains('KLV Balance').should('exist');
        cy.contains('KLV Staked').should('exist');
      });
  });

  it('prints the address in full, which is what the wide column is for', () => {
    cy.wait('@accountList', { timeout: 15000 });

    cy.get('[data-testid="account-link"]', { timeout: 15000 })
      .first()
      .invoke('text')
      .should('eq', addressFor(0))
      .and('have.length', 62);
  });

  it('badges the desktop row, which no other test renders', () => {
    // Deleting <AccountBadges> from `rowSections` left the whole suite green; this is the only place the table path renders it.
    cy.wait('@accountList', { timeout: 15000 });
    cy.wait('@validatorList', { timeout: 15000 });

    cy.get('[data-testid="table-row-0"]', { timeout: 15000 })
      .first()
      .should('contain.text', 'Foundation');
    cy.get('[data-testid="table-row-2"]')
      .first()
      .should('contain.text', 'Genesis validator');
  });

  it('lays the row out in four cells, one per column', () => {
    cy.wait('@accountList', { timeout: 15000 });

    // One element per row on the card path, one per column on the table path: proves the breakpoint sent us down the table.
    cy.get('[data-testid="table-row-0"]', { timeout: 15000 }).should(
      'have.length',
      4,
    );
  });
});

describe('Accounts Page, when the validator set fails', () => {
  beforeEach(() => {
    stubAccountsApis();
    // Overrides the stub above: same route, last intercept wins.
    cy.intercept('GET', '**/v1.0/validator/list*', { statusCode: 500 }).as(
      'validatorListDown',
    );
  });

  it('still lists the foundation filter, which reads nothing from that set', () => {
    // The regression that started this round: the foundation filter waited on a request
    // it reads nothing from, and a failure there left the page on "no data" for good.
    cy.visit('/accounts?type=foundation');

    cy.get('[data-testid="account-link"]', { timeout: 15000 }).should(
      'have.length.at.least',
      1,
    );
    cy.contains('Apparently no data here').should('not.exist');
  });

  it('badges nothing rather than claiming an address is not a validator', () => {
    cy.visit('/accounts');

    cy.get('[data-testid="account-link"]', { timeout: 15000 }).should(
      'have.length.at.least',
      accountsAmount,
    );
    // Waited for, not assumed: without this the row is badgeless simply because the request has not come back yet.
    cy.wait('@validatorListDown', { timeout: 15000 });
    // Account 2 is a genesis validator in the working stub; with the set unavailable the row must fall silent, not assert the opposite.
    cy.get('[data-testid="table-row-2"]')
      .first()
      .should('not.contain.text', 'alidator');
  });
});

describe('Account Details Page', () => {
  beforeEach(() => {
    stubAccountsApis();
  });

  Array.from({ length: accountsAmount }).forEach((_, index) => {
    it(`should load the account page #${index + 1} and check it's tabs`, () => {
      // Visit stubbed addresses directly so detail tests do not depend on
      // list-order link collection (and stay independent if list reorders).
      cy.visit(`/account/${addressFor(index)}`);
      cy.wait(`@accountDetail${index}`, { timeout: 15000 });

      cy.get('h1').contains('Account').should('be.visible');
      cy.get('[data-testid="klv-balance"]', { timeout: 15000 }).should(
        'be.visible',
      );

      cy.get('[data-testid="tab"]').each(($tab, tabIndex) => {
        cy.wrap($tab).click();
        cy.get(`[data-testid="tab-content-${tabIndex}"]`).should('be.visible');
      });
    });
  });
});
