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

  // PrePageTooltip lowercases the query before fetching (asset=klv).
  cy.intercept('GET', '**/assets/list*', req => {
    if (/asset=klv/i.test(req.url)) {
      req.reply({
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
      });
      return;
    }
    req.continue();
  }).as('assetSearch');

  cy.intercept('GET', '**/block/by-nonce/**', req => {
    if (req.url.includes('by-nonce/100')) {
      req.reply({
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
      });
      return;
    }
    req.continue();
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

const typeSearch = (value: string): void => {
  // Small per-key delay so React onChange fires reliably in CI Electron
  // (delay:0 can leave search stuck without a fetch after navigation).
  cy.get('[data-testid="search"]', { timeout: CARD_TIMEOUT_MS })
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(value, { delay: 20, parseSpecialCharSequences: false, force: true })
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
