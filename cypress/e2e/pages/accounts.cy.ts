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
