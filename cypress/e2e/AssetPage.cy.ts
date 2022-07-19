const BASE_URL = 'http://localhost:3000'

describe('Assets interaction', () => {
  
  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/assets');
  });
  
  it('Click on asset (Token, ID and Name field) and should redirect to asset details', () => {
    cy.get('h1').contains('Assets').should('be.visible');
    cy.contains('Token').should('be.visible');
    cy.contains('ID').should('be.visible');
    cy.contains('Name').should('be.visible');
    cy.contains('Type').should('be.visible');
    cy.contains('Initial Supply').should('be.visible');
    cy.contains('Max Supply').should('be.visible');
    cy.contains('Circulating Supply').should('be.visible');
    cy.contains('Precision').should('be.visible');
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.location().should(url => {
      // const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
    });
    cy.get('.detail__Title-sc-16boktt-2 > :nth-child(1)').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(3) > a').click();
    cy.location().should(url => {
      // const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
    });
    cy.get('.detail__Title-sc-16boktt-2 > :nth-child(1)').click();
    cy.get(':nth-child(1) > :nth-child(4) > p').click();
    cy.location().should(url => {
      // const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
    });
  });

  it('Click on right arrow to go to next page and click on asset', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :last-child').click();
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.location().should(url => {
      // const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
    });
  });

  it('Click on last page and use the left arrow to go back 1 page then click on asset', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-last-child(2)').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :first-child').click();
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.location().should(url => {
      // const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
    });
  });

  it('Asset Details: Click on owner address and should redirect to account details', () => {
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.contains('Owner').should('be.visible');
    cy.contains('Max Supply').should('be.visible');
    cy.contains('Initial Supply').should('be.visible');
    cy.contains('Circulating Supply').should('be.visible');
    cy.contains('Holders').should('be.visible');
    cy.contains('Transactions').should('be.visible');
    cy.contains('Market Cap').should('be.visible');
    cy.get('.ktPCuF > span').should('be.visible');
    cy.contains('Holders').should('be.visible');
    cy.get('.detail__HoverAnchor-sc-16boktt-13').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Asset Details: Click on "More" tab', () => {
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.get('.cfyRog').click();
    // cy.contains('Whitepaper').should('be.visible');
    // cy.contains('Official Website').should('be.visible');
    cy.contains('Issuing Time').should('be.visible');
    cy.contains('Issuer').should('be.visible');
    cy.contains('Precision').should('be.visible');
  });

  it('Asset Details: On Transactions tab click on hash and should redirect to the tx details', () => {
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.contains('Hash').should('be.visible');
    cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(2)').should('be.visible');
    cy.contains('Created').should('be.visible');
    cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(6)').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Contract').should('be.visible');
    cy.contains('Amount').should('be.visible');
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1)').click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });
  });

  it('Asset Details: On Transactions tab click on address (FROM) and should redirect to the account details', () => {
    cy.get(':nth-child(1) > :nth-child(2) > p').click();
    cy.get(':nth-child(1) > :nth-child(3) > small').parent().next().click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  // it('Should redirect to transaction details when type hash of TX on search input', () => {
  //   cy.fixture('searchData').then(({ transaction }) => {
  //     cy.get('input').type(`${transaction}{enter}`);
  //     cy.location().should(url => {
  //       const hash = url.href.split('transaction/')[1];
  //       expect(url.href).include(`${BASE_URL}/transaction/`);
  //       expect(hash).to.have.length(64);
  //     });
  //   });
  // });
  
  // it('Should redirect to account details when type address of an account on search input', () => {
  //   cy.fixture('searchData').then(({ address }) => {
  //     cy.get('input').type(`${address}{enter}`);
  //     cy.location().should(url => {
  //       const address = url.href.split('account/')[1];
  //       expect(url.href).include(`${BASE_URL}/account/`);
  //       expect(address).to.have.length(62);
  //     });
  //   });
  // });
  
  // it('Should redirect to the block details when type the number of a block on search input', () => {
  //   cy.fixture('searchData').then(({ block }) => {
  //     cy.get('input').type(`${block}{enter}`);
  //     cy.location().should(url => {
  //       const blockNum = isNaN(Number(url.href.split('block/')[1]));
  //       expect(url.href).include(`${BASE_URL}/block/`);
  //       expect(blockNum).to.be.false;
  //     });
  //   });
  // });
  
  // it('Should redirect to asset/klv when type the asset on search input', () => {
  //   cy.fixture('searchData').then(({ asset }) => {
  //     cy.get('input').type(`${asset}{enter}`);
  //     cy.location().should(url => {
  //       const asset = url.href.split('asset/')[1];
  //       expect(url.href).include(`${BASE_URL}/asset/`);
  //       expect(asset).equal('KLV');
  //     });
  //   });
  // });
});
export {}; // stop ts error "isolatedModules"