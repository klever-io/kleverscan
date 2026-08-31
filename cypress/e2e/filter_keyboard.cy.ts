/// <reference types="cypress" />

/**
 * The shared filter dropdown, driven by keys only.
 *
 * jsdom cannot move focus the way a browser does, which is exactly where the
 * review round on #704 found the defects this pins: a dropdown left orphaned
 * open, and a control that dropped focus to `body` by hiding itself. The unit
 * suite covers the state machine; this covers what only a real browser answers.
 *
 * Two things are deliberately NOT covered, both because Cypress 13 cannot do
 * them without a plugin this repo does not depend on:
 *
 * 1. A literal Tab traversal. There is no `cy.tab()`, so focus is placed with
 *    `.focus()` and the tab ORDER itself stays unverified.
 * 2. Enter on the opener. That button is a real <button>, so a browser turns
 *    Enter into a click itself; `.type('{enter}')` does not, because the
 *    activation is the browser's, not the app's. The opener is therefore
 *    activated with a click, and every key after it is a real key.
 */

const OPENER =
  '[data-testid="filter-account-type"] button[aria-haspopup="listbox"]';
const LISTBOX = '[role="listbox"]';
const OPTION = '[role="option"]';

const accounts = Array.from({ length: 5 }, (_, index) => ({
  address: `klv1account${String(index + 1).padStart(2, '0')}${'q'.repeat(49)}`,
  nonce: index,
  balance: 1_000_000_000,
  frozenBalance: 0,
  allowance: 0,
  permissions: [],
  timestamp: 1_700_000_000 + index,
  assets: {},
}));

const ok = (
  data: Record<string, unknown>,
  extra: Record<string, unknown> = {},
) => ({
  data,
  error: '',
  code: 'successful',
  ...extra,
});

const stubAccountsApis = (): void => {
  cy.intercept('GET', '**/v1.0/address/list/count/**', {
    statusCode: 200,
    body: ok({ number_by_day: [{ doc_count: accounts.length }] }),
  }).as('accountCount');

  cy.intercept('GET', '**/v1.0/validator/list*', {
    statusCode: 200,
    body: ok({ validators: [] }, { pagination: { totalRecords: 0 } }),
  }).as('validatorList');

  cy.intercept('GET', '**/v1.0/block/by-nonce/0*', {
    statusCode: 200,
    body: ok({ block: { nonce: 0, timestamp: 1_700_000_000_000 } }),
  }).as('blockZero');

  cy.intercept('GET', '**/v1.0/address/list*', {
    statusCode: 200,
    body: ok(
      { accounts },
      {
        pagination: {
          self: 1,
          next: 1,
          previous: 1,
          perPage: 10,
          totalPages: 1,
          totalRecords: accounts.length,
        },
      },
    ),
  }).as('accountList');
};

describe('Shared filter dropdown, keyboard only', () => {
  beforeEach(() => {
    stubAccountsApis();
    cy.visit('/accounts');
    // The list must have arrived before anything is asserted about the filter,
    // otherwise a passing assertion may only mean the page had not rendered.
    cy.wait('@accountList');
  });

  it('opens and hands the options to a reader', () => {
    cy.get(OPENER).should('have.attr', 'aria-expanded', 'false');

    cy.get(OPENER).focus().click();

    cy.get(OPENER).should('have.attr', 'aria-expanded', 'true');
    cy.get(LISTBOX).should('be.visible');
    cy.get(OPTION).should('have.length.greaterThan', 1);
    // Arrow keys walk the list through the input, not through focus moves.
    cy.focused().should('have.attr', 'aria-activedescendant');
  });

  it('walks the options with the arrow keys and selects with Enter', () => {
    cy.get(OPENER).focus().click();

    cy.focused()
      .invoke('attr', 'aria-activedescendant')
      .then(first => {
        cy.focused().type('{downarrow}');
        cy.focused()
          .invoke('attr', 'aria-activedescendant')
          .should('not.eq', first);
      });

    cy.focused().type('{enter}');

    cy.location('search').should('include', 'type=');
    cy.get(LISTBOX).should('not.exist');
    // Focus must come back to the control the reader opened, not to body.
    cy.focused().should('have.attr', 'aria-haspopup', 'listbox');
  });

  // The opposite of the test above: leaving without choosing must change
  // nothing and must still hand focus back.
  it('closes with Escape without selecting, and restores focus', () => {
    cy.location('search').then(search => {
      cy.get(OPENER).focus().click();
      cy.get(LISTBOX).should('be.visible');

      cy.focused().type('{esc}');

      cy.get(LISTBOX).should('not.exist');
      cy.get(OPENER).should('have.attr', 'aria-expanded', 'false');
      cy.focused().should('have.attr', 'aria-haspopup', 'listbox');
      cy.location('search').should('eq', search);
    });
  });
});
