/// <reference types="cypress" />

import { ContractsIndex } from '../../../src/types/contracts';

const transaction_links: string[] = [];

describe('Transactions Page', () => {
  beforeEach(() => {
    cy.visit('/transactions');
  });

  it('should load the transactions page', () => {
    cy.get('h1').contains('Transactions').should('be.visible');
  });

  Object.values(ContractsIndex).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      const statusFilter = cy
        .get(':nth-child(2) > [data-testid="selector"]')
        .click();
      statusFilter.contains('Success').click();

      const typeFilter = cy.get(':nth-child(3) > [data-testid="selector"]');
      typeFilter.click();

      typeFilter.contains(type).click();

      cy.get('[data-testid="table-row-0"]')
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
  Object.values(ContractsIndex).forEach((type, index) => {
    if (typeof type !== 'string') return;

    it(`should load the transaction details page - ${type}`, () => {
      cy.visit(transaction_links[index]);

      cy.get('h1').contains('Transaction Details').should('be.visible');
    });
  });
});
