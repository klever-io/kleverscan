describe('Transaction page interaction', () => {
  const BASE_URL = 'http://localhost:3000'
  
  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/transactions')
  });
  
  it('Should redirect to transaction detail when click on any hash of transaction', () => {
   cy.get('h1').contains('Transactions').should('be.visible');
   cy.contains('Coin').should('be.visible');
   cy.contains('Status').should('be.visible');
   cy.contains('Contract').should('be.visible');
   cy.contains('Hash').should('be.visible');
   cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(2)').contains('Block').should('be.visible');
   cy.contains('Created').should('be.visible');
   cy.contains('From').should('be.visible');
   cy.contains('To').should('be.visible');
   cy.contains('Status').should('be.visible');
   cy.contains('Contract').should('be.visible');
   cy.contains('kApp Fee').should('be.visible');
   cy.contains('Bandwidth Fee').should('be.visible');

   cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
   cy.wait(1000);
   cy.contains('Transaction Details');

   cy.location().should(url => {
    const txHash = url.href.split('transaction/')[1];
    expect(url.href).include(`${BASE_URL}/transaction/`);
    expect(txHash).to.have.length(64);
   });
  });

  it('Should redirect to block detail when click on any block number', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(2)').click();
    cy.location().should(url => {
      const blockNum = isNaN(Number(url.href.split('block/')[1]));
      expect(url.href).include(`${BASE_URL}/block/`);
      expect(blockNum).to.be.false;
    });
  });

  it('Should redirect to account detail when click on any address (FROM)', () => {
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(4)').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });
  
  it('Should use the right arrow to navigate to page 2 and 3,  with left arrow should back to page 1 and finally click on address of the page and redirect to account details', () => {
    cy.get('.aaQsj').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(11)').click();
    cy.wait(1000);
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(1)').click();
    cy.wait(1500);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });
    // cy.wait(2500);
    // cy.go(-1);
  });
  
  it('Should click on page 7 and click on the address of the page and finally redirect to account details', () => {
    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(8)').contains('7').click();
    cy.wait(3500);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(4)').click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });
  
  it('Should use the "..." to navigate to page that aren\'t shown, click in the any transaction and should redirect to transaction detail', () => {
    cy.get(':nth-child(9) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('100');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });
  });

  it('Should use the "..." to navigate to page that aren\'t shown, go to last page and finally should enter on the transaction details of the page', () => {
    cy.get(':nth-child(9) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('98');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.wait(1000);
    cy.get(':nth-child(3) > .styles__ItemContainer-sc-1iq811b-3').click();
    cy.get('.styles__Container-sc-73jxvx-0 > input').type('120');
    cy.get('.styles__Confirm-sc-porxf3-5').click();
    cy.wait(1000);

    cy.get('.styles__Container-sc-1iq811b-1 > :nth-child(10)').click();
    cy.wait(2000);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
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

  it('Filter transaction using date filter', () => {
    const date = new Date();
    cy.get('.styles__OutsideContent-sc-yhzcck-2').click();
    if(date.getDate() > 2) {
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains(String(date.getDate())).click();
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains(String(date.getDate() - 2)).click();
      cy.get('.styles__Confirm-sc-yhzcck-14').click();
      const filter = `${date.getMonth() + 1}/${date.getDate() - 2}/${date.getFullYear()} - ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      cy.get('.styles__Input-sc-yhzcck-3').should('have.value', filter);

    } else {
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains('1').click();
      cy.get(':nth-child(1) > rect').click();
      cy.get('.styles__DaysTable-sc-yhzcck-11').contains('26').click();
      cy.get('.styles__Confirm-sc-yhzcck-14').click();
      const getMonth = date.getMonth() === 0 ? 1 : date.getMonth();
      const filter = `${getMonth}/26/${date.getFullYear()} - ${date.getMonth() + 1}/1/${date.getFullYear()}`
      cy.get('.styles__Input-sc-yhzcck-3').should('have.value', filter);
    }
  });

  it('Filter only by coin and click on any transaction, back to tx list and first only by status and click on any transaction. Back to tx list and filter only by contact and click on any transaction', () => {
    cy.get(':nth-child(1) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(1) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2 > :nth-child(2)').click();
    cy.wait(1000);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });

    cy.get('.detail__Title-sc-hi7vn3-2 > div').click();
    cy.get(':nth-child(2) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(2) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2 > :nth-child(2)').click();
    cy.wait(1000);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });

    cy.get('.detail__Title-sc-hi7vn3-2 > div').click();
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2 > :nth-child(2)').click();
    cy.wait(1000);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });
  });

  it('Filter by coin, status and contract', () => {
    cy.get(':nth-child(1) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(1) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2 > :nth-child(2)').click();
    cy.wait(500);
    cy.get(':nth-child(2) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(2) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2 > :nth-child(2)').click();
    cy.wait(500);
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2').contains('Freeze').click();
    cy.wait(1500);

    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).include(`${BASE_URL}/transaction/`);
      expect(txHash).to.have.length(64);
    });
  });

  it('Transaction Details ( Freeze ): Should redirect to account details when click on address ( FROM )', () => {
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2').contains('Freeze').click();
    cy.wait(500);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.contains('Hash').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Result Code').should('be.visible');
    cy.contains('Block Number').should('be.visible');
    cy.contains('Nonce').should('be.visible');
    cy.contains('From').should('be.visible');
    cy.contains('kApp Fee').should('be.visible');
    cy.contains('Bandwidth Fee').should('be.visible');
    cy.contains('Time').should('be.visible');
    cy.contains('Signature').should('be.visible');
    cy.contains('Data').should('be.visible');
    cy.get('h3').contains('Contract').should('be.visible');
    cy.get('strong').contains('Contract').should('be.visible');
    cy.contains('Owner').should('be.visible');
    cy.contains('Amount').should('be.visible');
    cy.contains('Bucket ID').should('be.visible');
    cy.get('h3').contains('Raw Tx').should('be.visible');

    cy.get(':nth-child(6) > :nth-child(2) > a').click();
    cy.wait(500);
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Transaction Details ( Create Asset ): Should redirect to account details when click on address ( FROM )', () => {
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1').click();
    cy.get(':nth-child(3) > .styles__Content-sc-1hif3ao-1 > .styles__SelectorContainer-sc-1hif3ao-2').contains('Create Asset').click();
    cy.wait(500);
    cy.get('.styles__Body-sc-zt5c8s-2 > :nth-child(1) > :nth-child(1) > a').parent().click();
    cy.get('h3').contains('Contract').should('be.visible');
    cy.get('strong').contains('Contract').should('be.visible');
    cy.contains('Asset ID').should('be.visible');
    cy.get('strong').contains('Name').should('be.visible');
    cy.contains('Owner').should('be.visible');
    cy.contains('Token').should('be.visible');
    cy.get('strong').contains('Precision').should('be.visible');
    cy.contains('Circulating Supply').should('be.visible');
    cy.contains('Initial Supply').should('be.visible'); 
    cy.contains('Max Supply').should('be.visible'); 

    cy.get(':nth-child(4) > :nth-child(2) > a').click();
    cy.wait(500);

    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).include(`${BASE_URL}/account/`)
      expect(address).to.have.length(62);
    });
  });
});


export {}; // stop ts error "isolatedModules"
