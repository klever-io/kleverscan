/// <reference types="cypress" />

import { contracts } from '../../../src/configs/transactions';
import { ContractsIndex } from '../../../src/types/contracts';
const transaction_links: { name: string; link: string }[] = [];
const PAGE_TITLE_SELECTOR = 'h1';
const STATUS_FILTER_SELECTOR = ':nth-child(2) > [data-testid="selector"]';
const TYPE_FILTER_SELECTOR = ':nth-child(3) > [data-testid="selector"]';
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
const TABLE_ROW_0_LINK_SELECTOR = '[data-testid="table-row-0"] a';
const TABLE_EMPTY_SELECTOR = '[data-testid="table-empty"]';

describe('Transactions Page', () => {
  beforeEach(() => {
    cy.visit('/transactions');
  });

  it('should load the transactions page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Transactions')
      .should('be.visible');
  });

  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      cy.wait(5000);
      const statusFilter = cy
        .get(STATUS_FILTER_SELECTOR, { timeout: 10000 })
        .click();

      statusFilter.contains('Success', { timeout: 10000 }).click();

      const typeFilter = cy.get(TYPE_FILTER_SELECTOR, {
        timeout: 10000,
      });

      typeFilter.click();

      typeFilter.type(type, { delay: 300 });

      typeFilter.contains(type, { timeout: 50000 }).click();

      cy.url().then(currentUrl => {
        const url = new URL(currentUrl);
        const typeParam = url.searchParams.get('type');
        const typeIndex = ContractsIndex[type];
        expect(Number(typeParam)).to.eq(typeIndex);
      });

      cy.wait(5000);

      cy.get('body').then($body => {
        if ($body.length > 0) {
          const hasRow = $body.find(TABLE_ROW_SELECTOR).length > 0;
          if (hasRow) {
            cy.get(TABLE_ROW_0_LINK_SELECTOR, { timeout: 5000 })
              .first()
              .invoke('attr', 'href')
              .then(href => {
                href && transaction_links.push({ name: type, link: href });
              });
          } else {
            cy.get(TABLE_EMPTY_SELECTOR, { timeout: 5000 }).should(
              'be.visible',
            );
          }
        }
      });
    });
  });
});

describe('Transaction Details Page', () => {
  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should load the transaction details page - ${type}`, () => {
      const findType = transaction_links.find(
        transaction => transaction.name === type,
      );

      if (findType) {
        cy.visit({
          url: findType.link,
          timeout: 60000,
        });

        cy.get(PAGE_TITLE_SELECTOR, { timeout: 60000 })
          .contains('Transaction Details', { timeout: 60000 })
          .should('be.visible');
      } else {
        cy.log('No transaction found');
      }
    });
  });
});
