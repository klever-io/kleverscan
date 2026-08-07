/// <reference types="cypress" />

import { contracts } from '../../../src/configs/transactions';
import { ContractsIndex } from '../../../src/types/contracts';

const transaction_links: { name: string; link: string }[] = [];
const PAGE_TITLE_SELECTOR = 'h1';
const TABLE_RESULT_SELECTOR =
  '[data-testid^="table-row-"], [data-testid="table-empty"]';

describe('Transactions Page', () => {
  const STATUS_FILTER_SELECTOR = ':nth-child(2) > [data-testid="selector"]';
  const TYPE_FILTER_SELECTOR = ':nth-child(3) > [data-testid="selector"]';
  const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
  const TABLE_ROW_0_LINK_SELECTOR = '[data-testid="table-row-0"] a';
  const TABLE_EMPTY_SELECTOR = '[data-testid="table-empty"]';

  beforeEach(() => {
    cy.intercept('GET', '**/v1.0/transaction/list*').as('txList');
    cy.visit('/transactions');
    cy.wait('@txList', { timeout: 15000 });
  });

  it('should load the transactions page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Transactions')
      .should('be.visible');
  });

  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      const typeIndex = ContractsIndex[type as keyof typeof ContractsIndex];

      cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
        .contains('Transactions')
        .should('be.visible');

      cy.get(STATUS_FILTER_SELECTOR, { timeout: 10000 }).click();
      cy.get(STATUS_FILTER_SELECTOR)
        .contains('Success', { timeout: 10000 })
        .click();
      // Router updated before type filter; avoids racing two list fetches.
      cy.url().should('include', 'status=Success');

      // Register before selecting type so the filtered list request is caught.
      cy.intercept('GET', `**/v1.0/transaction/list*type=${typeIndex}*`).as(
        'txListByType',
      );

      cy.get(TYPE_FILTER_SELECTOR, { timeout: 10000 }).click();
      // Contract filter is typeahead; type without artificial delay.
      cy.get(TYPE_FILTER_SELECTOR).find('input').type(type, { delay: 0 });
      cy.get(TYPE_FILTER_SELECTOR).contains(type, { timeout: 10000 }).click();

      cy.url().should(currentUrl => {
        const url = new URL(currentUrl);
        expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
      });

      cy.wait('@txListByType', { timeout: 15000 });
      cy.get(TABLE_RESULT_SELECTOR, { timeout: 15000 }).should('exist');

      cy.get('body').then($body => {
        const hasRow = $body.find(TABLE_ROW_SELECTOR).length > 0;
        if (hasRow) {
          cy.get(TABLE_ROW_0_LINK_SELECTOR, { timeout: 5000 })
            .first()
            .invoke('attr', 'href')
            .then(href => {
              if (href) {
                transaction_links.push({ name: type, link: href });
              }
            });
        } else {
          cy.get(TABLE_EMPTY_SELECTOR, { timeout: 5000 }).should('be.visible');
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
