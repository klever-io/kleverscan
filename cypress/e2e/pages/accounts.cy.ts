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
  timestamp: 1_700_000_000 + index,
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

const countResponse = {
  data: {
    number_by_day: [{ doc_count: 3 }],
  },
  error: '',
  code: 'successful',
};

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

const stubAccountsApis = (): void => {
  // Scope to API version path only so Next.js /account/<address> navigations
  // are not intercepted as JSON.
  cy.intercept('GET', '**/v1.0/address/list/count/**', {
    statusCode: 200,
    body: countResponse,
  }).as('accountCount');

  cy.intercept('GET', '**/v1.0/address/list*', {
    statusCode: 200,
    body: listResponse,
  }).as('accountList');

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
    // Cypress runs at its default 1000px viewport and `isTablet` covers
    // everything under 1025px, so this spec exercises the card, not the table.
    // The desktop row prints the address in full, which only fits because that
    // builder never runs at this width; the card must therefore shorten. The
    // ellipsis is what parseAddress puts in the middle.
    cy.wait('@accountList', { timeout: 15000 });
    cy.get('[data-testid="account-link"]', { timeout: 15000 })
      .first()
      .invoke('text')
      .should('match', /^klv1.*\.\.\..+$/);
  });

  it('shows the summary figures, and counts one day as a day', () => {
    cy.wait('@accountCount', { timeout: 15000 });

    // The testid, not the aria-label: the loading shape carries the same
    // label, so waiting on the label alone lands on the skeleton and asserts
    // against empty tiles.
    cy.get('[data-testid="accounts-summary"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        // totalRecords from the stubbed pagination.
        cy.contains('10').should('exist');
        // The stub returns a single day, so the strip must not claim a
        // change against a yesterday it never received, and must render the
        // singular rather than "across 1 days".
        //
        // Anchored, not a substring: `cy.contains('across 1 day')` also
        // matches "across 1 days", so the plain form asserts nothing about
        // the plural it claims to guard.
        cy.contains(/^across 1 day$/).should('exist');
        cy.contains('vs yesterday').should('not.exist');
      });
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
