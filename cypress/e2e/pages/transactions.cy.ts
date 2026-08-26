/// <reference types="cypress" />

/**
 * Transactions E2E:
 * - List/filter suite stubs list + precision APIs (deterministic, fast).
 * - Detail suite covers Transfer + Smart Contract via live list → visit.
 *   Detail pages use getServerSideProps (intercepts cannot stub Node SSR),
 *   so we only exercise two representative types instead of all 26.
 */

import { contracts } from '../../../src/configs/transactions';
import { ContractsIndex } from '../../../src/types/contracts';

const PAGE_TITLE_SELECTOR = 'h1';
/**
 * Reached by the filter's own identifier rather than by its position among its
 * siblings. The positional form broke on any wrapper element, on reordering,
 * and on the Buy Type filter appearing, and it would break again once the
 * titles are translated.
 */
const STATUS_FILTER_SELECTOR =
  '[data-testid="filter-status"] [data-testid="selector"]';
const TYPE_FILTER_SELECTOR =
  '[data-testid="filter-contract"] [data-testid="selector"]';
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

/**
 * Cypress defaults to 1000px wide and the app switches to its tablet layout
 * below 1025, so without an explicit viewport the suite only ever exercises
 * the card DOM and never the column table. Both are covered.
 */
const TABLET_VIEWPORT: [number, number] = [1000, 660];
const DESKTOP_VIEWPORT: [number, number] = [1440, 900];

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

/** Representative types for live SSR detail coverage. */
const DETAIL_CONTRACTS = ['Transfer', 'Smart Contract'] as const;

/** Deterministic 64-char hex hash unique per contract type index. */
const hashForType = (typeIndex: number): string => {
  const prefix = typeIndex.toString(16).padStart(2, '0');
  return `${prefix}${'ab'.repeat(31)}`.slice(0, 64);
};

const txForType = (typeIndex: number) => {
  const isTransfer = typeIndex === 0;
  return {
    hash: hashForType(typeIndex),
    blockNum: 1000 + typeIndex,
    sender: ADDRESS,
    nonce: typeIndex + 1,
    timestamp: 1_700_000_000 + typeIndex,
    kAppFee: 1,
    bandwidthFee: 250,
    status: 'success',
    resultCode: 'Ok',
    version: 1,
    chainID: '109',
    signature: ['00'],
    searchOrder: 0,
    receipts: [],
    contract: [
      {
        type: typeIndex,
        typeString: 'Contract',
        parameter: isTransfer
          ? {
              amount: 1_000_000,
              assetId: 'KLV',
              toAddress: ADDRESS,
            }
          : {},
      },
    ],
  };
};

const listResponse = (typeIndex: number) => ({
  data: {
    transactions: [txForType(typeIndex)],
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 10,
    totalPages: 1,
    totalRecords: 1,
  },
  error: '',
  code: 'successful',
});

const stubPrecisions = (): void => {
  cy.intercept('POST', '**/v1.0/assets/precisions*', {
    statusCode: 200,
    body: {
      data: { precisions: { KLV: 6 } },
      error: '',
      code: 'successful',
    },
  }).as('precisions');
};

const stubTransactionListApis = (): void => {
  stubPrecisions();

  cy.intercept('GET', '**/v1.0/transaction/list*', req => {
    const url = new URL(req.url);
    const typeParam = url.searchParams.get('type');
    const typeIndex =
      typeParam === null || typeParam === '' ? 0 : Number(typeParam);
    const safeIndex = Number.isFinite(typeIndex) ? typeIndex : 0;
    req.reply({
      statusCode: 200,
      body: listResponse(safeIndex),
    });
  }).as('txList');
};

/**
 * Apply Success + contract type filters. Consumes list intercepts so the final
 * wait is the type-filtered request (not the intermediate status-only one).
 * Requires `@txList` intercept from stubTransactionListApis.
 */
const applyStatusAndTypeFilters = (type: string, typeIndex: number): void => {
  cy.get(STATUS_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(STATUS_FILTER_SELECTOR)
    .contains('Success', { timeout: 10000 })
    .click();
  cy.url().should('include', 'status=Success');
  // Status-only refetch — drain so the next wait is the type-filtered call.
  cy.wait('@txList', { timeout: 15000 });

  cy.get(TYPE_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(TYPE_FILTER_SELECTOR).find('input').type(type, { delay: 0 });
  cy.get(TYPE_FILTER_SELECTOR).contains(type, { timeout: 10000 }).click();

  cy.url().should(currentUrl => {
    const url = new URL(currentUrl);
    expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
  });

  // Prove the list request itself carries both filter params (not only the URL).
  cy.wait('@txList', { timeout: 15000 })
    .its('request.url')
    .should(requestUrl => {
      const url = new URL(requestUrl);
      expect(url.searchParams.get('status')).to.eq('Success');
      expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
    });
};

/**
 * Visit SSR transaction detail with backoff. GSSP uses live api.get; persistent
 * 429 returns notFound (HTTP 404) which failOnStatusCode would fail immediately.
 */
const visitTransactionDetail = (hash: string, retriesLeft = 3): void => {
  cy.visit(`/transaction/${hash}`, {
    timeout: 60000,
    failOnStatusCode: false,
  });
  cy.get('body', { timeout: 15000 }).then($body => {
    const titleText = $body.find(PAGE_TITLE_SELECTOR).text();
    if (titleText.includes('Transaction Details')) {
      cy.get(PAGE_TITLE_SELECTOR)
        .contains('Transaction Details')
        .should('be.visible');
      return;
    }
    if (retriesLeft <= 0) {
      throw new Error(
        `Transaction detail page did not load for ${hash} after retries (likely API 429 / notFound)`,
      );
    }
    cy.wait(3000);
    visitTransactionDetail(hash, retriesLeft - 1);
  });
};

describe('Transactions Page', () => {
  beforeEach(() => {
    // Stated rather than inherited from the Cypress default, so the layout
    // these assertions describe cannot change by editing the config.
    cy.viewport(...TABLET_VIEWPORT);
    stubTransactionListApis();
    cy.visit('/transactions');
    cy.wait('@txList', { timeout: 15000 });
  });

  it('should load the transactions page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Transactions')
      .should('be.visible');
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      1,
    );
  });

  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      const typeIndex = ContractsIndex[type as keyof typeof ContractsIndex];
      const expectedHash = hashForType(typeIndex);

      cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
        .contains('Transactions')
        .should('be.visible');

      applyStatusAndTypeFilters(type, typeIndex);

      // Wait for the stubbed row for this type (handles multi-request races).
      cy.get(`a[href*="/transaction/${expectedHash}"]`, {
        timeout: 15000,
      }).should('be.visible');
      cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
        'have.length.at.least',
        1,
      );
    });
  });

  it('labels every cell with its column, and shows no header row', () => {
    // Below the tablet breakpoint the table renders as cards: there is no
    // column header row, and each cell carries its own label instead.
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      1,
    );
    cy.get('[data-testid="table-header"]').should('not.exist');
    cy.get('[data-testid="table-row-0"]')
      .first()
      .should('contain.text', 'Transaction Hash');
  });
});

describe('Transactions Page (desktop)', () => {
  beforeEach(() => {
    cy.viewport(...DESKTOP_VIEWPORT);
    stubTransactionListApis();
    cy.visit('/transactions');
    cy.wait('@txList', { timeout: 15000 });
  });

  it('renders the column header row', () => {
    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .should('be.visible')
      .children()
      .should('have.length.at.least', 1);
  });

  /**
   * The header count and the per-row cell count are produced by two separate
   * code paths, so nothing stops them drifting apart. When they do, every
   * column past the divergence sits under the wrong heading.
   */
  it('gives each row exactly one cell per column heading', () => {
    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .children()
      .its('length')
      .then(headerCount => {
        expect(headerCount).to.be.greaterThan(0);
        cy.get('[data-testid="table-row-0"]').should(
          'have.length',
          headerCount,
        );
      });
  });

  /**
   * The shape the split actually broke. Without an account in the URL both
   * lists were five long, so an assertion on `/transactions` alone passes on
   * the bug too: this is the one that fails before the fix, where six cells
   * rendered under five headings.
   */
  it('keeps headings and cells aligned once the list is scoped to an account', () => {
    cy.visit(`/transactions?account=${ADDRESS}`);
    cy.wait('@txList', { timeout: 15000 });

    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .children()
      .then(headings => {
        expect(headings).to.have.length(6);
        expect(
          [...headings].map(cell => cell.textContent?.trim()),
        ).to.deep.equal([
          'Transaction Hash',
          'Block/Fees',
          'From/To',
          'In/Out',
          'Type',
          'Misc',
        ]);
        cy.get('[data-testid="table-row-0"]').should('have.length', 6);
      });
  });

  /**
   * Locks the namespace wiring. A t() whose namespace was never loaded does
   * not fall back to English, it renders its own key, and every other
   * assertion here would still pass on one: contains('Success') also matches
   * "transactions:Status.Success". Exact matches do not.
   */
  it('renders translated filter texts, never raw keys', () => {
    cy.get('[data-testid="filter-status"] > span')
      .first()
      .should('have.text', 'Status');
    cy.get('[data-testid="filter-contract"] > span')
      .first()
      .should('have.text', 'Contract');

    cy.get(STATUS_FILTER_SELECTOR).click();
    cy.get('[data-testid="filter-status"]').contains(/^Success$/);
    cy.get('body').should('not.contain.text', 'transactions:');
  });

  it('links the hash cell to the full transaction hash', () => {
    const expectedHash = hashForType(0);
    cy.get(`a[href*="/transaction/${expectedHash}"]`, {
      timeout: 15000,
    }).should('be.visible');
  });
});

describe('Block Page i18n', () => {
  // getStaticProps runs against the live API (intercepts cannot stub Node),
  // like the detail suite below. One representative block is enough: the page
  // loaded no translation namespace at all before this branch, so its filter
  // bar rendered raw keys.
  const API_BASE =
    Cypress.env('DEFAULT_API_HOST') || 'https://api.testnet.klever.org';
  const API_VERSION = Cypress.env('DEFAULT_API_VERSION') || 'v1.0';

  /** Same bounded 429 backoff as the detail suite: the shared testnet API
   * rate-limits, and cy.request fails outright on a non-2xx without
   * failOnStatusCode. */
  const requestLatestBlockNum = (
    retriesLeft = 5,
  ): Cypress.Chainable<number> => {
    return cy
      .request({
        url: `${API_BASE}/${API_VERSION}/transaction/list`,
        qs: { limit: 1, page: 1 },
        failOnStatusCode: false,
        timeout: 20000,
      })
      .then(res => {
        if (res.status === 429 && retriesLeft > 0) {
          cy.wait(2500);
          return requestLatestBlockNum(retriesLeft - 1);
        }
        const blockNum = res.body?.data?.transactions?.[0]?.blockNum;
        expect(blockNum, 'blockNum from the live list').to.be.a('number');
        return cy.wrap(blockNum as number);
      });
  };

  /** Bounded revisit, like visitTransactionDetail: getStaticProps runs its
   * own lookup against the live API and answers notFound after its retries,
   * so with failOnStatusCode off a rate-limited build lands on the 404 page
   * and the filter assertion would only time out. */
  const visitBlockPage = (blockNum: number, retriesLeft = 3): void => {
    cy.visit(`/block/${blockNum}`, {
      timeout: 60000,
      failOnStatusCode: false,
    });
    cy.get('body', { timeout: 15000 }).then($body => {
      if ($body.find('[data-testid="filter-status"]').length) {
        return;
      }
      if (retriesLeft <= 0) {
        throw new Error(
          `Block page did not load for ${blockNum} after retries (likely API 429 / notFound)`,
        );
      }
      cy.wait(3000);
      visitBlockPage(blockNum, retriesLeft - 1);
    });
  };

  it('serves the transactions tab with translated filters', () => {
    requestLatestBlockNum().then(blockNum => {
      cy.viewport(...DESKTOP_VIEWPORT);
      visitBlockPage(blockNum);

      cy.get('[data-testid="filter-status"] > span', { timeout: 20000 })
        .first()
        .should('have.text', 'Status');
      cy.contains('Date Filter').should('be.visible');
      cy.get('body').should('not.contain.text', 'transactions:');
    });
  });
});

describe('Transaction Details Page', () => {
  // Detail pages use getServerSideProps against the live API (browser intercepts
  // cannot stub Node). Resolve a real hash via cy.request, then visit SSR page.
  const API_BASE =
    Cypress.env('DEFAULT_API_HOST') || 'https://api.testnet.klever.org';
  const API_VERSION = Cypress.env('DEFAULT_API_VERSION') || 'v1.0';

  const requestTxList = (
    typeIndex: number,
    retriesLeft = 5,
  ): Cypress.Chainable<Cypress.Response<any>> => {
    return cy
      .request({
        url: `${API_BASE}/${API_VERSION}/transaction/list`,
        qs: {
          type: typeIndex,
          status: 'Success',
          limit: 1,
          page: 1,
        },
        failOnStatusCode: false,
        timeout: 20000,
      })
      .then(res => {
        // Full suite can 429 the shared testnet API; back off and retry.
        if (res.status === 429 && retriesLeft > 0) {
          cy.wait(2500);
          return requestTxList(typeIndex, retriesLeft - 1);
        }
        return cy.wrap(res);
      });
  };

  DETAIL_CONTRACTS.forEach(type => {
    it(`should load the transaction details page - ${type}`, () => {
      const typeIndex = ContractsIndex[type as keyof typeof ContractsIndex];

      requestTxList(typeIndex).then(res => {
        expect(res.status, `${type} list HTTP status`).to.eq(200);
        const tx = res.body?.data?.transactions?.[0] as
          | {
              hash?: string;
              contract?: { type?: number }[];
            }
          | undefined;
        expect(
          tx?.contract?.[0]?.type,
          `${type} contract type from list`,
        ).to.eq(typeIndex);
        const hash = tx?.hash;
        expect(hash, `${type} transaction hash`)
          .to.be.a('string')
          .and.match(/^[a-f0-9]{64}$/i);

        visitTransactionDetail(hash as string);
      });
    });
  });
});
