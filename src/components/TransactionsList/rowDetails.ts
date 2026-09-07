import {
  Contract,
  EnumClaimType,
  EnumMarketType,
  IAssetTriggerContract,
  IBuyContractPayload,
  IClaimContract,
  IContract,
  IDelegateContract,
  IDepositContract,
  ISellContract,
  ISmartContract,
  ITransferContract,
  IWithdrawContract,
} from '@/types/contracts';
import { IReceipt } from '@/types';
import { ITransferReceipt } from '@/types/receipts';
import { hexToString } from '@/utils/convertString';

/**
 * What the single-line row derives from the raw contract parameter: the
 * counterparty for the To column, a short type refinement for a second
 * badge, and the tooltip lines behind the contract mark. Read from the
 * parameter itself rather than from `filteredSections`, whose output is
 * React elements and therefore useless inside a string tooltip.
 */

export interface ITransactionTarget {
  address: string;
  /** Renders with the contract mark and routes to /smart-contract. */
  isContract?: boolean;
}

export interface ITransactionRowDetails {
  target?: ITransactionTarget;
  typeDetail?: string;
  contractTooltip?: string;
}

/**
 * The receipt that records value changing hands between two accounts. Others
 * carry value too (a kApp transfer is type 14), so this is the plain move,
 * not "the only receipt with an amount".
 */
export const TRANSFER_RECEIPT_TYPE = 0;

/**
 * Narrows a receipt to the one shape that names both sides. The repo's
 * `IReceipt` is a union whose other members have no `from`, so a caller
 * cannot read one without asking which kind it is first.
 */
export const isTransferReceipt = (
  receipt: IReceipt,
): receipt is ITransferReceipt => receipt?.type === TRANSFER_RECEIPT_TYPE;

export interface IRowDetailsInput {
  contract: IContract[] | undefined;
  contractType: string;
  data?: string[];
  sender?: string;
  receipts?: IReceipt[];
}

interface IBuilderContext {
  data?: string[];
  /**
   * Where a claim or withdrawal pays out: the transfer receipt names the
   * receiving address, and on chain that is the claimer (verified live on
   * an AllowanceClaim: receipt.to equals the sender).
   */
  paidTo?: string;
}

type DetailBuilder = (
  parameter: NonNullable<IContract['parameter']>,
  context: IBuilderContext,
) => ITransactionRowDetails;

/**
 * Enum compounds read as one shouted word in a 0.625rem uppercase badge
 * ("STAKINGCLAIM"); spacing the camel case out gives "STAKING CLAIM".
 */
const spaceOutCamelCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

/** A badge-ready type refinement; API payloads carry names or numbers. */
const detailText = (
  value: string | number | undefined,
  lookup?: Record<number, string>,
): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const name =
    typeof value === 'number' ? (lookup?.[value] ?? String(value)) : value;
  return spaceOutCamelCase(String(name));
};

const addressTarget = (address?: string): ITransactionRowDetails =>
  address ? { target: { address } } : {};

/**
 * The invoked function comes out of the transaction's own data field, which
 * the sender fills in and which does not have to name a real function. The
 * tooltip renders one line per newline, so an unfiltered value could append
 * lines of its own below the app's, in the app's own styling. Splitting on
 * `@` bounds nothing when the payload simply omits it.
 */
const FUNCTION_NAME_LIMIT = 40;

const readFunctionName = (data?: string[]): string =>
  hexToString(data?.[0] || '')
    .split('@')[0]
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .slice(0, FUNCTION_NAME_LIMIT);

const smartContractDetails: DetailBuilder = (parameter, { data }) => {
  const par = parameter as unknown as ISmartContract;
  if (!par.address) return {};
  // The cast is a claim about the payload, not a check on it: the node fills
  // this field, so a non-string type would take .slice down with the whole row.
  const call = typeof par.type === 'string' ? par.type.slice(2) : '';
  const calledFunction = call === 'Invoke' ? readFunctionName(data) : '';
  return {
    target: { address: par.address, isContract: true },
    typeDetail: call && call !== 'Invoke' ? call : undefined,
    contractTooltip: [
      'Contract',
      calledFunction && `Function: ${calledFunction}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
};

const DETAIL_BUILDERS: Partial<Record<string, DetailBuilder>> = {
  [Contract.Transfer]: parameter =>
    addressTarget((parameter as ITransferContract).toAddress),
  [Contract.SmartContract]: smartContractDetails,
  [Contract.Delegate]: parameter =>
    addressTarget((parameter as IDelegateContract).toAddress),
  [Contract.Claim]: (parameter, { paidTo }) => ({
    ...addressTarget(paidTo),
    typeDetail: detailText(
      (parameter as IClaimContract).claimType,
      EnumClaimType as unknown as Record<number, string>,
    ),
  }),
  [Contract.AssetTrigger]: parameter => {
    const par = parameter as unknown as IAssetTriggerContract;
    return {
      ...addressTarget(par.toAddress),
      typeDetail: detailText(par.triggerType),
    };
  },
  [Contract.Withdraw]: (parameter, { paidTo }) => ({
    ...addressTarget(paidTo),
    typeDetail: detailText(
      (parameter as unknown as IWithdrawContract).withdrawTypeString,
    ),
  }),
  [Contract.Buy]: parameter => ({
    typeDetail: detailText(
      (parameter as unknown as IBuyContractPayload).buyType,
    ),
  }),
  [Contract.Sell]: parameter => ({
    typeDetail: detailText(
      (parameter as unknown as ISellContract).marketType,
      EnumMarketType as unknown as Record<number, string>,
    ),
  }),
  [Contract.Deposit]: parameter => ({
    typeDetail: detailText(
      (parameter as unknown as IDepositContract).depositTypeString,
    ),
  }),
  [Contract.ITOTrigger]: parameter => ({
    typeDetail: detailText(
      (parameter as unknown as { triggerType?: string | number }).triggerType,
    ),
  }),
};

export const getTransactionRowDetails = ({
  contract,
  contractType,
  data,
  sender,
  receipts,
}: IRowDetailsInput): ITransactionRowDetails => {
  const parameter = contract?.[0]?.parameter;
  if (!parameter || (contract?.length ?? 0) > 1) return {};

  const paidTo = receipts?.find(isTransferReceipt)?.to ?? sender;

  return DETAIL_BUILDERS[contractType]?.(parameter, { data, paidTo }) ?? {};
};

/**
 * The two contract types that exist to pay their own submitter. Everything
 * else an account submits is an outgoing act, whatever else rides along.
 */
const PAYS_ITS_SENDER = new Set<string>([Contract.Claim, Contract.Withdraw]);

/**
 * Which way value moved for one account, or undefined when the transaction
 * says nothing about it.
 *
 * An account that submitted a transaction made an outgoing move, and the two
 * payout types above are the exceptions. Reading the transfer receipts
 * instead looks more precise and is a trap: the staking contracts pay out
 * accrued rewards in the same transaction, so a freeze carries a receipt
 * paying its own sender. Measured against mainnet, 30 of 40 freezes, 16 of 40
 * unfreezes and 10 of 40 delegations would have been labelled incoming on the
 * account that submitted them.
 *
 * For a transaction the account did not submit, only a transfer receipt
 * naming it says anything, and where none does the honest answer is nothing:
 * a validator's own page lists the delegations pointed at it, and none of
 * them moves value into it.
 */
export const valueDirection = ({
  account,
  sender,
  contractType,
  receipts,
}: {
  account?: string;
  sender?: string;
  contractType?: string;
  receipts?: IReceipt[];
}): 'In' | 'Out' | undefined => {
  if (!account) return undefined;

  if (account === sender) {
    return PAYS_ITS_SENDER.has(contractType ?? '') ? 'In' : 'Out';
  }

  let sent = false;
  let received = false;

  for (const receipt of receipts ?? []) {
    if (!isTransferReceipt(receipt)) continue;
    if (receipt.from === account) sent = true;
    if (receipt.to === account) received = true;
  }

  if (received) return 'In';
  if (sent) return 'Out';
  return undefined;
};
