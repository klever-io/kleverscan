import type { ExplorerLinkType } from '@/components/ExplorerLink';

/**
 * What the hover menu offers depends on what the link points at. The menu
 * used to be identical for everything: hovering a transaction hash or a block
 * number offered "Copy Address", a QR code of a value that is not an address,
 * and a Transfer form prefilled with that value as the receiver.
 *
 * "Address-like" means the value is a wallet-format address someone could
 * actually send funds to or scan: an account, a smart contract, or a
 * validator link (which carries the owner's wallet address). Only those get
 * the QR code and the Transfer entry.
 */

/**
 * The same set ExplorerLink routes by, not a copy of it: a copy drifts, and
 * only one direction of the drift would fail to compile. `import type` is
 * erased, so this does not create a runtime cycle.
 */
export type LinkEntity = ExplorerLinkType;

export interface ILinkMenuConfig {
  /**
   * How to say the thing in a sentence, for screen readers. The union members
   * are identifiers ("smart-contract"), and reading one out as prose gives
   * "Open smart-contract in a new tab".
   */
  noun: string;
  /** Menu item text for the copy action. */
  copyLabel: string;
  /** Subject in the "… copied to clipboard" toast. */
  copyInfo: string;
  /** Whether the value is a wallet-format address (QR and Transfer apply). */
  addressLike: boolean;
}

export const MENU_BY_ENTITY: Record<LinkEntity, ILinkMenuConfig> = {
  account: {
    noun: 'account',
    copyLabel: 'Copy Address',
    copyInfo: 'Wallet Address',
    addressLike: true,
  },
  'smart-contract': {
    noun: 'smart contract',
    copyLabel: 'Copy Contract Address',
    copyInfo: 'Contract Address',
    addressLike: true,
  },
  validator: {
    noun: 'validator',
    // Qualified like the contract entry, and matching the wording the
    // validators page already uses. These links render a validator's name,
    // so the label is the only signal about what lands on the clipboard.
    copyLabel: 'Copy Validator Address',
    copyInfo: 'Validator Address',
    addressLike: true,
  },
  transaction: {
    noun: 'transaction',
    // Named in full: the block page has its own field labelled "Hash", and
    // renders this table underneath it.
    copyLabel: 'Copy Transaction Hash',
    copyInfo: 'Transaction Hash',
    addressLike: false,
  },
  block: {
    noun: 'block',
    copyLabel: 'Copy Block Number',
    copyInfo: 'Block Number',
    addressLike: false,
  },
  asset: {
    noun: 'asset',
    copyLabel: 'Copy Asset ID',
    copyInfo: 'Asset ID',
    addressLike: false,
  },
  proposal: {
    noun: 'proposal',
    copyLabel: 'Copy Proposal ID',
    copyInfo: 'Proposal ID',
    addressLike: false,
  },
};

export const menuForEntity = (entity: LinkEntity): ILinkMenuConfig =>
  MENU_BY_ENTITY[entity];
