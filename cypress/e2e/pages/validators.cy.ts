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

/** Mixed states and one capped validator, so the composition bar, the status
 *  badges and the capacity cell all exercise more than one branch. */
const listStateFor = (index: number): string => {
  if (index === 8) return 'eligible';
  if (index === 9) return 'jailed';
  return 'elected';
};

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
    list: listStateFor(index),
    canDelegate: index !== 9,
    maxDelegation: index === 0 ? 4_000_000_000_000 : 0,
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

/* Cypress defaults to a 1000px viewport, below the 1240 the row layout needs,
   so everything above runs against the card layout. This block is the only
   coverage the column table, the summary tiles and the version filter have. */
describe('Validators Page at row-layout width', () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
    stubValidatorsApis();
    cy.visit('/validators');
    cy.wait('@validatorList', { timeout: 15000 });
    cy.wait('@heartbeat', { timeout: 15000 });
  });

  it('renders the column table instead of cards', () => {
    cy.get('[data-testid="table-header"]', { timeout: 15000 }).should(
      'be.visible',
    );
    cy.get('[data-testid="table-header"]').contains('Capacity');
    // On the row layout every cell carries its row's testid, so row presence
    // is asserted by index rather than by element count.
    cy.get(`[data-testid="table-row-${validatorsAmount - 1}"]`).should('exist');
  });

  it('fills the summary tiles from the stubbed list', () => {
    // 8 of the 10 stubs are elected; the legend derives from the same list.
    cy.contains('[aria-label="Validator network statistics"]', '8 elected', {
      timeout: 15000,
    }).should('be.visible');
    cy.contains('Jailed 1').should('be.visible');
  });

  it('narrows the table through the version filter and clears it again', () => {
    // 3 stubs run v1.6.0; the rest v1.7.20.
    cy.get('[data-testid="filter-validator-version"]')
      .find('[data-testid="selector"]')
      .click();
    cy.get('[data-testid="selector-item"]').contains('v1.6.0').click();
    cy.location('search', { timeout: 15000 }).should(
      'include',
      'version=v1.6.0',
    );
    // 3 stubs run v1.6.0: rows 0..2 and nothing further.
    cy.get('[data-testid="table-row-2"]', { timeout: 15000 }).should('exist');
    cy.get('[data-testid="table-row-3"]').should('not.exist');

    cy.get('[aria-label="Clear Version filter"]').click();
    cy.location('search').should('not.include', 'version');
    cy.get(`[data-testid="table-row-${validatorsAmount - 1}"]`, {
      timeout: 15000,
    }).should('exist');
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
