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
const STATUS_FILTER_SELECTOR = ':nth-child(2) > [data-testid="selector"]';
const TYPE_FILTER_SELECTOR = ':nth-child(3) > [data-testid="selector"]';
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

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

const applyStatusAndTypeFilters = (type: string, typeIndex: number): void => {
  cy.get(STATUS_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(STATUS_FILTER_SELECTOR)
    .contains('Success', { timeout: 10000 })
    .click();
  cy.url().should('include', 'status=Success');

  cy.get(TYPE_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(TYPE_FILTER_SELECTOR).find('input').type(type, { delay: 0 });
  cy.get(TYPE_FILTER_SELECTOR).contains(type, { timeout: 10000 }).click();

  cy.url().should(currentUrl => {
    const url = new URL(currentUrl);
    expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
  });
};

describe('Transactions Page', () => {
  beforeEach(() => {
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
        const hash = res.body?.data?.transactions?.[0]?.hash as
          | string
          | undefined;
        expect(hash, `${type} transaction hash`)
          .to.be.a('string')
          .and.match(/^[a-f0-9]{64}$/i);

        cy.visit(`/transaction/${hash}`, { timeout: 60000 });
        cy.get(PAGE_TITLE_SELECTOR, { timeout: 60000 })
          .contains('Transaction Details', { timeout: 60000 })
          .should('be.visible');
      });
    });
  });
});
