import { Contract } from '../../types/contracts';
import { ITransaction } from '../../types';
import {
  getHeaderForCSV,
  getDefaultCells,
  getContractCells,
} from '../contracts';

jest.mock('../precisionFunctions', () => ({
  getPrecision: jest.fn().mockResolvedValue(6),
}));

jest.mock('../receiptsFunctions', () => ({
  getAmountFromReceipts: jest.fn().mockResolvedValue(100.5),
}));

const mockRouter = (type?: string) => ({ query: type ? { type } : {} }) as any;

const makeTx = (
  overrides: Partial<ITransaction> & { contract: ITransaction['contract'] },
): ITransaction => ({
  hash: 'abc123',
  blockNum: 1000,
  sender: 'klv1sender',
  nonce: 1,
  timestamp: 1700000000,
  chainID: '100420',
  signature: 'sig',
  searchOrder: 0,
  kAppFee: 1000000,
  bandwidthFee: 2000000,
  status: 'success',
  resultCode: 'Ok',
  receipts: [],
  ...overrides,
});

const makeContract = (
  typeString: Contract,
  type: number,
  parameter: any = {},
) => ({
  sender: 'klv1sender',
  type,
  typeString,
  parameter,
});

describe('getHeaderForCSV', () => {
  it('returns default headers without contract type filter', () => {
    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'Amount',
      'AssetId',
      'kApp Fee',
      'Bandwidth Fee',
    ];
    const result = getHeaderForCSV(mockRouter(), headers);
    expect(result).toEqual([
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'Amount',
      'AssetId',
      'kApp Fee',
      'Bandwidth Fee',
      'Multicontract',
      "Account's Transaction Number (Nonce)",
    ]);
  });

  it('returns Claim-specific headers when type=9', () => {
    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'kApp Fee',
      'Bandwidth Fee',
    ];
    const result = getHeaderForCSV(mockRouter('9'), headers);
    expect(result).toContain('Claim Type');
    expect(result).toContain('Asset Id');
    expect(result).toContain('Amount');
    expect(result).toContain('kApp Fee');
    expect(result).toContain('Bandwidth Fee');
    expect(result).not.toContain('Trigger Type');
  });

  it('returns Transfer-specific headers when type=0', () => {
    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'kApp Fee',
      'Bandwidth Fee',
    ];
    const result = getHeaderForCSV(mockRouter('0'), headers);
    expect(result).toContain('Asset Id');
    expect(result).toContain('Amount');
    expect(result).toContain('kApp Fee');
    expect(result).toContain('Bandwidth Fee');
  });

  it('returns Freeze-specific headers when type=4', () => {
    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'kApp Fee',
      'Bandwidth Fee',
    ];
    const result = getHeaderForCSV(mockRouter('4'), headers);
    expect(result).toContain('Asset Id');
    expect(result).toContain('Amount');
    expect(result).not.toContain('Claim Type');
  });

  it('header count matches cell count for contract-specific exports', () => {
    const baseHeaders = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'kApp Fee',
      'Bandwidth Fee',
    ];

    // Claim (type=9) should have 3 contract-specific + base headers
    const claimHeaders = getHeaderForCSV(mockRouter('9'), [...baseHeaders]);
    // base(8) + contract-specific(3) + fees(2) + multicontract(1) + nonce(1) = 15
    // minus the empty string = 14 after sanitization
    const contractSpecificCount = claimHeaders.filter(h => h !== '').length;
    expect(contractSpecificCount).toBe(14);
  });
});

describe('getDefaultCells', () => {
  it('produces correct cells for Transfer with assetId fallback to KLV', async () => {
    const tx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 5000000,
          toAddress: 'klv1receiver',
        }),
      ] as any,
    });

    const cells = await getDefaultCells(tx, false);

    // cells: hash, block, created, sender, to, status, contract, amount, assetId, kAppFee, bwFee, multicontract, nonce
    expect(cells[0]).toBe('abc123');
    expect(cells[1]).toBe(1000);
    expect(cells[3]).toBe('klv1sender');
    expect(cells[4]).toBe('klv1receiver');
    expect(cells[5]).toBe('success');
    expect(cells[8]).toBe('KLV'); // assetId should fallback to KLV
    expect(cells[11]).toBe(false); // isMulticontract
    expect(cells[12]).toBe(1); // nonce
  });

  it('uses provided assetId for Transfer when present', async () => {
    const tx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 5000000,
          assetId: 'USDT-AB12',
          toAddress: 'klv1receiver',
        }),
      ] as any,
    });

    const cells = await getDefaultCells(tx, false);
    expect(cells[8]).toBe('USDT-AB12');
  });

  it('includes parsed fees in cells', async () => {
    const tx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 1000000,
          toAddress: 'klv1receiver',
        }),
      ] as any,
    });

    const cells = await getDefaultCells(tx, false);
    // kAppFee = 1000000 / 10^6 = 1
    expect(cells[9]).toBe(1);
    // bandwidthFee = 2000000 / 10^6 = 2
    expect(cells[10]).toBe(2);
  });

  it('populates assetId from receipt for Claim', async () => {
    const claimReceipt = {
      cID: 0,
      amount: 100500000,
      assetId: 'KFI',
      assetIdReceived: 'KFI',
      claimType: 0,
      claimTypeString: 'StakingClaim',
      marketplaceId: '',
      orderId: '',
      type: 17,
      typeString: 'Claim',
    };

    const tx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
      receipts: [claimReceipt] as any,
    });

    const cells = await getDefaultCells(tx, false, 0);

    // assetId should come from the claim receipt
    expect(cells[8]).toBe('KFI');
  });

  it('returns empty assetId for Claim when no receipt found', async () => {
    const tx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
      receipts: [],
    });

    const cells = await getDefaultCells(tx, false, 0);
    expect(cells[8]).toBe('');
  });

  it('cell count is consistent across contract types', async () => {
    const transferTx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, { amount: 1000000 }),
      ] as any,
    });
    const claimTx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
    });

    const transferCells = await getDefaultCells(transferTx, false);
    const claimCells = await getDefaultCells(claimTx, false, 0);

    expect(transferCells.length).toBe(claimCells.length);
  });
});

describe('getContractCells', () => {
  it('includes fees for all contract types', async () => {
    const tx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 1000000,
          assetId: 'KLV',
          toAddress: 'klv1to',
        }),
      ] as any,
    });

    const cells = await getContractCells(tx, false, 0);

    // Last 4 cells: kAppFee, bwFee, multicontract, nonce
    const len = cells.length;
    expect(cells[len - 4]).toBe(1); // kAppFee parsed
    expect(cells[len - 3]).toBe(2); // bandwidthFee parsed
    expect(cells[len - 2]).toBe(false); // isMulticontract
    expect(cells[len - 1]).toBe(1); // nonce
  });

  it('includes fees for Claim contract', async () => {
    const claimReceipt = {
      cID: 0,
      amount: 100500000,
      assetId: 'KLV',
      assetIdReceived: 'KLV',
      claimType: 0,
      claimTypeString: 'StakingClaim',
      marketplaceId: '',
      orderId: '',
      type: 17,
      typeString: 'Claim',
    };

    const tx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
      receipts: [claimReceipt] as any,
    });

    const cells = await getContractCells(tx, false, 0);

    const len = cells.length;
    expect(cells[len - 4]).toBe(1); // kAppFee
    expect(cells[len - 3]).toBe(2); // bandwidthFee
  });

  it('includes fees for Unjail contract', async () => {
    const tx = makeTx({
      contract: [makeContract(Contract.Unjail, 10, {})] as any,
    });

    const cells = await getContractCells(tx, false, 0);

    const len = cells.length;
    expect(cells[len - 4]).toBe(1); // kAppFee
    expect(cells[len - 3]).toBe(2); // bandwidthFee
    expect(cells[len - 2]).toBe(false);
    expect(cells[len - 1]).toBe(1);
  });

  it('Claim cells contain claimType, assetId, and amount', async () => {
    const claimReceipt = {
      cID: 0,
      amount: 168334392,
      assetId: 'KFI',
      assetIdReceived: 'KFI',
      claimType: 0,
      claimTypeString: 'StakingClaim',
      marketplaceId: '',
      orderId: '',
      type: 17,
      typeString: 'Claim',
    };

    const tx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
      receipts: [claimReceipt] as any,
    });

    const cells = await getContractCells(tx, false, 0);

    // Base cells: hash, block, created, sender, to, status, contractName (7)
    // Then: claimType, assetId, amount (3)
    // Then: kAppFee, bwFee, multicontract, nonce (4)
    // claimType 0 is falsy so `parameter?.claimType || ''` yields ''
    expect(cells[7]).toBe(''); // claimType (0 falls through to '')
    expect(cells[8]).toBe('KFI'); // assetId from receipt
  });

  it('Transfer cells contain assetId and amount', async () => {
    const tx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 5000000,
          assetId: 'USDT-AB12',
          toAddress: 'klv1receiver',
        }),
      ] as any,
    });

    const cells = await getContractCells(tx, false, 0);

    // Base cells (7) + coin, amount (2) + fees(2) + multi(1) + nonce(1) = 13
    expect(cells[7]).toBe('USDT-AB12');
  });

  it('cell count is consistent between Claim and Transfer', async () => {
    const transferTx = makeTx({
      contract: [
        makeContract(Contract.Transfer, 0, {
          amount: 1000000,
          assetId: 'KLV',
          toAddress: '',
        }),
      ] as any,
    });

    const claimReceipt = {
      cID: 0,
      amount: 100000,
      assetId: 'KLV',
      assetIdReceived: 'KLV',
      claimType: 0,
      claimTypeString: 'StakingClaim',
      marketplaceId: '',
      orderId: '',
      type: 17,
      typeString: 'Claim',
    };

    const claimTx = makeTx({
      contract: [makeContract(Contract.Claim, 9, { claimType: 0 })] as any,
      receipts: [claimReceipt] as any,
    });

    const transferCells = await getContractCells(transferTx, false, 0);
    const claimCells = await getContractCells(claimTx, false, 0);

    // Transfer has 2 contract-specific columns (coin, amount)
    // Claim has 3 contract-specific columns (claimType, assetId, amount)
    // Different counts are expected, but both should end with fees+multi+nonce
    const tLen = transferCells.length;
    const cLen = claimCells.length;
    expect(transferCells[tLen - 2]).toBe(false);
    expect(transferCells[tLen - 1]).toBe(1);
    expect(claimCells[cLen - 2]).toBe(false);
    expect(claimCells[cLen - 1]).toBe(1);
  });
});

describe('header-data alignment', () => {
  const baseHeaders = [
    'Hash',
    'Block',
    'Created',
    'From',
    '',
    'To',
    'Status',
    'Contract',
    'kApp Fee',
    'Bandwidth Fee',
  ];

  const testCases: {
    name: string;
    type: string;
    contractType: Contract;
    contractNum: number;
    parameter: any;
    receipts?: any[];
  }[] = [
    {
      name: 'Transfer',
      type: '0',
      contractType: Contract.Transfer,
      contractNum: 0,
      parameter: { amount: 1000000, assetId: 'KLV', toAddress: '' },
    },
    {
      name: 'Freeze',
      type: '4',
      contractType: Contract.Freeze,
      contractNum: 4,
      parameter: { amount: 1000000, assetId: 'KLV' },
    },
    {
      name: 'Claim',
      type: '9',
      contractType: Contract.Claim,
      contractNum: 9,
      parameter: { claimType: 0 },
      receipts: [
        {
          cID: 0,
          amount: 100000,
          assetId: 'KLV',
          assetIdReceived: 'KLV',
          claimType: 0,
          claimTypeString: 'StakingClaim',
          marketplaceId: '',
          orderId: '',
          type: 17,
          typeString: 'Claim',
        },
      ],
    },
    {
      name: 'Unjail',
      type: '10',
      contractType: Contract.Unjail,
      contractNum: 10,
      parameter: {},
    },
    {
      name: 'Unfreeze',
      type: '5',
      contractType: Contract.Unfreeze,
      contractNum: 5,
      parameter: { bucketID: 'bucket1' },
    },
  ];

  it.each(testCases)(
    '$name: header count matches cell count (after sanitization)',
    async ({ type, contractType, contractNum, parameter, receipts }) => {
      const headers = getHeaderForCSV(mockRouter(type), [...baseHeaders]);
      const sanitizedHeaders = headers.filter((h: string) => h !== '');

      const tx = makeTx({
        contract: [makeContract(contractType, contractNum, parameter)] as any,
        receipts: (receipts ?? []) as any,
      });
      const cells = await getContractCells(tx, false, 0);

      expect(sanitizedHeaders.length).toBe(cells.length);
    },
  );
});
