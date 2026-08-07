/// <reference types="cypress" />

/**
 * Transactions E2E stubs the list + precision APIs so CI is not flaky under
 * testnet rate limits while still exercising filter UI → URL → table → link.
 *
 * Detail pages use getServerSideProps against the live API (intercepts cannot
 * stub Node SSR). Visiting those hashes caused HTTP 404 under rate limits.
 * Link correctness is asserted here; list→detail navigation is covered by smoke.
 */

import { contracts } from '../../../src/configs/transactions';
import { ContractsIndex } from '../../../src/types/contracts';

const PAGE_TITLE_SELECTOR = 'h1';
const STATUS_FILTER_SELECTOR = ':nth-child(2) > [data-testid="selector"]';
const TYPE_FILTER_SELECTOR = ':nth-child(3) > [data-testid="selector"]';
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

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

const stubTransactionApis = (): void => {
  // List page may POST for asset precisions after parsing rows.
  cy.intercept('POST', '**/v1.0/assets/precisions*', {
    statusCode: 200,
    body: {
      data: { precisions: { KLV: 6 } },
      error: '',
      code: 'successful',
    },
  }).as('precisions');

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

describe('Transactions Page', () => {
  beforeEach(() => {
    stubTransactionApis();
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

      cy.get(STATUS_FILTER_SELECTOR, { timeout: 10000 }).click();
      cy.get(STATUS_FILTER_SELECTOR)
        .contains('Success', { timeout: 10000 })
        .click();
      cy.url().should('include', 'status=Success');

      cy.get(TYPE_FILTER_SELECTOR, { timeout: 10000 }).click();
      // Contract filter is typeahead; type without artificial delay.
      cy.get(TYPE_FILTER_SELECTOR).find('input').type(type, { delay: 0 });
      cy.get(TYPE_FILTER_SELECTOR).contains(type, { timeout: 10000 }).click();

      cy.url().should(currentUrl => {
        const url = new URL(currentUrl);
        expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
      });

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
