import Copy from '@/components/Copy';
import LinkWithDropdown from '@/components/LinkWithDropdown';
import { menuForEntity } from '@/components/LinkWithDropdown/menu';
import { CenteredRow, Mono } from '@/styles/common';
import Link from 'next/link';
import React from 'react';
import { IoOpenOutline } from 'react-icons/io5';

export type ExplorerLinkType =
  | 'account'
  | 'smart-contract'
  | 'transaction'
  | 'asset'
  | 'block'
  | 'validator'
  | 'proposal';

const routes: Record<ExplorerLinkType, string> = {
  account: '/account',
  'smart-contract': '/smart-contract',
  transaction: '/transaction',
  asset: '/asset',
  block: '/block',
  validator: '/validator',
  proposal: '/proposal',
};

interface ExplorerLinkProps {
  type: ExplorerLinkType;
  value?: string;
  /** Plain text, or a node for a label that decides its own typography. */
  label?: React.ReactNode;
  /** Use in table row sections — hides icons inside a hover dropdown */
  compact?: boolean;
  /** Testid for the link itself, e.g. the smoke suite's transaction-link. */
  dataTestId?: string;
  /**
   * Overrides the monospace an address type gets by default. A label that
   * renders a name rather than a hash sets this, because a name belongs in
   * the page font.
   */
  mono?: boolean;
}

const monoTypes: ExplorerLinkType[] = [
  'account',
  'transaction',
  'smart-contract',
  'validator',
];

const ExplorerLink: React.FC<ExplorerLinkProps> = ({
  type,
  value,
  label,
  compact,
  dataTestId,
  mono,
}) => {
  if (!value) {
    return <span>{label || '--'}</span>;
  }

  const href = `${routes[type]}/${value}`;
  const displayText = label || value;
  const text =
    (mono ?? monoTypes.includes(type)) ? (
      <Mono>{displayText}</Mono>
    ) : (
      displayText
    );

  if (compact) {
    return (
      <LinkWithDropdown link={href} address={value || ''} entity={type}>
        <Link href={href} data-testid={dataTestId}>
          {text}
        </Link>
      </LinkWithDropdown>
    );
  }
  return (
    <CenteredRow>
      <Link href={href} data-testid={dataTestId}>
        {text}
      </Link>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${menuForEntity(type).noun} in a new tab`}
        title="Open in a new tab"
      >
        <IoOpenOutline size={20} />
      </a>
      {/* The same table the hover menu uses, so this path cannot say
          "account copied to clipboard" while the other says "Wallet Address". */}
      <Copy data={value} info={menuForEntity(type).copyInfo} />
    </CenteredRow>
  );
};

export default ExplorerLink;
