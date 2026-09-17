/// <reference types="cypress" />

// Spotlight search via GET /v1.0/search (structured payloads). Stub for CI.
const CARD_TIMEOUT_MS = 20000;
const SEARCH_DEBOUNCE_MS = 600;

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

const okEnvelope = (data: Record<string, unknown>) => ({
  data,
  error: '',
  code: 'successful',
});

const errEnvelope = (message: string) => ({
  data: null,
  error: message,
  code: 'failed',
});

type StubMode = 'ok' | 'unavailable';

const stubSpotlightSearch = (mode: StubMode = 'ok'): void => {
  cy.intercept('POST', '**/assets/precisions*', {
    statusCode: 200,
    body: okEnvelope({ precisions: { KLV: 6, KFI: 6 } }),
  }).as('precisions');

  cy.intercept('GET', '**/search*', req => {
    if (mode === 'unavailable') {
      req.reply({
        statusCode: 200,
        body: errEnvelope('search endpoint unavailable'),
      });
      return;
    }

    const url = req.url;
    let q = '';
    let types = '';
    try {
      const parsed = new URL(url);
      q = parsed.searchParams.get('q') || '';
      types = parsed.searchParams.get('types') || '';
    } catch {
      const m = url.match(/[?&]q=([^&]*)/);
      q = m ? decodeURIComponent(m[1]) : '';
      const t = url.match(/[?&]types=([^&]*)/);
      types = t ? decodeURIComponent(t[1]) : '';
    }
    const lower = q.toLowerCase();

    if (lower === 'klv') {
      req.reply({
        statusCode: 200,
        body: okEnvelope({
          query: q,
          bestMatch: {
            type: 'asset',
            id: 'KLV',
            score: 185,
            href: '/asset/KLV',
            asset: {
              assetId: 'KLV',
              name: 'Klever',
              ticker: 'KLV',
              logo: '',
              assetType: 'Fungible',
              precision: 6,
              verified: true,
            },
          },
          suggestions: [],
          counts: { asset: 1 },
        }),
      });
      return;
    }

    if (lower === '100') {
      req.reply({
        statusCode: 200,
        body: okEnvelope({
          query: q,
          bestMatch: {
            type: 'block',
            id: '100',
            score: 180,
            href: '/block/100',
            block: {
              nonce: 100,
              hash: 'ab3a19e559cbcbc25c9dcc4834006d0fba240c10a1ccc0b2bc4185ea88f8aec7',
              timestamp: 1656680800,
            },
          },
          suggestions: [],
          counts: { block: 1 },
        }),
      });
      return;
    }

    if (lower === ADDRESS.toLowerCase()) {
      req.reply({
        statusCode: 200,
        body: okEnvelope({
          query: q,
          bestMatch: {
            type: 'account',
            id: ADDRESS,
            score: 100,
            href: `/account/${ADDRESS}`,
            account: {
              address: ADDRESS,
              name: '',
              balance: 1000000,
            },
          },
          suggestions: [],
          counts: { account: 1 },
        }),
      });
      return;
    }

    // Mixed multi-type result for filter / type-run coverage
    if (lower === '1') {
      const mixed = {
        query: q,
        bestMatch: null,
        suggestions: [
          {
            type: 'proposal',
            id: '16',
            score: 40,
            href: '/proposal/16',
            proposal: {
              proposalId: 16,
              description: 'Fair validating standards',
              proposalStatus: 'DeniedProposal',
            },
          },
          {
            type: 'block',
            id: '1',
            score: 35,
            href: '/block/1',
            block: { nonce: 1, hash: 'bb'.repeat(32) },
          },
          {
            type: 'epoch',
            id: '1',
            score: 30,
            href: '/blocks',
            epoch: { epoch: 1 },
          },
          {
            type: 'proposal',
            id: '19',
            score: 25,
            href: '/proposal/19',
            proposal: {
              proposalId: 19,
              description: 'Market adjustment to NFT fees',
              proposalStatus: 'DeniedProposal',
            },
          },
        ],
        counts: { proposal: 2, block: 1, epoch: 1 },
      };

      if (types === 'block') {
        req.reply({
          statusCode: 200,
          body: okEnvelope({
            query: q,
            bestMatch: mixed.suggestions[1],
            suggestions: [],
            counts: { block: 1 },
          }),
        });
        return;
      }

      if (types === 'proposal') {
        req.reply({
          statusCode: 200,
          body: okEnvelope({
            query: q,
            bestMatch: null,
            suggestions: [mixed.suggestions[0], mixed.suggestions[3]],
            counts: { proposal: 2 },
          }),
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: okEnvelope(mixed),
      });
      return;
    }

    // Explicit empty hits
    req.reply({
      statusCode: 200,
      body: okEnvelope({
        query: q,
        bestMatch: null,
        suggestions: [],
        counts: {},
      }),
    });
  }).as('spotlightSearch');
};

const openSpotlight = (): void => {
  cy.get(
    '[data-testid="home-spotlight-hero"], [data-testid="spotlight-trigger"], [data-testid="spotlight-trigger-mobile"]',
    { timeout: CARD_TIMEOUT_MS },
  )
    .first()
    .should('be.visible')
    .click({ force: true });
  cy.get('[data-testid="spotlight-input"]', {
    timeout: CARD_TIMEOUT_MS,
  }).should('be.visible');
};

const typeSpotlight = (value: string): void => {
  cy.get('[data-testid="spotlight-input"]', { timeout: CARD_TIMEOUT_MS })
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(value, { force: true, delay: 20 });
  cy.wait(SEARCH_DEBOUNCE_MS);
};

describe('Spotlight search', () => {
  beforeEach(() => {
    stubSpotlightSearch('ok');
    cy.visit('/');
    openSpotlight();
  });

  it('should search for an asset', () => {
    typeSpotlight('KLV');

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/KLV|Klever/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
    cy.get('[data-testid="spotlight-input"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/asset/KLV');
  });

  it('should search for a block', () => {
    typeSpotlight('100');

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/Block #100|Block 100|100/, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
    cy.get('[data-testid="spotlight-input"]').type('{enter}');
    cy.url({ timeout: CARD_TIMEOUT_MS }).should('include', '/block/100');
  });

  it('should search for an address', () => {
    typeSpotlight(ADDRESS);

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/Account|ACCOUNT|KLV/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
    cy.get('[data-testid="spotlight-input"]').type('{enter}');

    cy.url({ timeout: CARD_TIMEOUT_MS }).should(
      'include',
      `/account/${ADDRESS}`,
    );
  });

  it('shows empty state when nothing matches', () => {
    typeSpotlight('zzznomatch999');

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/No results found/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
  });

  it('shows mixed suggestions with type labels for query 1', () => {
    typeSpotlight('1');

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/Proposal #16/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
    cy.get('[data-testid="spotlight-overlay"]').contains(/Block #1/i);
    cy.get('[data-testid="spotlight-overlay"]').contains(/Epoch #1/i);
    // Filter chips from counts
    cy.get('[data-testid="spotlight-overlay"]').contains(/Proposals/i);
    cy.get('[data-testid="spotlight-overlay"]').contains(/Blocks/i);
  });

  it('filters by type chip', () => {
    typeSpotlight('1');
    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });

    cy.get('[data-testid="spotlight-overlay"]')
      .contains('button', /Blocks/i)
      .click({ force: true });

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]')
      .contains(/Block #1/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
    cy.get('[data-testid="spotlight-overlay"]')
      .contains(/Proposal #16/i)
      .should('not.exist');
  });

  it('navigates with arrow keys and enter', () => {
    typeSpotlight('1');
    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });

    // Index 0 = Proposal #16; ↓ selects Block #1
    cy.get('[data-testid="spotlight-input"]').type('{downarrow}{enter}', {
      force: true,
    });

    cy.location('pathname', { timeout: CARD_TIMEOUT_MS }).should(
      'include',
      '/block/1',
    );
  });
});

describe('Spotlight search unavailable', () => {
  it('shows unavailable state when search API fails', () => {
    stubSpotlightSearch('unavailable');
    cy.visit('/');
    openSpotlight();
    typeSpotlight('KLV');

    cy.wait('@spotlightSearch', { timeout: CARD_TIMEOUT_MS });
    cy.get('[data-testid="spotlight-overlay"]', { timeout: CARD_TIMEOUT_MS })
      .contains(/Search unavailable/i, { timeout: CARD_TIMEOUT_MS })
      .should('be.visible');
  });
});
