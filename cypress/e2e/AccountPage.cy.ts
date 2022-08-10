describe('Account Page interaction', () => {
  const BASE_URL = 'http://localhost:3000'
  
  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/accounts');
  });

  it('Should redirect to account detail when click on any address', () => {
    cy.get('h1').contains('Accounts').should('be.visible');
    cy.contains('Number of Accounts').should('be.visible');
    cy.contains('Accounts created in the last 24h').should('be.visible');
    cy.contains('Total accounts').should('be.visible');
    cy.contains('List of accounts').should('be.visible');
    cy.contains('Address').should('be.visible');
    cy.contains('KLV Staked').should('be.visible');
    cy.contains('Nonce').should('be.visible');
    cy.contains('KLV Balance').should('be.visible');

    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Should use the right arrow to navigate to page 2 and 3,  with left arrow should back to page 2 and finally click on address of the page and redirect to account details', () => {

    cy.get('.styles__Container-sc-1iq811b-1 > :last-child').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :last-child').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(1)').click();
    cy.wait(1500);
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Should click on page 5 and click on the address of the page and finally redirect to account details', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(6)').contains('5').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Should use the "..." to navigate to page that aren\'t shown and after that go to last page. And should enter on the account details of the page', () => {
    cy.get(':nth-child(9) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('20');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
    cy.get('.detail__Title-sc-m29ajr-2 > div').click();
    cy.wait(1500)
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-last-child(2)').click();
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
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

  it('Asset Tab: Should redirect to KFI asset page when click on KLV asset', () => {
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.wait(2500);
    cy.contains('Address').should('be.visible');
    cy.contains('Balance').should('be.visible');
    cy.contains('Available').should('be.visible');
    cy.contains('Frozen').should('be.visible');
    cy.contains('Unfrozen').should('be.visible');
    cy.get('.detail__OverviewContainer-sc-m29ajr-4 > :nth-child(3) > :nth-child(1)')
      .contains('Rewards');
    cy.get('.detail__OverviewContainer-sc-m29ajr-4 > :nth-child(3) > :nth-child(1)')
      .contains('Available');
    cy.contains('Allowance').should('be.visible');
    cy.contains('Staking').should('be.visible');
    cy.contains('Nonce').should('be.visible');
    cy.get('strong').contains('Transactions').should('be.visible');
    cy.get('.lhoAkP > span').contains('Assets').should('be.visible');
    cy.get('a').contains('KFI').click();
    cy.location().should(url => {
      const assetId = url.href.split('asset/')[1];
      expect(url.href).include(`${BASE_URL}/asset/`);
      expect(assetId).equals('KFI');
    });
  });

  it('Transaction Tab: Click on TX hash of that account and redirect to Transaction detail', () => {
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.wait(2500);
    cy.get('.styles__TabContent-sc-1p8l23y-2 > :nth-child(2) > span')
      .contains('Transactions').should('be.visible').click();

    cy.contains('Hash').should('be.visible');
    cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(2)').contains('Block').should('be.visible');
    cy.contains('Created').should('be.visible');
    cy.contains('From').should('be.visible');
    cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(6)').contains('To').should('be.visible');
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

  it('Transaction Tab: Filter using the date filter', () => {
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.wait(2500);
    cy.get('.styles__TabContent-sc-1p8l23y-2 > :nth-child(2) > span')
      .contains('Transactions').should('be.visible').click();

    const date = new Date();
    cy.get('.styles__OutsideContent-sc-yhzcck-2').click();
    if(date.getDate() > 2) {
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains(String(date.getDate())).click();
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains(String(date.getDate() - 2)).click();
      cy.get('.styles__Confirm-sc-yhzcck-14').click();
      const filter = `${date.getMonth() + 1}/${date.getDate() - 2}/${date.getFullYear()} - ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      cy.get('.styles__Input-sc-yhzcck-3').should('have.value', filter);

    } else {
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains('1').click();
      cy.get(':nth-child(1) > rect').click();
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains('26').click();
      cy.get('.styles__Confirm-sc-yhzcck-14').click();
      const getMonth = date.getMonth() === 0 ? 1 : date.getMonth();
      const filter = `${getMonth}/26/${date.getFullYear()} - ${date.getMonth() + 1}/1/${date.getFullYear()}`;
      cy.get('.styles__Input-sc-yhzcck-3').should('have.value', filter);
    }
  });

  it('Transaction Tab: Click on address FROM and should redirect to account detail.', () => {
    cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
    cy.wait(2500);
    cy.get('.styles__TabContent-sc-1p8l23y-2 > :nth-child(2) > span')
      .contains('Transactions').should('be.visible').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(4)').click();
    cy.wait(2000);
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  // it('Buckets Tab: click on address of the "Delegation" and should redirect to account detail', () => {
  //   cy.get(':nth-child(1) > :nth-child(1) > .detail__CenteredRow-sc-m29ajr-7 > a').click();
  //   cy.get('.styles__TabContent-sc-1p8l23y-2 > :nth-child(3) > span')
  //     .contains('Buckets').should('be.visible').click();
  //   cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(1)').contains('Staked Values')
  //     .should('be.visible');
  //   cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(2)').contains('Staked')
  //     .should('be.visible');
  //   cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(3)').contains('Staked Epoch')
  //     .should('be.visible');
  //   cy.contains('Bucket Id').should('be.visible');
  //   cy.contains('Unstaked Epoch').should('be.visible');
  //   cy.contains('Available Epoch').should('be.visible');
  //   cy.contains('Delegation').should('be.visible');
  //   cy.get(':nth-child(7) > a').should(({0: element}) => {
  //     const address = element.baseURI.split('account/')[1];
  //     expect(element.baseURI).include(`${BASE_URL}/account/`);
  //     expect(address).to.have.length(62);
  //   });
  // });
});

export {}; // stop ts error "isolatedModules"
