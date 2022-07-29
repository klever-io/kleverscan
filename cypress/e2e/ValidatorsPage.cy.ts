const BASE_URL = 'http://localhost:3000'

describe('Validators interaction', () => {

  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/validators');
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
    Cypress.on('uncaught:exception', (err) => {
      if(resizeObserverLoopErrRe.test(err.message)) {
        return false;
      }
    });
  });

  it('Click on validator hash and redirect to validator details and use the back arrow to go back to validators list', () => {
    cy.contains('Rank').should('be.visible');
    cy.contains('Name').should('be.visible');
    cy.contains('Rating').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Stake').should('be.visible');
    cy.contains('Produced / Missed').should('be.visible');
    cy.contains('Can Delegate').should('be.visible');
    cy.contains('Cumulative Stake').should('be.visible');
    cy.get('h1').contains('Validators').should('be.visible');
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.get('.validator__Title-sc-1jnsbb5-23 > :nth-child(1) > svg');
    cy.get('.validator__Title-sc-1jnsbb5-23 > :nth-child(1)').click();
    cy.location().should(url => {
      const address = url.href.split('validator/')[1];
      expect(url.href).include(`${BASE_URL}/validator/`);
      expect(address).to.have.length(62);
    });
  });

  it('Use the right arrow to go to next page, enter on the first validator hash and redirect to validator details', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :last-child').click();
    cy.wait(1000);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.location().should(url => {
      const address = url.href.split('validator/')[1];
      expect(url.href).include(`${BASE_URL}/validator/`);
      expect(address).to.have.length(62);
    });
  });

  it('Click on last page and use the left arrow to back 1 page, enter on the first validator hash and redirect to validator details', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-last-child(2)').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :first-child').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.location().should(url => {
      const address = url.href.split('validator/')[1];
      expect(url.href).include(`${BASE_URL}/validator/`);
      expect(address).to.have.length(62);
    });
  });

  it('Validator Details: Copy the pub key', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.contains('Current Delegations').should('be.visible');
    cy.contains('Reward Distribution Ratio').should('be.visible');
    cy.contains('Voters').should('be.visible');
    cy.contains('Commission').should('be.visible');
    cy.contains('Delegated').should('be.visible');
    cy.contains('Owner Address').should('be.visible');
    cy.contains('Rating').should('be.visible');
    cy.contains('List').should('be.visible');
    cy.contains('Max Delegation').should('be.visible');
    cy.contains('Staked Balance').should('be.visible');
    cy.contains('Total Produced').should('be.visible');
    cy.contains('Commission').should('be.visible');
    cy.contains('URIS').should('be.visible');
    cy.contains('Can Delegate').should('be.visible');
    cy.contains('Self Stake').should('be.visible');
    cy.contains('Total Missed').should('be.visible');
    cy.get('h3').contains('List of delegations').should('be.visible');
    cy.contains('Address').should('be.visible');
    cy.contains('Bucket ID').should('be.visible');
    cy.contains('Staked Epoch').should('be.visible');
    cy.contains('Amount').should('be.visible');
    cy.get('.validator__CopyBackground-sc-1jnsbb5-4 > .Copy__IconContainer-sc-15b3s39-0 > svg').click();
    cy.get('div').contains('Key copied to clipboard').should('be.visible');
  });

  it('Validator Details: Click on address on "Owner Address" and should redirect to account detail page', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.get('.detail__CenteredRow-sc-f211pl-11 > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Validator Details: On list details, click on address and should redirect to account details page', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2) > a').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });


  it('Should redirect to transaction details when type hash of TX on search input', () => {
    cy.fixture('searchData').then(({ transaction }) => {
      cy.get('input').type(`${transaction}{enter}`);
      cy.location().should(url => {
        const hash = url.href.split('transaction/')[1];
        expect(url.href).include(`${BASE_URL}/transaction/`);
        expect(hash).to.have.length(64);
      });
    });
  });
  
  it('Should redirect to account details when type address of an account on search input', () => {
    cy.fixture('searchData').then(({ address }) => {
      cy.get('input').type(`${address}{enter}`);
      cy.location().should(url => {
        const address = url.href.split('account/')[1];
        expect(url.href).include(`${BASE_URL}/account/`);
        expect(address).to.have.length(62);
      });
    });
  });
  
  it('Should redirect to the block details when type the number of a block on search input', () => {
    cy.fixture('searchData').then(({ block }) => {
      cy.get('input').type(`${block}{enter}`);
      cy.location().should(url => {
        const blockNum = isNaN(Number(url.href.split('block/')[1]));
        expect(url.href).include(`${BASE_URL}/block/`);
        expect(blockNum).to.be.false;
      });
    });
  });
  
  it('Should redirect to asset/klv when type the asset on search input', () => {
    cy.fixture('searchData').then(({ asset }) => {
      cy.get('input').type(`${asset}{enter}`);
      cy.location().should(url => {
        const asset = url.href.split('asset/')[1];
        expect(url.href).include(`${BASE_URL}/asset/`);
        expect(asset).equal('KLV');
      });
    });
  });
});
export {}; // stop ts error "isolatedModules"