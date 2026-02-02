/// <reference types="cypress" />

describe('Smoke Test - All Routes', () => {
  const simpleRoutes = [
    { path: '/', name: 'Home' },
    { path: '/blocks', name: 'Blocks' },
    { path: '/ito', name: 'ITO' },
    { path: '/marketplaces', name: 'Marketplaces' },
    { path: '/create-transaction', name: 'Create Transaction' },
    { path: '/encoding-converter', name: 'Encoding Converter' },
    { path: '/verify-signature', name: 'Verify Signature' },
    { path: '/multisign', name: 'Multisign' },
    { path: '/charts', name: 'Charts' },
  ];

  const listRoutes = [
    {
      path: '/transactions',
      name: 'Transactions',
      selector: '[data-testid="transaction-link"]',
      detailPath: '/transaction/',
    },
    {
      path: '/accounts',
      name: 'Accounts',
      selector: '[data-testid="account-link"]',
      detailPath: '/account/',
    },
    {
      path: '/assets',
      name: 'Assets',
      selector: '[data-testid="asset-link"]',
      detailPath: '/asset/',
    },
    {
      path: '/validators',
      name: 'Validators',
      selector: '[data-testid="validator-link"]',
      detailPath: '/validator/',
    },
    {
      path: '/proposals',
      name: 'Proposals',
      selector: '[data-testid="proposal-link"]',
      detailPath: '/account/',
    },
    {
      path: '/smart-contracts',
      name: 'Smart Contracts',
      selector: '[data-testid="smart-contract-link"]',
      detailPath: '/smart-contract/',
    },
  ];

  simpleRoutes.forEach(route => {
    it(`should load ${route.name} (${route.path})`, () => {
      cy.visit(route.path);
      cy.contains('404').should('not.exist');
      cy.get('body').should('be.visible');
    });
  });

  listRoutes.forEach(route => {
    it(`should load ${route.name} list and click first item`, () => {
      cy.visit(route.path);
      cy.contains('404').should('not.exist');
      cy.get('body').should('be.visible');

      // Wait for table rows to load (or smart contract cards for mobile view)
      cy.get('body').then($body => {
        const hasTableRows =
          $body.find('[data-testid^="table-row-"]').length > 0;
        const hasEmptyState =
          $body.find('[data-testid="table-empty"]').length > 0;
        const hasSmartContractCards =
          $body.find('[data-testid="smart-contract-card"]').length > 0;

        if (!hasEmptyState && (hasTableRows || hasSmartContractCards)) {
          // Wait for the specific link to exist and click it
          cy.get(route.selector, { timeout: 10000 })
            .should('exist')
            .first()
            .click({ force: true });

          // Verify detail page loaded
          cy.url().should('include', route.detailPath);
          cy.contains('404').should('not.exist');
        } else {
          cy.log(`No ${route.name} available or still loading`);
        }
      });
    });
  });
});
