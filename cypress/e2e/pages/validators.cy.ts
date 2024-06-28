/// <reference types="cypress" />

const validatorsLinks: string[] = [];
const validatorsAmount: number = 10;

describe('Validators Page', () => {
  beforeEach(() => {
    cy.visit('/validators');
  });

  it('should load the validators page', () => {
    cy.get('h1').contains('Validators').should('be.visible');
  });

  Array.from({ length: validatorsAmount }).forEach((_, index) => {
    it(`Should find validator #${index + 1} from list`, () => {
      cy.get(`[data-testid="table-row-${index}"]`)
        .find('a')
        .invoke('attr', 'href')
        .then(href => {
          href && validatorsLinks.push(href);
        });
    });
  });
});

describe('Validator Details Page', () => {
  Array.from({ length: validatorsAmount }).forEach((_, index) => {
    it(`should load the validator page #${index + 1}`, () => {
      cy.visit(validatorsLinks[index]);

      cy.get('[data-testid="total-stake"]').should('be.visible');
    });
  });
});
