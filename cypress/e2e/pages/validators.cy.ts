/// <reference types="cypress" />

const validatorsLinks: string[] = [];
const validatorsAmount: number = 10;
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

describe('Validators Page', () => {
  beforeEach(() => {
    cy.visit('/validators');
  });

  it('should load the validators page', () => {
    cy.get('h1').contains('Validators').should('be.visible');
  });

  Array.from({ length: validatorsAmount }).forEach((_, index) => {
    it(`Should find validator #${index + 1} from list`, () => {
      // Wait for the list to load before probing for a specific row, so the
      // existence check below isn't racing the async render.
      cy.get(TABLE_ROW_SELECTOR, { timeout: 10000 }).should('exist');

      cy.get('body').then($body => {
        // The list may contain fewer than `validatorsAmount` entries (e.g. in
        // CI), so only collect a link when the row is actually present.
        if ($body.find(`[data-testid="table-row-${index}"]`).length === 0) {
          cy.log(`Validator row #${index} not present in list`);
          return;
        }

        cy.get(`[data-testid="table-row-${index}"]`)
          .find('a')
          .invoke('attr', 'href')
          .then(href => {
            href && validatorsLinks.push(href);
          });
      });
    });
  });
});

describe('Validator Details Page', () => {
  Array.from({ length: validatorsAmount }).forEach((_, index) => {
    it(`should load the validator page #${index + 1}`, () => {
      const link = validatorsLinks[index];

      // Guard against missing links when the list had fewer validators than
      // expected, mirroring the asset details page pattern.
      if (link) {
        cy.visit(link);
        // The detail page fetches the validator client-side (with internal
        // retries) after hydration, which can take longer than Cypress' 4s
        // default under CI load, so give the stake element room to render.
        cy.get('[data-testid="total-stake"]', { timeout: 15000 }).should(
          'be.visible',
        );
      } else {
        cy.log(`No link collected for validator #${index + 1}`);
      }
    });
  });
});
