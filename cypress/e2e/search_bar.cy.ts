/// <reference types="cypress" />

describe('Search bar', () => {
  it('should search for an asset', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('KLV', { delay: 300 });

    cy.get('[data-testid="card-item"]').contains('KLV');
    cy.wait(3000);
    cy.get('[data-testid="search"]').type('{enter}');

    cy.wait(1000);
    cy.url().should('include', '/asset/KLV');
  });

  it('should search for a block', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('[data-testid="search"]').type('100', { delay: 300 });

    cy.get('[data-testid="card-item"]').contains('100');
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

    cy.get('[data-testid="card-item"]').contains(
      'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
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
