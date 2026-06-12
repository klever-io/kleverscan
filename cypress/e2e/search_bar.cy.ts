/// <reference types="cypress" />

describe('Search bar', () => {
  it('should search for an asset', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('KLV', { delay: 300 });

    // The search input debounces for 1s before firing the request, and the
    // result is fetched from the live API, so allow more time than Cypress'
    // 4s default before the result card is expected to appear.
    cy.get('[data-testid="card-item"]', { timeout: 15000 }).contains('KLV');
    cy.wait(3000);
    cy.get('[data-testid="search"]').type('{enter}');

    cy.wait(1000);
    cy.url().should('include', '/asset/KLV');
  });

  it('should search for a block', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('100', { delay: 300 });

    cy.get('[data-testid="card-item"]', { timeout: 15000 }).contains('100');
    cy.wait(3000);
    cy.get('[data-testid="search"]').type('{enter}');
    cy.url().should('include', '/block/100');
  });

  it('should search for an address', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type(
      'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
      { delay: 10 },
    );

    // Wait for the result card to render. Unlike the asset/block cards, the
    // account card shows the address inside an ExplorerLink dropdown, so we
    // only gate on the card appearing here and rely on the URL assertion
    // below to prove the search resolved to the right account.
    cy.get('[data-testid="card-item"]', { timeout: 15000 }).should(
      'be.visible',
    );
    cy.wait(3000);
    cy.get('[data-testid="search"]').type('{enter}');

    cy.wait(1000);

    cy.url().should(
      'include',
      '/account/klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
    );
  });
});
