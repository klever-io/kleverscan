
const BASE_URL = 'http://localhost:3000'

describe('Proposals interaction', () => {
  
  beforeEach(() => {
    cy.viewport(1900, 1080);
    cy.visit('/proposals')
  });
  
  it('Should have all network parameters visible', () => {
    cy.get('h1').contains('Proposal').should('be.visible');
    cy.contains('Number').should('be.visible');
    cy.get('.styles__Header-sc-zt5c8s-1 > :nth-child(2)').contains('Parameter').should('be.visible');
    cy.contains('Current Value').should('be.visible');
    cy.contains('Fee Per Data Byte').should('be.visible');
    cy.contains('KApp Fee for Validator Creation').should('be.visible');
    cy.contains('KApp Fee for Asset Creation').should('be.visible');
    cy.contains('Max Epochs to clear unclaimed').should('be.visible');
    cy.contains('Min Self Delegation Amount').should('be.visible');
    cy.contains('Min Total Delegation Amount').should('be.visible');
    cy.contains('Block Rewards').should('be.visible');
    cy.contains('Staking Rewards').should('be.visible');
    cy.contains('KApp Fee for Transfer').should('be.visible');
    cy.contains('KApp Fee for Asset Trigger').should('be.visible');
    cy.contains('KApp Fee for Validator Config').should('be.visible');
    cy.contains('KApp Fee for Freeze').should('be.visible');
    cy.contains('KApp Fee for Unfreeze').should('be.visible');
    cy.contains('KApp Fee for Delegation').should('be.visible');
    cy.contains('KApp Fee for Undelegate').should('be.visible');
    cy.contains('KApp Fee for Withdraw').should('be.visible');
    cy.contains('KApp Fee for Claim').should('be.visible');
    cy.contains('KApp Fee for Unjail').should('be.visible');
    cy.contains('KApp Fee for Account Name').should('be.visible');
    cy.contains('KApp Fee for Proposal').should('be.visible');
    cy.contains('KApp Fee for Vote').should('be.visible');
    cy.contains('KApp Fee for Config ITO').should('be.visible');
    cy.contains('KApp Fee for Set ITO Prices').should('be.visible');
    cy.contains('KApp Fee for Buy').should('be.visible');
    cy.contains('KApp Fee for Sell').should('be.visible');
    cy.contains('KApp Fee for Cancel Market Order').should('be.visible');
    cy.contains('KApp Fee for Marketplace Creation').should('be.visible');
    cy.contains('KApp Fee for Config Marketplace').should('be.visible');
    cy.contains('KApp Fee for Update Account Permission').should('be.visible');
    cy.contains('Max NFT Mint per batch').should('be.visible');
    cy.contains('Min KFI staked to enable Proposals Kapps').should('be.visible');
    cy.contains('Min KLV Bucket Amount').should('be.visible');
    cy.contains('Max bucket size').should('be.visible');
    cy.contains('Leader Validator rewards percentage').should('be.visible');
    cy.contains('Max Epochs for active proposal duration').should('be.visible');
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
  
  // it('Click on proposal tab and should redirect to account details when click on proposer address', () => {
  //   cy.get('.hzYRfy > span').click();
  //   cy.contains('Number').should('be.visible');
  //   cy.contains('Proposer').should('be.visible');
  //   cy.contains('Time').should('be.visible');
  //   cy.contains('Upvotes/Total Staked').should('be.visible');
  //   cy.contains('Status').should('be.visible');
  //   cy.contains('Network Parameters').should('be.visible');
  //   cy.get(':nth-child(1) > .styles__ProposerDescAndLink-sc-vdz05j-4 > a').click();
  //   cy.location().should(url => {
  //     const address = url.href.split('account/')[1];
  //     expect(url.href).include(`${BASE_URL}/account/`);
  //     expect(address).to.have.length(62);
  //   });
  // });
  
  // it('Click on "Details" and should redirect to proposal details', () => {
  //   cy.get('.hzYRfy > span').click();
  //   cy.get(':nth-child(1) > :nth-child(7) > a').click();
  //   cy.contains('Proposal Details').should('be.visible');
  //   cy.contains('Proposer').should('be.visible');
  //   cy.contains('Hash').should('be.visible');
  //   cy.contains('Created Epoch').should('be.visible');
  //   cy.contains('Ended Epoch').should('be.visible');
  //   cy.contains('Network Parameters').should('be.visible');
  //   cy.contains('Votes').should('be.visible');
  //   cy.contains('Total Voted').should('be.visible');
  //   cy.contains('Pass threshold').should('be.visible');
  //   cy.get('.leJrZX').contains('Yes').should('be.visible');
  //   cy.get('.fITLPE').contains('No').should('be.visible');
  //   cy.contains('Voters').should('be.visible');
  //   cy.contains('Voter').should('be.visible');
  //   cy.contains('Voting Power').should('be.visible');
  //   cy.contains('Vote date').should('be.visible');
  // });
  
  // it('Proposal Details: Click on Proposer address and redirect to account details', () => {
  //   cy.get('.hzYRfy > span').click();
  //   cy.get(':nth-child(1) > :nth-child(7) > a').click();
  //   cy.get('.detail__CardContent-sc-eqbw6p-20 > :nth-child(2) > :nth-child(1)').next().click();
  //   cy.location().should(url => {
  //     const address = url.href.split('account/')[1];
  //     expect(url.href).include(`${BASE_URL}/account/`);
  //     expect(address).to.have.length(62);
  //   });
  // });
  
  // it('Proposal Details: Click on Hash and redirect to transaction details', () => {
  //   cy.get('.hzYRfy > span').click();
  //   cy.get(':nth-child(1) > :nth-child(7) > a').click();
  //   cy.get(':nth-child(3) > .detail__HoverLink-sc-eqbw6p-27').click();
  //   cy.location().should(url => {
  //     const txHash = url.href.split('transaction/')[1];
  //     expect(url.href).include(`${BASE_URL}/transaction/`);
  //     expect(txHash).to.have.length(64);
  //   });
  // });
  
  // it('Proposal Details: Click on voter address and redirect to account details', () => {
  //   cy.get('.hzYRfy > span').click();
  //   cy.get(':nth-child(1) > :nth-child(7) > a').click();
  //   cy.get('.detail__HoverLink-sc-eqbw6p-27 > small').click();
  //   cy.location().should(url => {
  //     const address = url.href.split('account/')[1];
  //     expect(url.href).include(`${BASE_URL}/account/`);
  //     expect(address).to.have.length(62);
  //   });
  // });
  
});
export {}; // stop ts error "isolatedModules"