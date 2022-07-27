interface ISocials {
  title: string;
  infoLinks: {
    name: string;
    href: string;
  }[]
}

const BASE_URL = 'http://localhost:3000'

describe('Homepage interaction', () => {

  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/');
  });

  it('Should redirect to "/asset/KLV" and "asset/KFI" when click on each in cardCoin', () => {
    cy.get('span').contains('Klever').click();
    cy.url().should('eq', `${BASE_URL}/asset/KLV`);
    cy.visit('/');
    cy.get('span').contains('Klever').parent().parent()
      .parent().parent().parent()
      .parent().parent().next()
      .children().last().click();
  
    cy.wait(400);
    cy.get('span').contains('Finance').click();
    cy.url().should('eq', `${BASE_URL}/asset/KFI`);
  });

  it('Should have all cards info and footer links with correct URL', () => {
    cy.contains('Total accounts').should('be.visible');
    cy.contains('Total transactions').should('be.visible');
    cy.contains('Live/Peak TPS').should('be.visible');
    cy.contains('Epoch Remaining Time').should('be.visible');
    cy.contains('Market Cap').should('be.visible');
    cy.contains('Volume').should('be.visible');

    cy.scrollTo(0, 1000);

    cy.get('span').contains('Klever Explorer is our main platform to visualize assets')
      .next().children().first()
      .should('have.attr', 'href')
      .and('eq', 'https://www.facebook.com/klever.io');

    cy.get('span').contains('Klever Explorer is our main platform to visualize assets')
      .next().children().first().next()
      .should('have.attr', 'href')
      .and('eq', 'https://twitter.com/klever_io');

    cy.get('span').contains('Klever Explorer is our main platform to visualize assets')
      .next().children().first().next().next()
      .should('have.attr', 'href')
      .and('eq', 'https://discord.gg/klever-io');

    cy.get('span').contains('Klever Explorer is our main platform to visualize assets')
      .next().children().first().next().next().next()
      .should('have.attr', 'href')
      .and('eq', 'https://instagram.com/klever.io');

    cy.get('span').contains('Klever Explorer is our main platform to visualize assets')
      .next().children().first().next().next().next().next()
      .should('have.attr', 'href')
      .and('eq', 'https://t.me/Klever_io');
      
    
    cy.fixture('socialsLinks').then(socials => {
      socials.forEach(({ title, infoLinks }: ISocials) => {
        cy.get('span').contains(title).should('be.visible');
        infoLinks.forEach(({ name, href }) => {
          if (name === 'Klever Finance') {
            cy.get('a').contains('Klever Docs').prev()
              .should('be.visible')
              .and('have.attr', 'href').and('equal', href);
          } else {
            cy.get('a').contains(name).should('be.visible')
              .and('have.attr', 'href').and('equal', href);
          }
        })
      });
    });

  });

  it('Navbar links should redirect to the correct page', () => {

    cy.contains('Blocks').click();
    cy.url().should('eq', `${BASE_URL}/blocks`);
    cy.wait(400);

    cy.contains('Accounts').click();
    cy.url().should('eq', `${BASE_URL}/accounts`);
    cy.wait(400);

    cy.contains('Transactions').click();
    cy.url().should('eq', `${BASE_URL}/transactions`);
    cy.wait(400);

    cy.contains('Assets').click();
    cy.url().should('eq', `${BASE_URL}/assets`);
    cy.wait(400);

    cy.contains('Validators').click();
    cy.url().should('eq', `${BASE_URL}/validators`);
    cy.wait(400);
  });

  it('Click Blocks link of carousel should redirect to blocks page, same for Transaction', () => {

    cy.get('h1').contains('Blocks').click();
    cy.url().should('eq', `${BASE_URL}/blocks`);
    cy.visit('/');
    cy.get('h1').contains('Transactions').click();
    cy.url().should('eq', `${BASE_URL}/transactions`);
  });


  it('Should redirect to block details page when click on any block of the carousel', () => {
    cy.wait(500);
    cy.get('.styles__Content-sc-ehx52m-1 > :nth-child(3)').click();
    cy.get('a').contains('Reward').should('be.visible');
    cy.location().should(({ href }) => {
      const isNumber = !isNaN(Number(href.split('block/')[1]));
      expect(href).contains(`${BASE_URL}/block/`);
      expect(isNumber).to.be.true;

    });
    cy.url().should('include', `${BASE_URL}/block/`);
  });

  it('Should redirect to transaction details page when click on any transaction', () => {

    cy.get('h1').contains('Transactions').should('be.visible')
    cy.get('.home__TransactionContainer-sc-qf5lnw-15 > :nth-child(1) > :nth-child(1) > :nth-child(1) > a').click();
    cy.wait(1000);
    cy.location().should(url => {
      const txHash = url.href.split('transaction/')[1];
      expect(url.href).contains(`${BASE_URL}/transaction`);
      expect(txHash).length(64);
    });
  });

  it('Should redirect to account details page when click on any account (FROM)', () => {

    cy.get('strong').contains('From:').next().click();
    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).to.include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Should redirect to account details page when click on any account (To)', () => {
    cy.get(':nth-child(2) > .clean-style').contains(/^[a-z]/).click();

    cy.location().should(url => {
      const address = url.href.split('account/')[1];
      expect(url.href).to.include(`${BASE_URL}/account/`);
      expect(address).to.have.length(62);
    });
  });

  it('Should redirect to home when click "Back to homepage"', () => {
    cy.visit('/404', { failOnStatusCode: false });

    cy.get('h1').contains('Page not found!').should('be.visible');
    cy.get('span').contains('Visit our help center').should('be.visible');
    cy.get('span').contains('Back to homepage').should('be.visible').click();
    cy.url().should('eq', `${BASE_URL}/`);
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