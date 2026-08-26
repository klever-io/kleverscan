/// <reference types="cypress" />

/**
 * Transactions E2E:
 * - List/filter suite stubs list + precision APIs (deterministic, fast).
 * - Detail suite covers Transfer + Smart Contract via live list → visit.
 *   Detail pages use getServerSideProps (intercepts cannot stub Node SSR),
 *   so we only exercise two representative types instead of all 26.
 */

import { contracts } from '../../../src/configs/transactions';
import { Contract, ContractsIndex } from '../../../src/types/contracts';

const PAGE_TITLE_SELECTOR = 'h1';
/**
 * Reached by the filter's own identifier rather than by its position among its
 * siblings. The positional form broke on any wrapper element, on reordering,
 * and on the Buy Type filter appearing, and it would break again once the
 * titles are translated.
 */
const STATUS_FILTER_SELECTOR =
  '[data-testid="filter-status"] [data-testid="selector"]';
const TYPE_FILTER_SELECTOR =
  '[data-testid="filter-contract"] [data-testid="selector"]';
const TABLE_ROW_SELECTOR = '[data-testid^="table-row-"]';

/**
 * Cypress defaults to 1000px wide and the app switches to its tablet layout
 * below 1025, so without an explicit viewport the suite only ever exercises
 * the card DOM and never the column table. Both are covered.
 */
const TABLET_VIEWPORT: [number, number] = [1000, 660];
const DESKTOP_VIEWPORT: [number, number] = [1440, 900];

const ADDRESS =
  'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';

/** Representative types for live SSR detail coverage. */
const DETAIL_CONTRACTS = ['Transfer', 'Smart Contract'] as const;

/** Deterministic 64-char hex hash unique per contract type index. */
const hashForType = (typeIndex: number): string => {
  const prefix = typeIndex.toString(16).padStart(2, '0');
  return `${prefix}${'ab'.repeat(31)}`.slice(0, 64);
};

/**
 * Parameters real enough to reach the section builders, for the types whose
 * Amount column is asserted below.
 *
 * Every other type keeps the neutral placeholder in `txForType`: a real
 * typeString routes an empty parameter into the real builders, and not all of
 * those survive `{}`. The fields here are the ones their builder reads, in
 * the order it draws them, so the cells before the amount are filled and a
 * column that picked the wrong one would show a word instead of a figure.
 */
const REAL_CONTRACTS: Record<
  number,
  { typeString: string; parameter: Record<string, unknown> }
> = {
  [ContractsIndex.Transfer]: {
    typeString: Contract.Transfer,
    parameter: { amount: 1_000_000, assetId: 'KLV', toAddress: ADDRESS },
  },
  [ContractsIndex.Withdraw]: {
    typeString: Contract.Withdraw,
    // Its builder draws the withdraw type first and the amount second, so a
    // withdrawType other than 1 puts the word "Staking" in front of it.
    parameter: { withdrawType: 0, amount: 5_000_000, assetId: 'KLV' },
  },
  [ContractsIndex.Deposit]: {
    typeString: Contract.Deposit,
    // Two cells before the amount here: the deposit type, then the id.
    parameter: {
      depositTypeString: 'FPRDeposit',
      id: 'KLV',
      amount: 7_000_000,
      currencyID: 'KLV',
    },
  },
};

const txForType = (typeIndex: number) => {
  const real = REAL_CONTRACTS[typeIndex];
  return {
    hash: hashForType(typeIndex),
    blockNum: 1000 + typeIndex,
    sender: ADDRESS,
    nonce: typeIndex + 1,
    timestamp: 1_700_000_000 + typeIndex,
    kAppFee: 1,
    bandwidthFee: 250,
    status: 'success',
    resultCode: 'Ok',
    version: 1,
    chainID: '109',
    signature: ['00'],
    searchOrder: 0,
    receipts: [],
    contract: [
      {
        type: typeIndex,
        // Only the types in REAL_CONTRACTS carry their real typeString:
        // contractTypes derives the row's type from it, and a real typeString
        // routes the parameter into the real section builders. The rest keep
        // a neutral placeholder, whose empty parameter those builders would
        // not all survive.
        typeString: real?.typeString ?? 'Contract',
        parameter: real?.parameter ?? {},
      },
    ],
  };
};

const listResponse = (typeIndex: number) => ({
  data: {
    transactions: [txForType(typeIndex)],
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 10,
    totalPages: 1,
    totalRecords: 1,
  },
  error: '',
  code: 'successful',
});

const stubPrecisions = (): void => {
  cy.intercept('POST', '**/v1.0/assets/precisions*', {
    statusCode: 200,
    body: {
      data: { precisions: { KLV: 6 } },
      error: '',
      code: 'successful',
    },
  }).as('precisions');
};

/**
 * The summary card above the list. Its three requests all start with the
 * list route's path, so these must be registered AFTER the list stub:
 * Cypress matches the most recently registered interceptor, and while the
 * generic list stub answered them their responses landed in `@txList`, where
 * `cy.wait('@txList')` then read the summary's request instead of the
 * filtered one (its missing `type` param read as 0).
 */
const stubSummaryApis = (): void => {
  // The only list request carrying `minify`, which is what separates the
  // card's total from the table's own paged request.
  cy.intercept(
    {
      method: 'GET',
      url: '**/v1.0/transaction/list*',
      query: { minify: 'true' },
    },
    {
      statusCode: 200,
      body: {
        data: { transactions: [] },
        pagination: { totalRecords: 58_500_000 },
        error: '',
        code: 'successful',
      },
    },
  ).as('txTotal');

  // The card asks this route once for the window totals and once per
  // contract type for the composition bar.
  const countPerType: Record<string, number> = {
    '0': 5747, // Transfer
    '63': 1865, // Smart Contract
    '9': 592, // Claim
    '4': 228, // Freeze
  };

  cy.intercept('GET', '**/v1.0/transaction/list/count/*', req => {
    const type = new URL(req.url).searchParams.get('type');
    const buckets =
      type === null
        ? [
            { doc_count: 8447, key: 1787664055000 },
            { doc_count: 7124, key: 1787577655000 },
          ]
        : [{ doc_count: countPerType[type] ?? 0, key: 1787664055000 }];
    req.reply({
      statusCode: 200,
      body: { data: { number_by_day: buckets }, error: '', code: 'successful' },
    });
  }).as('txCount');

  cy.intercept('GET', '**/v1.0/transaction/statistics*', {
    statusCode: 200,
    body: {
      data: { most_transacted: [{ key: 'KLV', doc_count: 43_564_012 }] },
      error: '',
      code: 'successful',
    },
  }).as('txStatistics');
};

const stubTransactionListApis = (): void => {
  stubPrecisions();

  cy.intercept('GET', '**/v1.0/transaction/list*', req => {
    const url = new URL(req.url);
    const typeParam = url.searchParams.get('type');
    const typeIndex =
      typeParam === null || typeParam === '' ? 0 : Number(typeParam);
    const safeIndex = Number.isFinite(typeIndex) ? typeIndex : 0;
    req.reply({
      statusCode: 200,
      body: listResponse(safeIndex),
    });
  }).as('txList');

  // Last, so these win for their own URLs (see stubSummaryApis).
  stubSummaryApis();
};

/**
 * Apply Success + contract type filters. Consumes list intercepts so the final
 * wait is the type-filtered request (not the intermediate status-only one).
 * Requires `@txList` intercept from stubTransactionListApis.
 */
const applyStatusAndTypeFilters = (type: string, typeIndex: number): void => {
  cy.get(STATUS_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(STATUS_FILTER_SELECTOR)
    .contains('Success', { timeout: 10000 })
    .click();
  cy.url().should('include', 'status=Success');
  // Status-only refetch — drain so the next wait is the type-filtered call.
  cy.wait('@txList', { timeout: 15000 });

  cy.get(TYPE_FILTER_SELECTOR, { timeout: 10000 }).click();
  cy.get(TYPE_FILTER_SELECTOR).find('input').type(type, { delay: 0 });
  cy.get(TYPE_FILTER_SELECTOR).contains(type, { timeout: 10000 }).click();

  cy.url().should(currentUrl => {
    const url = new URL(currentUrl);
    expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
  });

  // Prove the list request itself carries both filter params (not only the URL).
  cy.wait('@txList', { timeout: 15000 })
    .its('request.url')
    .should(requestUrl => {
      const url = new URL(requestUrl);
      expect(url.searchParams.get('status')).to.eq('Success');
      expect(Number(url.searchParams.get('type'))).to.eq(typeIndex);
    });
};

/**
 * Visit SSR transaction detail with backoff. GSSP uses live api.get; persistent
 * 429 returns notFound (HTTP 404) which failOnStatusCode would fail immediately.
 */
const visitTransactionDetail = (hash: string, retriesLeft = 3): void => {
  cy.visit(`/transaction/${hash}`, {
    timeout: 60000,
    failOnStatusCode: false,
  });
  cy.get('body', { timeout: 15000 }).then($body => {
    const titleText = $body.find(PAGE_TITLE_SELECTOR).text();
    if (titleText.includes('Transaction Details')) {
      cy.get(PAGE_TITLE_SELECTOR)
        .contains('Transaction Details')
        .should('be.visible');
      return;
    }
    if (retriesLeft <= 0) {
      throw new Error(
        `Transaction detail page did not load for ${hash} after retries (likely API 429 / notFound)`,
      );
    }
    cy.wait(3000);
    visitTransactionDetail(hash, retriesLeft - 1);
  });
};

describe('Transactions Page', () => {
  beforeEach(() => {
    // Stated rather than inherited from the Cypress default, so the layout
    // these assertions describe cannot change by editing the config.
    cy.viewport(...TABLET_VIEWPORT);
    stubTransactionListApis();
    cy.visit('/transactions');
    cy.wait('@txList', { timeout: 15000 });
  });

  it('should load the transactions page', () => {
    cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
      .contains('Transactions')
      .should('be.visible');
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      1,
    );
  });

  Object.values(contracts).forEach(type => {
    if (typeof type !== 'string') return;

    it(`should filter transactions by type - ${type}`, () => {
      const typeIndex = ContractsIndex[type as keyof typeof ContractsIndex];
      const expectedHash = hashForType(typeIndex);

      cy.get(PAGE_TITLE_SELECTOR, { timeout: 10000 })
        .contains('Transactions')
        .should('be.visible');

      applyStatusAndTypeFilters(type, typeIndex);

      // Wait for the stubbed row for this type (handles multi-request races).
      cy.get(`a[href*="/transaction/${expectedHash}"]`, {
        timeout: 15000,
      }).should('be.visible');
      cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
        'have.length.at.least',
        1,
      );
    });
  });

  it('renders each row as one card: no header row, hash link, labeled facts', () => {
    // Below the tablet breakpoint the table renders as cards. Since the
    // restyle a row is ONE card element (not one testid per cell): the hash
    // links out on top and the other columns become labeled lines.
    cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 }).should(
      'have.length.at.least',
      1,
    );
    cy.get('[data-testid="table-header"]').should('not.exist');
    cy.get('[data-testid="table-row-0"]').within(() => {
      cy.get('[data-testid="transaction-link"]')
        .should('have.attr', 'href')
        .and('include', '/transaction/');
      ['Type', 'From', 'To', 'Block'].forEach(label => {
        cy.contains(label).should('be.visible');
      });
    });
  });
});

describe('Transactions Page (desktop)', () => {
  beforeEach(() => {
    cy.viewport(...DESKTOP_VIEWPORT);
    stubTransactionListApis();
    cy.visit('/transactions');
    cy.wait('@txList', { timeout: 15000 });
  });

  /**
   * The summary card is what the page adds above the table, and it must not
   * be able to take the table down with it: the figures and the contract
   * type breakdown are asserted together with the rows still being there.
   */
  it('shows the 24 hour figures and the contract type breakdown', () => {
    cy.wait('@txCount', { timeout: 15000 });

    cy.contains('Transactions (24h)').should('be.visible');
    // 8447 formatted (formatAmount truncates rather than rounds), and the
    // change against the previous window (7124).
    cy.contains('8.44 K').should('be.visible');
    cy.contains('+18.6%').should('be.visible');
    cy.contains('Total transactions').should('be.visible');
    cy.contains('Most transacted').should('be.visible');

    // The named types, their counts, and the remainder that closes the bar
    // (8447 minus 5747, 1865, 592 and 228). The bar itself carries the
    // description as its accessible name, like the assets registry strip.
    //
    // Scoped to the card, because the page around it is full of numbers and
    // type names: unscoped, "Transfer" also matches the badge on a row and
    // "15" matches a block number, an age or part of a longer figure, so the
    // assertions could pass with the legend missing entirely.
    cy.get('[aria-label="Transaction statistics"]').within(() => {
      cy.get('[aria-label="Contract types in the last 24 hours"]').should(
        'exist',
      );
      cy.contains('Transfer').should('be.visible');
      cy.contains('5.74 K').should('be.visible');
      cy.contains('Smart Contract').should('be.visible');
      cy.contains('Other').should('be.visible');
      // Anchored: the remainder is its own element, and a bare 15 would match
      // any figure that merely contains those two digits.
      cy.contains(/^15$/).should('be.visible');
    });

    cy.get(TABLE_ROW_SELECTOR).should('have.length.at.least', 1);
  });

  it('renders the column header row', () => {
    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .should('be.visible')
      .children()
      .should('have.length.at.least', 1);
  });

  /**
   * The header count and the per-row cell count are produced by two separate
   * code paths, so nothing stops them drifting apart. When they do, every
   * column past the divergence sits under the wrong heading.
   */
  it('gives each row exactly one cell per column heading', () => {
    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .children()
      .its('length')
      .then(headerCount => {
        expect(headerCount).to.be.greaterThan(0);
        cy.get('[data-testid="table-row-0"]').should(
          'have.length',
          headerCount,
        );
      });
  });

  /**
   * The shape the split actually broke. Without an account in the URL both
   * lists were five long, so an assertion on `/transactions` alone passes on
   * the bug too: this is the one that fails before the fix, where six cells
   * rendered under five headings.
   */
  it('keeps headings and cells aligned once the list is scoped to an account', () => {
    cy.visit(`/transactions?account=${ADDRESS}`);
    cy.wait('@txList', { timeout: 15000 });

    cy.get('[data-testid="table-header"]', { timeout: 15000 })
      .children()
      .then(headings => {
        expect(headings).to.have.length(10);
        expect(
          [...headings].map(cell => cell.textContent?.trim()),
        ).to.deep.equal([
          'Transaction Hash',
          'Type',
          'Block',
          'Age',
          'From',
          // The circled status arrow's column is deliberately unheaded.
          '',
          'To',
          'In/Out',
          'Amount',
          'Fee',
        ]);
        cy.get('[data-testid="table-row-0"]').should('have.length', 10);
      });
  });

  /**
   * Locks the namespace wiring. A t() whose namespace was never loaded does
   * not fall back to English, it renders its own key, and every other
   * assertion here would still pass on one: contains('Success') also matches
   * "transactions:Status.Success". Exact matches do not.
   */
  it('renders translated filter texts, never raw keys', () => {
    cy.get('[data-testid="filter-status"] > span')
      .first()
      .should('have.text', 'Status');
    cy.get('[data-testid="filter-contract"] > span')
      .first()
      .should('have.text', 'Contract');

    cy.get(STATUS_FILTER_SELECTOR).click();
    cy.get('[data-testid="filter-status"]').contains(/^Success$/);
    cy.get('body').should('not.contain.text', 'transactions:');
  });

  it('links the hash cell to the full transaction hash', () => {
    const expectedHash = hashForType(0);
    cy.get(`a[href*="/transaction/${expectedHash}"]`, {
      timeout: 15000,
    }).should('be.visible');
  });

  /**
   * The single-line density contract: a row is exactly 60px tall and the
   * row's key facts stay visible inside it: the hash link, the type badge
   * and the circled status arrow. Height alone would pass with clipped
   * content, and visible content alone would pass at any height, so the
   * assertions only hold together.
   */
  it('keeps the hash, type badge and status arrow inside the 60px row', () => {
    // The container, not a cell. That testid sits on all nine cells of the
    // row, and they only happen to be 60px because the grid stretches them;
    // a cell that stopped stretching would keep its own height and let a
    // taller row through the assertion that names the row.
    cy.get('[data-testid="table-row-0"]', { timeout: 15000 })
      .first()
      .parent()
      .should($row => {
        expect(Math.round($row.outerHeight() ?? 0), 'row height').to.eq(60);
      });
    const expectedHash = hashForType(0);
    cy.get(`a[href*="/transaction/${expectedHash}"]`).should('be.visible');
    // Scoped to the row. Unscoped, "Transfer" also names a segment of the
    // summary legend above the table, and cypress resolves matches in
    // document order, so the assertion was satisfied by the card while the
    // badge it is meant to guard could be clipped or missing.
    cy.get('[data-testid="table-row-0"]')
      .parent()
      .within(() => {
        cy.contains('Transfer').should('be.visible');
        // One status arrow per row; its status word sits in the tooltip and
        // in visually hidden text, so presence, not visibility.
        cy.contains('Success').should('exist');
      });
  });
});

/**
 * The Amount column resolves a position in `contractLabels` and uses it to
 * index the elements `filteredSections` built. The two live in different
 * files with nothing tying them together, so reordering either one puts a
 * neighbouring field in this column and nothing says so.
 *
 * Neither module can be reached by a unit test: both pull in the ESM
 * dependency the Jest transform does not cover. This is the only level the
 * coupling can be held at, and Transfer alone will not do it, because its
 * amount sits at index 0 where almost anything lands.
 */
describe('Transactions Page (desktop, amount column)', () => {
  /** Its place among the base columns: hash, type, block, age, from, arrow, to, amount, fee. */
  const AMOUNT_COLUMN_INDEX = 7;

  const CASES = [
    {
      label: 'a withdrawal, whose amount sits behind its type',
      typeIndex: ContractsIndex.Withdraw,
      // What the cell in front of the amount holds, and so what this column
      // would show if the position were off by one.
      neighbour: 'Staking',
    },
    {
      label: 'a deposit, whose amount sits behind its type and its id',
      typeIndex: ContractsIndex.Deposit,
      neighbour: 'FPR',
    },
  ];

  CASES.forEach(({ label, typeIndex, neighbour }) => {
    it(`shows a figure and not the field beside it for ${label}`, () => {
      cy.viewport(...DESKTOP_VIEWPORT);
      stubTransactionListApis();
      cy.visit(`/transactions?type=${typeIndex}`);
      cy.wait('@txList', { timeout: 15000 });

      cy.get(TABLE_ROW_SELECTOR, { timeout: 15000 })
        .eq(AMOUNT_COLUMN_INDEX)
        .should($cell => {
          const text = $cell.text();
          // A digit, so the empty cell an out-of-range position renders
          // ("- -") fails too, not only a neighbour landing here.
          expect(text, 'amount cell').to.match(/\d/);
          expect(text, 'amount cell').to.not.contain(neighbour);
        });
    });
  });
});

describe('Block Page i18n', () => {
  // getStaticProps runs against the live API (intercepts cannot stub Node),
  // like the detail suite below. One representative block is enough: the page
  // loaded no translation namespace at all before this branch, so its filter
  // bar rendered raw keys.
  const API_BASE =
    Cypress.env('DEFAULT_API_HOST') || 'https://api.testnet.klever.org';
  const API_VERSION = Cypress.env('DEFAULT_API_VERSION') || 'v1.0';

  /**
   * Bounded backoff against a shared, rate-limited API.
   *
   * This runs late in the last-but-one spec, by which point the suite has
   * spent its allowance: the spec passes on its own and fails inside a full
   * run, on an endpoint that answers every direct call. So the window is wide
   * rather than tight, and it retries on any answer without a usable number
   * rather than on 429 alone. The assertion still demands a real number.
   */
  const requestLatestBlockNum = (
    retriesLeft = 8,
  ): Cypress.Chainable<number> => {
    return cy
      .request({
        url: `${API_BASE}/${API_VERSION}/transaction/list`,
        // Filtered the way the detail suite below filters, on purpose. The
        // unfiltered list answered CI with an empty payload for a minute at a
        // time while the filtered one in the same run kept working, so this
        // asks the shape the environment can actually serve. Any real block
        // carrying a successful transfer satisfies what this test needs.
        qs: { type: 0, status: 'Success', limit: 1, page: 1 },
        failOnStatusCode: false,
        timeout: 20000,
      })
      .then(res => {
        const blockNum = res.body?.data?.transactions?.[0]?.blockNum;
        // Retry on anything that did not yield a usable number, not only on
        // 429: the list also answers 200 with an empty payload under load.
        // The assertion below still demands a real number; only the number of
        // attempts is relaxed.
        if (typeof blockNum !== 'number' && retriesLeft > 0) {
          cy.wait(5000);
          return requestLatestBlockNum(retriesLeft - 1);
        }
        expect(blockNum, 'blockNum from the live list').to.be.a('number');
        return cy.wrap(blockNum as number);
      });
  };

  /** Bounded revisit, like visitTransactionDetail: getStaticProps runs its
   * own lookup against the live API and answers notFound after its retries,
   * so with failOnStatusCode off a rate-limited build lands on the 404 page
   * and the filter assertion would only time out. */
  const visitBlockPage = (blockNum: number, retriesLeft = 3): void => {
    cy.visit(`/block/${blockNum}`, {
      timeout: 60000,
      failOnStatusCode: false,
    });
    cy.get('body', { timeout: 15000 }).then($body => {
      if ($body.find('[data-testid="filter-status"]').length) {
        return;
      }
      if (retriesLeft <= 0) {
        throw new Error(
          `Block page did not load for ${blockNum} after retries (likely API 429 / notFound)`,
        );
      }
      cy.wait(3000);
      visitBlockPage(blockNum, retriesLeft - 1);
    });
  };

  it('serves the transactions tab with translated filters', () => {
    requestLatestBlockNum().then(blockNum => {
      cy.viewport(...DESKTOP_VIEWPORT);
      visitBlockPage(blockNum);

      cy.get('[data-testid="filter-status"] > span', { timeout: 20000 })
        .first()
        .should('have.text', 'Status');
      cy.contains('Date Filter').should('be.visible');
      cy.get('body').should('not.contain.text', 'transactions:');
    });
  });
});

describe('Transaction Details Page', () => {
  // Detail pages use getServerSideProps against the live API (browser intercepts
  // cannot stub Node). Resolve a real hash via cy.request, then visit SSR page.
  const API_BASE =
    Cypress.env('DEFAULT_API_HOST') || 'https://api.testnet.klever.org';
  const API_VERSION = Cypress.env('DEFAULT_API_VERSION') || 'v1.0';

  const requestTxList = (
    typeIndex: number,
    retriesLeft = 5,
  ): Cypress.Chainable<Cypress.Response<any>> => {
    return cy
      .request({
        url: `${API_BASE}/${API_VERSION}/transaction/list`,
        qs: {
          type: typeIndex,
          status: 'Success',
          limit: 1,
          page: 1,
        },
        failOnStatusCode: false,
        timeout: 20000,
      })
      .then(res => {
        // Full suite can 429 the shared testnet API; back off and retry.
        if (res.status === 429 && retriesLeft > 0) {
          cy.wait(2500);
          return requestTxList(typeIndex, retriesLeft - 1);
        }
        return cy.wrap(res);
      });
  };

  DETAIL_CONTRACTS.forEach(type => {
    it(`should load the transaction details page - ${type}`, () => {
      const typeIndex = ContractsIndex[type as keyof typeof ContractsIndex];

      requestTxList(typeIndex).then(res => {
        expect(res.status, `${type} list HTTP status`).to.eq(200);
        const tx = res.body?.data?.transactions?.[0] as
          | {
              hash?: string;
              contract?: { type?: number }[];
            }
          | undefined;
        expect(
          tx?.contract?.[0]?.type,
          `${type} contract type from list`,
        ).to.eq(typeIndex);
        const hash = tx?.hash;
        expect(hash, `${type} transaction hash`)
          .to.be.a('string')
          .and.match(/^[a-f0-9]{64}$/i);

        visitTransactionDetail(hash as string);
      });
    });
  });
});
