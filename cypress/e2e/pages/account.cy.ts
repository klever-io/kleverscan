/// <reference types="cypress" />

const transactionsTypes = ['Transactions Out', 'Transactions In'];

const address =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

describe('Account Page', () => {
  beforeEach(() => {
    cy.visit(
      '/account/klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
    );
  });

  const transaction_links: { name: string; link: string }[] = [];
  const PAGE_TITLE_SELECTOR = 'h1';
  const TYPE_FILTER_SELECTOR = '[data-testid="selector"]';
  const TAB_SELECTOR = '[data-testid="tab"]';
  const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
  const TABLE_ROW_0_LINK_SELECTOR = '[data-testid="table-row-0"] a';
  const TABLE_EMPTY_SELECTOR = '[data-testid="table-empty"]';

  it('should load the account page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Account')
      .should('be.visible');
  });

  transactionsTypes.forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter Transactions by type - ${type}`, () => {
      cy.scrollTo(0, 500);

      cy.get(TAB_SELECTOR).contains('Transactions', { timeout: 10000 }).click();

      cy.url().then(currentUrl => {
        const url = new URL(currentUrl);
        const tabParam = url.searchParams.get('tab');
        expect(tabParam).to.eq('Transactions');
      });

      const typeFilter = cy.get(TYPE_FILTER_SELECTOR).first();

      typeFilter.click();

      typeFilter.contains(type, { timeout: 5000 }).click();

      cy.url().then(currentUrl => {
        const url = new URL(currentUrl);
        if (type === 'Transactions Out') {
          const fromAddressParam = url.searchParams.get('fromAddress');
          expect(fromAddressParam).to.eq(address);
        } else if (type === 'Transactions In') {
          const toAddressParam = url.searchParams.get('toAddress');
          expect(toAddressParam).to.eq(address);
        }
      });

      cy.wait(5000);

      cy.get('body').then($body => {
        if ($body.length > 0) {
          const hasRow = $body.find(TABLE_ROW_SELECTOR).length > 0;
          if (hasRow) {
            cy.get(TABLE_ROW_0_LINK_SELECTOR, { timeout: 5000 })
              .first()
              .invoke('attr', 'href')
              .then(href => {
                href && transaction_links.push({ name: type, link: href });
              });
          } else {
            cy.get(TABLE_EMPTY_SELECTOR, { timeout: 5000 }).should(
              'be.visible',
            );
          }
        }
      });
    });
  });
});
