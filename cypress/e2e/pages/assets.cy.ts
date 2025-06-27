/// <reference types="cypress" />

const assetsTypes = ['Fungible', 'NonFungible'];

const assets_links: { name: string; link: string }[] = [];

describe('Assets Page', () => {
  beforeEach(() => {
    cy.visit('/assets');
  });

  it('should load the assets page', () => {
    cy.get('h1', { timeout: 10000 }).contains('Assets').should('be.visible');
  });

  assetsTypes.forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter Assets by type - ${type}`, () => {
      cy.wait(5000);

      const typeFilter = cy.get(':nth-child(2) > [data-testid="selector"]', {
        timeout: 10000,
      });

      cy.wait(1000);

      typeFilter.click();

      cy.wait(1000);

      typeFilter.contains(type, { timeout: 60000 }).click();

      cy.wait(5000);

      cy.url().then(currentUrl => {
        const url = new URL(currentUrl);
        const typeParam = url.searchParams.get('type');
        expect(typeParam).to.eq(type);
      });

      cy.get('body').then($body => {
        if ($body.length > 0) {
          const hasRow = $body.find('[data-testid^="table-row-"]').length > 0;
          if (hasRow) {
            cy.get('[data-testid="table-row-0"]', { timeout: 5000 })
              .first()
              .find('a')
              .invoke('attr', 'href')
              .then(href => {
                href && assets_links.push({ name: type, link: href });
              });
          } else {
            cy.get('[data-testid="table-empty"]', { timeout: 5000 }).should(
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
      const findType = assets_links.find(asset => asset.name === type);

      cy.wait(5000);

      if (findType) {
        cy.visit({
          url: findType.link,
          timeout: 60000,
        });

        cy.wait(5000);

        cy.get('h1', { timeout: 60000 })
          .contains('Asset', { timeout: 60000 })
          .should('be.visible');
      } else {
        cy.log('No asset found');
      }
    });
  });
});
