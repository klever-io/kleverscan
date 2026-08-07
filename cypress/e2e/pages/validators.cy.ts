/// <reference types="cypress" />

/**
 * Validators E2E stubs the live validator/list, heartbeat proxy, and detail
 * APIs so CI is not flaky under testnet rate limits while still exercising the
 * real list → detail UI flow.
 */

const validatorsAmount = 10;
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';
const TOTAL_STAKE_SELECTOR = '[data-testid="total-stake"]';

const successRate = (numSuccess: number, numFailure = 0) => ({
  numSuccess,
  numFailure,
});

/** 62-char bech32-shaped addresses unique per index. */
const ownerAddressFor = (index: number): string => {
  const n = String(index + 1).padStart(2, '0');
  // "klv1validator" (13) + 2 digits + 47 padding = 62
  return `klv1validator${n}${'q'.repeat(47)}`;
};

const blsKeyFor = (index: number): string =>
  `bls${String(index + 1).padStart(2, '0')}${'ab'.repeat(30)}`;

const rawValidators = Array.from({ length: validatorsAmount }, (_, index) => {
  const ownerAddress = ownerAddressFor(index);
  return {
    totalStake: 1_000_000_000_000 * (validatorsAmount - index),
    ownerAddress,
    name: `E2E Validator ${index + 1}`,
    totalLeaderSuccessRate: successRate(10 + index),
    totalValidatorSuccessRate: successRate(100 + index, 1),
    rating: 5_000_000,
    selfStake: 100_000_000,
    list: 'elected',
    canDelegate: true,
    maxDelegation: 0,
    commission: 500,
    blsPublicKey: blsKeyFor(index),
  };
});

const networkTotalStake = rawValidators.reduce((s, v) => s + v.totalStake, 0);

const listResponse = {
  data: {
    validators: rawValidators,
    networkTotalStake,
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 100,
    totalPages: 1,
    totalRecords: validatorsAmount,
  },
  error: '',
  code: 'successful',
};

const heartbeatResponse = {
  data: {
    heartbeats: rawValidators.map((v, index) => ({
      publicKey: v.blsPublicKey,
      versionNumber: index < 7 ? 'v1.7.20' : 'v1.6.0',
      isActive: true,
      timestamp: '2026-08-06T00:00:00Z',
    })),
  },
};

const detailResponseFor = (index: number) => {
  const raw = rawValidators[index];
  return {
    data: {
      validator: {
        blsPublicKey: raw.blsPublicKey,
        ownerAddress: raw.ownerAddress,
        rewardAddress: raw.ownerAddress,
        canDelegate: raw.canDelegate,
        commission: raw.commission,
        maxDelegation: raw.maxDelegation,
        rating: raw.rating,
        list: raw.list,
        totalStake: raw.totalStake,
        selfStake: raw.selfStake,
        logo: '',
        name: raw.name,
        totalLeaderSuccessRate: raw.totalLeaderSuccessRate,
        totalValidatorSuccessRate: raw.totalValidatorSuccessRate,
        uris: [],
      },
    },
    error: '',
    code: 'successful',
  };
};

const stubValidatorsApis = (): void => {
  // Scope to API version path only — bare **/validator/** also matches
  // Next.js page navigations to /validator/<address> and breaks cy.visit.
  cy.intercept('GET', '**/v1.0/validator/list*', {
    statusCode: 200,
    body: listResponse,
  }).as('validatorList');

  // Version distribution uses the same-origin heartbeat proxy.
  cy.intercept('GET', '**/api/heartbeat', {
    statusCode: 200,
    body: heartbeatResponse,
  }).as('heartbeat');

  // Detail API: /v1.0/validator/<ownerAddress>
  rawValidators.forEach((v, index) => {
    cy.intercept('GET', `**/v1.0/validator/${v.ownerAddress}*`, {
      statusCode: 200,
      body: detailResponseFor(index),
    }).as(`validatorDetail${index}`);
  });

  // Delegators table on detail (empty is fine).
  cy.intercept('GET', '**/v1.0/validator/delegated/**', {
    statusCode: 200,
    body: {
      data: { validators: [] },
      pagination: {
        self: 1,
        next: 1,
        previous: 1,
        perPage: 10,
        totalPages: 1,
        totalRecords: 0,
      },
      error: '',
      code: 'successful',
    },
  }).as('validatorDelegated');
};

const toVisitPath = (href: string): string =>
  href.startsWith('/') ? href : `/${href}`;

describe('Validators Page', () => {
  beforeEach(() => {
    stubValidatorsApis();
    cy.visit('/validators');
  });

  it('should load the validators page', () => {
    cy.get('h1').contains('Validators').should('be.visible');
  });

  it('should list stubbed validators and expose detail links', () => {
    cy.wait('@validatorList', { timeout: 15000 });
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      validatorsAmount,
    );

    cy.get('[data-testid="validator-link"]')
      .should('have.length.at.least', validatorsAmount)
      .then($links => {
        const hrefs = Array.from($links)
          .slice(0, validatorsAmount)
          .map(el => toVisitPath(el.getAttribute('href') || ''));
        expect(hrefs.every(Boolean)).to.eq(true);
        Cypress.env('validatorLinks', hrefs);
      });
  });
});

describe('Validator Details Page', () => {
  beforeEach(() => {
    stubValidatorsApis();
  });

  Array.from({ length: validatorsAmount }).forEach((_, index) => {
    it(`should load the validator page #${index + 1}`, () => {
      const links =
        (Cypress.env('validatorLinks') as string[] | undefined) || [];
      const link = links[index] || `/validator/${ownerAddressFor(index)}`;

      cy.visit(link);
      cy.wait(`@validatorDetail${index}`, { timeout: 15000 });
      cy.get(TOTAL_STAKE_SELECTOR, { timeout: 15000 }).should('be.visible');
    });
  });
});
