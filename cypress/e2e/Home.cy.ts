it('Visit the homepage', () => {
  cy.viewport(1600, 1024);
  cy.visit('https://testnet.kleverscan.org/');
});

export {}; // stop ts error "isolatedModules"