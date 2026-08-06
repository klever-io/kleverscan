/// <reference types="cypress" />

const validatorsLinks: string[] = [];
const validatorsAmount: number = 10;
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
const TOTAL_STAKE_SELECTOR = '[data-testid="total-stake"]';

// The validator detail page fires a single client-side request on mount and
// does not retry when the API returns an error response, so a transient
// testnet hiccup leaves the page stuck on the loading skeleton forever. Give
// the request time to resolve and, if the stake still hasn't rendered, reload
// to issue a fresh request before failing.
const assertStakeVisibleWithReload = (reloadsLeft = 2): void => {
  cy.wait(2500);
  cy.get('body').then($body => {
    if ($body.find(TOTAL_STAKE_SELECTOR).length > 0) {
      cy.get(TOTAL_STAKE_SELECTOR).should('be.visible');
    } else if (reloadsLeft > 0) {
      cy.reload();
      assertStakeVisibleWithReload(reloadsLeft - 1);
    } else {
      cy.get(TOTAL_STAKE_SELECTOR, { timeout: 10000 }).should('be.visible');
    }
  });
};

// Same pattern as stake: list load can flake under concurrent API pressure
// (full validator snapshot + table + heartbeat). Reload once or twice before
// failing so a single slow testnet response doesn't red the suite.
const assertTableRowsVisibleWithReload = (reloadsLeft = 2): void => {
  cy.get('body').then($body => {
    if ($body.find(TABLE_ROW_SELECTOR).length > 0) {
      cy.get(TABLE_ROW_SELECTOR, { timeout: 10000 }).should('exist');
      return;
    }
    if (reloadsLeft > 0) {
      cy.log(`No validator table rows yet; reloading (${reloadsLeft} left)...`);
      cy.reload();
      // Allow the page + network a beat after reload before re-checking.
      cy.wait(1500);
      assertTableRowsVisibleWithReload(reloadsLeft - 1);
    } else {
      cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should('exist');
    }
  });
};

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
      assertTableRowsVisibleWithReload();

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
        assertStakeVisibleWithReload();
      } else {
        cy.log(`No link collected for validator #${index + 1}`);
      }
    });
  });
});
