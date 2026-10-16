import CopyAction from '@/components/DataList/CopyAction';
import { useMiddleFit } from '@/components/FittedText/useMiddleFit';
import LinkWithDropdown from '@/components/LinkWithDropdown';
import { menuForEntity } from '@/components/LinkWithDropdown/menu';
import { Mono } from '@/styles/common';
import Link from 'next/link';
import React from 'react';
import { IoOpenOutline } from 'react-icons/io5';
import { LinkRow, NewTab, ValueLink } from './styles';

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
  const textSource =
    typeof label === 'string' && label.length > 0 ? label : (value ?? '');
  const { ref, shown } = useMiddleFit<HTMLAnchorElement>(textSource, true);

  if (!value) {
    return <span>{label || '--'}</span>;
  }

  const href = `${routes[type]}/${value}`;
  const useMono = mono ?? monoTypes.includes(type);
  const menu = menuForEntity(type);

  if (compact) {
    const displayText = label || value;
    const text = useMono ? <Mono>{displayText}</Mono> : displayText;
    return (
      <LinkWithDropdown link={href} address={value || ''} entity={type}>
        <Link href={href} data-testid={dataTestId}>
          {text}
        </Link>
      </LinkWithDropdown>
    );
  }

  const fitted = typeof label === 'string' || label == null;

  return (
    <LinkRow>
      <ValueLink
        ref={fitted ? ref : undefined}
        href={href}
        data-testid={dataTestId}
        title={value}
        $mono={useMono}
      >
        {fitted ? shown : label}
      </ValueLink>
      <NewTab
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${menu.noun} in a new tab`}
        title="Open in a new tab"
      >
        <IoOpenOutline size={20} />
      </NewTab>
      <CopyAction
        value={value}
        label={menu.copyLabel}
        announcement={`${menu.copyInfo} copied to clipboard`}
      />
    </LinkRow>
  );
};

export default ExplorerLink;
