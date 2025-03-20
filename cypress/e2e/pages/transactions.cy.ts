/// <reference types="cypress" />

import { contracts } from '../../../src/configs/transactions';

const transaction_links: string[] = [];

describe('Transactions Page', () => {
  beforeEach(() => {
    cy.visit('/transactions');
  });

  it('should load the transactions page', () => {
    cy.get('h1', { timeout: 10000 })
      .contains('Transactions')
      .should('be.visible');
  });

  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      cy.wait(5000);
      const statusFilter = cy
        .get(':nth-child(2) > [data-testid="selector"]', { timeout: 10000 })
        .click();

      cy.wait(1000);

      statusFilter.contains('Success', { timeout: 10000 }).click();

      const typeFilter = cy.get(':nth-child(3) > [data-testid="selector"]', {
        timeout: 10000,
      });

      cy.wait(1000);

      typeFilter.click();

      cy.wait(1000);
      typeFilter.type(type, { delay: 300 });

      cy.wait(10000);
      typeFilter.contains(type, { timeout: 60000 }).click();

      cy.wait(5000);

      cy.get('[data-testid="table-row-0"]', { timeout: 60000 })
        .first()
        .find('a')
        .invoke('attr', 'href')
        .then(href => {
          href && transaction_links.push(href);
        });
    });
  });
});

describe('Transaction Details Page', () => {
  Object.values(contracts).forEach((type, index) => {
    if (typeof type !== 'string') return;

    it(`should load the transaction details page - ${type}`, () => {
      cy.wait(5000);

      cy.visit(transaction_links[index]);

      cy.wait(1000);

      cy.get('h1')
        .contains('Transaction Details', { timeout: 10000 })
        .should('be.visible');
    });
  });
});
