/// <reference types="cypress" />

const accountsLinks: string[] = [];
const accountsAmount: number = 10;

describe('Accounts Page', () => {
  beforeEach(() => {
    cy.visit('/accounts');
  });

  it('should load the accounts page', () => {
    cy.get('h1').contains('Accounts').should('be.visible');
  });

  Array.from({ length: accountsAmount }).forEach((_, index) => {
    it(`Should find account #${index + 1} from list`, () => {
      cy.get(`[data-testid="table-row-${index}"]`)
        .first()
        .find('a')
        .invoke('attr', 'href')
        .then(href => {
          href && accountsLinks.push(href);
        });
    });
  });
});

describe('Account Details Page', () => {
  Array.from({ length: accountsAmount }).forEach((_, index) => {
    it(`should load the account page #${index + 1} and check it's tabs`, () => {
      cy.visit(accountsLinks[index]);

      cy.get('h1').contains('Account').should('be.visible');

      cy.get('[data-testid="klv-balance"]').should('be.visible');

      cy.get(`[data-testid="tab"]`).each(($tab, index) => {
        cy.wrap($tab).click();
        cy.get(`[data-testid="tab-content-${index}"]`).should('be.visible');
      });
    });
  });
});
