
const BASE_URL = 'http://localhost:3000'

describe('Blocks Page interaction', () => {

  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/blocks');
  });

  it('Should redirect to block details page when click on block number', () => {
    cy.contains('Number of Blocks').should('be.visible');
    cy.contains('Blocks Yesterday').should('be.visible');
    cy.contains('Cumulative Number').should('be.visible');
    cy.contains('Block Reward').should('be.visible');
    cy.contains('Reward Yesterday').should('be.visible');
    cy.contains('Cumulative Revenue').should('be.visible');
    cy.contains('Stats on Burned KLV').should('be.visible');
    cy.contains('Burned Yesterday').should('be.visible');
    cy.contains('Burned in Total').should('be.visible');
    cy.get('h3').contains('List of blocks').parent().next()
      .children().first().children().first().next()
      .children().first().children().first().click();
    cy.location().should(url => {
      const blockNum = isNaN(Number(url.href.split('block/')[1]));
      expect(blockNum).to.be.false;
      expect(url.href).to.include(`${BASE_URL}/block/`);
    });
  });

  it('Should redirect to validator details page when click on "Producer" address', () => {
    cy.get('h3').contains('List of blocks').parent().next()
      .children().first().children().first().next()
      .children().first().children().first().next().next().click();
    cy.wait(500);
    cy.location().should(url => {
      const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
      Cypress.on('uncaught:exception', (err) => {
        if(resizeObserverLoopErrRe.test(err.message)) {
          return false;
        }
      });
      const address = url.href.split('validator/')[1];
      expect(address).to.have.length(62);
      expect(url.href).to.include(`${BASE_URL}/validator/`);
    });
  });

  it('Should use the right arrow to navigate to page 2 and 3,  with left arrow should back to page 2 and finally click on block of the page and redirect to block details', () => {
    cy.get('.hWzTrJ > svg');
    cy.get('.aaQsj').click();
    cy.get('.aaQsj').eq(1).click();
    cy.get('.aaQsj').eq(0).click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();
    cy.contains('Block Detail').should('be.visible');
  });

  it('Should click on page 6 and click on the block of the page and finally redirect to block details', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(7) > span').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();
    cy.contains('Block Detail').should('be.visible');
  });

  it('Should use the "..." to navigate to page 500, 800 and after that go to page 1000. And should enter on the block details of the page', () => {
    cy.get(':nth-child(9) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('500');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();
    cy.contains('Block Detail').should('be.visible');
    cy.get('.detail__Title-sc-1hrlpyd-2 > :nth-child(1) > svg').click();

    cy.get(':nth-child(9) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('800');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();

    cy.contains('Block Detail').should('be.visible');
    cy.get('.detail__Title-sc-1hrlpyd-2 > :nth-child(1) > svg').click();

    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(10) > span').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();
    cy.contains('Block Detail').should('be.visible');

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

  it('Click "Info" and show all info of the block.', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').click();
    cy.wait(400);
    cy.contains('Hash').should('be.visible');
    cy.contains('Timestamp').should('be.visible');
    cy.contains('Nonce').should('be.visible');
    cy.contains('Epoch').should('be.visible');
    cy.contains('Block Size').should('be.visible');
    cy.contains('KApp Fee').should('be.visible');   
    cy.contains('Burned Fee').should('be.visible');   
    cy.contains('Bandwidth Fee').should('be.visible');   
    cy.get('.fleKXr').click();
    cy.contains('Software Version').should('be.visible');
    cy.contains('Chain ID').should('be.visible');
    cy.contains('Producer Signature').should('be.visible');
    cy.contains('Parent Hash').should('be.visible');
    cy.contains('Trie Root').should('be.visible');
    cy.contains('Validators Trie Root').should('be.visible');
    cy.contains('KApps Trie Root').should('be.visible');
    cy.contains('Previous Random Seed').should('be.visible');
    cy.get(':nth-child(9) > .detail__CommonSpan-sc-1hrlpyd-14 > strong').contains('Random Seed').should('be.visible');
    cy.get('.fleKXr').click();
    cy.get('.Copy__IconContainer-sc-15b3s39-0').click();
    cy.contains('Hash copied to clipboard').should('be.visible');
  });
  
  // it.only('Should update automatically the block list when "Auto-update" is turned on', () => {
  //   // cy.get('span').contains('Auto update').next().click();
  //   cy.get('h3').contains('List of blocks').parent().next()
  //   .children().first().children().first().next()
  //   .children().last().children().first().children();
  // });
});
export {}; // stop ts error "isolatedModules"