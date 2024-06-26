/// <reference types="cypress" />

describe('Navigation Test', () => {
  const pages = [
    '/',
    '/transactions',
    '/accounts',
    '/assets',
    '/blocks',
    '/validators',
    '/proposals',
    '/ito',
    '/marketplaces',
    '/create-transaction',
  ];

  pages.forEach(page => {
    it(`should navigate to ${page} and not break`, () => {
      cy.visit(page);
      cy.contains('404').should('not.exist'); // Ensure no 404 error
      cy.get('body').should('be.visible'); // Ensure body is visible
    });
  });
});
