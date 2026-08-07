/// <reference types="cypress" />

// Search input debounces 1s before firing (InputGlobal). Stub live API
// responses so this suite is not flaky under Cloudflare/API rate limits.
const CARD_TIMEOUT_MS = 20000;
/** Match app debounce (1000ms) with buffer before asserting network. */
const SEARCH_DEBOUNCE_MS = 1500;

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

const okEnvelope = (data: Record<string, unknown>) => ({
  data,
  error: '',
  code: 'successful',
});

const stubSearchApis = (): void => {
  // Home/charts may POST precisions; a non-string `error` from rate limits
  // crashes the app (`error.charAt is not a function` in getPrecisionFromApi).
  cy.intercept('POST', '**/assets/precisions*', {
    statusCode: 200,
    body: okEnvelope({ precisions: { KLV: 6, KFI: 6 } }),
  }).as('precisions');

  // Narrow patterns so cy.wait is not satisfied by unrelated home-page calls.
  // PrePageTooltip lowercases the query (asset=klv).
  cy.intercept('GET', /\/assets\/list\?.*asset=klv/i, {
    statusCode: 200,
    body: okEnvelope({
      assets: [
        {
          assetId: 'KLV',
          name: 'Klever',
          ticker: 'KLV',
          assetType: 'Fungible',
          precision: 6,
          maxSupply: 0,
          circulatingSupply: 10000000000000,
          verified: true,
          logo: '',
        },
      ],
    }),
  }).as('assetSearch');

  cy.intercept('GET', '**/block/by-nonce/100*', {
    statusCode: 200,
    body: okEnvelope({
      block: {
        hash: 'cd84b16ed965d8df6a0d83d790084d0784c1bdda4798d4c8a46c437ae32b0377',
        nonce: 100,
        epoch: 1,
        timestamp: 1738889200,
        txCount: 0,
        size: 370,
        producerName: 'node-0',
        producerOwnerAddress: ADDRESS,
        producerLogo: '',
      },
    }),
  }).as('blockSearch');

  cy.intercept('GET', `**/address/${ADDRESS}*`, {
    statusCode: 200,
    body: okEnvelope({
      account: {
        address: ADDRESS,
        nonce: 1,
        balance: 1000000,
        frozenBalance: 0,
        allowance: 0,
        permissions: [],
        timestamp: 1738889200,
        assets: {},
      },
    }),
  }).as('addressSearch');
};

/**
 * Set the search input via the native value setter + a single bubbling `input`
 * event. Cypress .type() can drop/race React onChange under CI Electron after
 * navigations, so the 1s debounce never gets the final query and no API fires.
 */
const typeSearch = (value: string): void => {
  cy.get('[data-testid="search"]', { timeout: CARD_TIMEOUT_MS })
    .should('be.visible')
    .click({ force: true })
    .then($input => {
      const el = $input[0] as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      // Clear then set full value so debounce only arms once with the final query.
      setter?.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      setter?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    })
    .should('have.value', value);
  // App only sets `search` (and thus fetches) after the 1s debounce.
  cy.wait(SEARCH_DEBOUNCE_MS);
};

describe('Search bar', () => {
  beforeEach(() => {
    stubSearchApis();
    cy.visit('/');
    cy.get('[data-testid="search"]', { timeout: CARD_TIMEOUT_MS }).should(
      'be.visible',
    );
  });

  it('should search for an asset', () => {
    typeSearch('KLV');

    cy.wait('@assetSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).contains(
      'KLV',
      { timeout: CARD_TIMEOUT_MS },
    );
    cy.get('[data-testid="search"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/asset/KLV');
  });

  it('should search for a block', () => {
    typeSearch('100');

    cy.wait('@blockSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).contains(
      '100',
      { timeout: CARD_TIMEOUT_MS },
    );
    cy.get('[data-testid="search"]').type('{enter}');
    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/block/100');
  });

  it('should search for an address', () => {
    typeSearch(ADDRESS);

    cy.wait('@addressSearch', { timeout: CARD_TIMEOUT_MS });
    // Wait for the result card to render. Unlike the asset/block cards, the
    // account card shows the address inside an ExplorerLink dropdown, so we
    // only gate on the card appearing here and rely on the URL assertion
    // below to prove the search resolved to the right account.
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).should(
      'be.visible',
    );
    cy.get('[data-testid="search"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should(
      'include',
      `/account/${ADDRESS}`,
    );
  });
});
