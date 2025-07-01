/// <reference types="cypress" />

const assetsTypes = ['Fungible', 'NonFungible'];
const assetsLinks: { name: string; link: string }[] = [];
const PAGE_TITLE_SELECTOR = 'h1';

describe('Assets Page', () => {
  const TYPE_FILTER_SELECTOR = ':nth-child(2) > [data-testid="selector"]';
  const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
  const TABLE_ROW_0_LINK_SELECTOR = '[data-testid="table-row-0"] a';
  const TABLE_EMPTY_SELECTOR = '[data-testid="table-empty"]';
  beforeEach(() => {
    cy.visit('/assets');
  });

  it('should load the assets page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Assets')
      .should('be.visible');
  });

  assetsTypes.forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter Assets by type - ${type}`, () => {
      const typeFilter = cy.get(TYPE_FILTER_SELECTOR, {
        timeout: 5000,
      });

      typeFilter.click();

      typeFilter.contains(type, { timeout: 5000 }).click();

      cy.wait(5000);

      cy.url().then(currentUrl => {
        const url = new URL(currentUrl);
        const typeParam = url.searchParams.get('type');
        expect(typeParam).to.eq(type);
      });

      cy.get('body').then($body => {
        if ($body.length > 0) {
          const hasRow = $body.find(TABLE_ROW_SELECTOR).length > 0;
          if (hasRow) {
            cy.get(TABLE_ROW_0_LINK_SELECTOR, { timeout: 5000 })
              .first()
              .invoke('attr', 'href')
              .then(href => {
                href && assetsLinks.push({ name: type, link: href });
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

describe('Asset Details Page', () => {
  assetsTypes.forEach(type => {
    if (typeof type !== 'string') return;

    it(`should load the asset details page - ${type}`, () => {
      const findType = assetsLinks.find(asset => asset.name === type);

      if (findType) {
        cy.visit({
          url: findType.link,
          timeout: 60000,
        });

        cy.get(PAGE_TITLE_SELECTOR, { timeout: 60000 })
          .contains('Asset', { timeout: 60000 })
          .should('be.visible');
      } else {
        cy.log('No asset found');
      }
    });
  });
});
