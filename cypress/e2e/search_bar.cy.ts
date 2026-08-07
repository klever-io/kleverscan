/// <reference types="cypress" />

// Search input debounces 1s before firing. Stub live API responses so this
// suite is not flaky under Cloudflare/API rate limits (HTTP 1015) in CI.
const SEARCH_DEBOUNCE_MS = 1500;
const CARD_TIMEOUT_MS = 15000;

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

const stubSearchApis = (): void => {
  cy.intercept('GET', '**/assets/list*asset=KLV*', {
    statusCode: 200,
    body: {
      data: {
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
      },
      error: '',
      code: 'successful',
    },
  }).as('assetSearch');

  cy.intercept('GET', '**/block/by-nonce/100*', {
    statusCode: 200,
    body: {
      data: {
        block: {
          hash: 'cd84b16ed965d8df6a0d83d790084d0784c1bdda4798d4c8a46c437ae32b0377',
          nonce: 100,
          timestamp: 1738889200,
          txCount: 0,
          size: 370,
          producerName: 'node-0',
          producerOwnerAddress: ADDRESS,
        },
      },
      error: '',
      code: 'successful',
    },
  }).as('blockSearch');

  cy.intercept('GET', `**/address/${ADDRESS}*`, {
    statusCode: 200,
    body: {
      data: {
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
      },
      error: '',
      code: 'successful',
    },
  }).as('addressSearch');
};

describe('Search bar', () => {
  beforeEach(() => {
    stubSearchApis();
  });

  it('should search for an asset', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('KLV', { delay: 300 });
    cy.wait(SEARCH_DEBOUNCE_MS);

    cy.wait('@assetSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).contains(
      'KLV',
    );
    cy.wait(500);
    cy.get('[data-testid="search"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/asset/KLV');
  });

  it('should search for a block', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('100', { delay: 300 });
    cy.wait(SEARCH_DEBOUNCE_MS);

    cy.wait('@blockSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).contains(
      '100',
    );
    cy.wait(500);
    cy.get('[data-testid="search"]').type('{enter}');
    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/block/100');
  });

  it('should search for an address', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type(ADDRESS, { delay: 10 });
    cy.wait(SEARCH_DEBOUNCE_MS);

    cy.wait('@addressSearch', { timeout: CARD_TIMEOUT_MS });
    // Wait for the result card to render. Unlike the asset/block cards, the
    // account card shows the address inside an ExplorerLink dropdown, so we
    // only gate on the card appearing here and rely on the URL assertion
    // below to prove the search resolved to the right account.
    cy.get('[data-testid="card-item"]', { timeout: CARD_TIMEOUT_MS }).should(
      'be.visible',
    );
    cy.wait(500);
    cy.get('[data-testid="search"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should(
      'include',
      `/account/${ADDRESS}`,
    );
  });
});
