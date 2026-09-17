import { IReceipt } from '@/types';
import { IContract } from '@/types/contracts';
import { getTransactionRowDetails, valueDirection } from '../rowDetails';

const one = (type: string, parameter: unknown): IContract[] =>
  [{ typeString: type, parameter }] as unknown as IContract[];

const SENDER = 'klv1sender';

describe('getTransactionRowDetails', () => {
  it('gives a Transfer its receiver as the target', () => {
    const details = getTransactionRowDetails({
      contract: one('TransferContractType', { toAddress: 'klv1to' }),
      contractType: 'TransferContractType',
    });
    expect(details.target).toEqual({ address: 'klv1to' });
    expect(details.typeDetail).toBeUndefined();
  });

  it('marks a smart contract invoke with its address and function tooltip', () => {
    // "swap" in hex; the function name rides in the transaction data.
    const details = getTransactionRowDetails({
      contract: one('SmartContractType', {
        type: 'SCInvoke',
        address: 'klv1contract',
      }),
      contractType: 'SmartContractType',
      data: ['73776170'],
    });
    expect(details.target).toEqual({
      address: 'klv1contract',
      isContract: true,
    });
    expect(details.contractTooltip).toBe('Contract\nFunction: swap');
  });

  it('still renders a contract row when the node sends a type that is not a string', () => {
    const details = getTransactionRowDetails({
      contract: one('SmartContractType', {
        type: 0,
        address: 'klv1contract',
      }),
      contractType: 'SmartContractType',
    });
    expect(details.target).toEqual({
      address: 'klv1contract',
      isContract: true,
    });
    expect(details.typeDetail).toBeUndefined();
  });

  it('pays a claim out to the transfer receipt address, with the claim type as detail', () => {
    const details = getTransactionRowDetails({
      contract: one('ClaimContractType', { claimType: 'StakingClaim' }),
      contractType: 'ClaimContractType',
      sender: SENDER,
      receipts: [{ type: 0, to: 'klv1paid' }],
    });
    expect(details.target).toEqual({ address: 'klv1paid' });
    // Spaced out for the badge: STAKINGCLAIM reads as one shouted word.
    expect(details.typeDetail).toBe('Staking Claim');
  });

  it('falls back to the sender when a claim carries no transfer receipt', () => {
    const details = getTransactionRowDetails({
      contract: one('ClaimContractType', { claimType: 1 }),
      contractType: 'ClaimContractType',
      sender: SENDER,
      receipts: [],
    });
    expect(details.target).toEqual({ address: SENDER });
    // Numeric enum value resolves back to its name, spaced out.
    expect(details.typeDetail).toBe('Allowance Claim');
  });

  it('resolves a numeric market type on a sell order', () => {
    const details = getTransactionRowDetails({
      contract: one('SellContractType', { marketType: 0 }),
      contractType: 'SellContractType',
    });
    expect(details.typeDetail).toBe('Buy It Now Market');
  });

  it('gives a delegation its validator as the target', () => {
    const details = getTransactionRowDetails({
      contract: one('DelegateContractType', { toAddress: 'klv1validator' }),
      contractType: 'DelegateContractType',
    });
    expect(details.target).toEqual({ address: 'klv1validator' });
  });

  it('stays empty for a multi-contract transaction', () => {
    const contracts = [
      ...one('TransferContractType', { toAddress: 'klv1to' }),
      ...one('FreezeContractType', {}),
    ];
    expect(
      getTransactionRowDetails({
        contract: contracts,
        contractType: 'Multi contract',
      }),
    ).toEqual({});
  });

  it('stays empty when the parameter is missing entirely', () => {
    expect(
      getTransactionRowDetails({
        contract: [{ typeString: 'TransferContractType' }] as IContract[],
        contractType: 'TransferContractType',
      }),
    ).toEqual({});
  });
});

describe('valueDirection', () => {
  const ACCOUNT = 'klv1account';
  const OTHER = 'klv1other';
  const CONTRACT = 'klv1contract';

  const transferReceipt = (from: string, to: string) =>
    ({ type: 0, from, to }) as unknown as IReceipt;

  describe('a transaction the account submitted', () => {
    it('is outgoing for a transfer it sent', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: ACCOUNT,
          contractType: 'TransferContractType',
          receipts: [transferReceipt(ACCOUNT, OTHER)],
        }),
      ).toBe('Out');
    });

    it('is outgoing for a freeze, whatever rewards ride along', () => {
      // The staking contracts pay out accrued rewards in the same
      // transaction, so a freeze carries a transfer receipt paying its own
      // sender. Reading the receipts first called this incoming: measured
      // against mainnet, on 30 of 40 freezes, 16 of 40 unfreezes and 10 of 40
      // delegations.
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: ACCOUNT,
          contractType: 'FreezeContractType',
          receipts: [transferReceipt('klv1staking', ACCOUNT)],
        }),
      ).toBe('Out');
    });

    it('is outgoing for a contract call that swaps both ways', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: ACCOUNT,
          contractType: 'SmartContractType',
          receipts: [
            transferReceipt(ACCOUNT, CONTRACT),
            transferReceipt(CONTRACT, ACCOUNT),
          ],
        }),
      ).toBe('Out');
    });

    it('is incoming for a claim, which exists to pay its sender', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: ACCOUNT,
          contractType: 'ClaimContractType',
          receipts: [transferReceipt('klv1staking', ACCOUNT)],
        }),
      ).toBe('In');
    });

    it('is incoming for a withdrawal, on the same reasoning', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: ACCOUNT,
          contractType: 'WithdrawContractType',
          receipts: [],
        }),
      ).toBe('In');
    });
  });

  describe('a transaction somebody else submitted', () => {
    it('is incoming when a transfer receipt pays this account', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: OTHER,
          contractType: 'TransferContractType',
          receipts: [transferReceipt(OTHER, ACCOUNT)],
        }),
      ).toBe('In');
    });

    it('is outgoing when a transfer receipt takes from this account', () => {
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: OTHER,
          contractType: 'SmartContractType',
          receipts: [transferReceipt(ACCOUNT, OTHER)],
        }),
      ).toBe('Out');
    });

    it('answers nothing when no transfer receipt names this account', () => {
      // A validator's own page lists the delegations aimed at it, and none of
      // them moves value into it. Saying "In" there would be an invention.
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: OTHER,
          contractType: 'DelegateContractType',
          receipts: [{ type: 7, from: OTHER } as unknown as IReceipt],
        }),
      ).toBeUndefined();
    });

    it('answers nothing for a send that failed and moved nothing', () => {
      // A failed transfer carries no transfer receipt. A green In beside an
      // amount that never arrived is the shape of a fake deposit.
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: OTHER,
          contractType: 'TransferContractType',
          receipts: [{ type: 19 } as unknown as IReceipt],
        }),
      ).toBeUndefined();
    });

    it('reads only the transfer receipt, not any receipt with a from', () => {
      // Kills a mutant that drops the receipt-type guard: type 4 is a freeze
      // bucket record, not value leaving the account.
      expect(
        valueDirection({
          account: ACCOUNT,
          sender: OTHER,
          contractType: 'FreezeContractType',
          receipts: [{ type: 4, from: ACCOUNT } as unknown as IReceipt],
        }),
      ).toBeUndefined();
    });
  });

  it('answers nothing without an account to answer about', () => {
    expect(
      valueDirection({ sender: ACCOUNT, contractType: 'TransferContractType' }),
    ).toBeUndefined();
  });
});
