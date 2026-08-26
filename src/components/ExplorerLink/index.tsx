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
  label?: string;
  /** Use in table row sections — hides icons inside a hover dropdown */
  compact?: boolean;
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
}) => {
  if (!value) {
    return <span>{label || '--'}</span>;
  }

  const href = `${routes[type]}/${value}`;
  const displayText = label || value;
  const text = monoTypes.includes(type) ? (
    <Mono>{displayText}</Mono>
  ) : (
    displayText
  );

  if (compact) {
    return (
      <LinkWithDropdown link={href} address={value || ''} entity={type}>
        <Link href={href}>{text}</Link>
      </LinkWithDropdown>
    );
  }
  return (
    <CenteredRow>
      <Link href={href}>{text}</Link>
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
