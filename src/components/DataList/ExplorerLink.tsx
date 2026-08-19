import React from 'react';
import { MdOpenInNew } from 'react-icons/md';
import { ActionLink } from './styles';

interface IExplorerLinkProps {
  href: string;
  /** Completes "Open ... in a new tab", e.g. "asset" or "account". */
  subject: string;
  large?: boolean;
}

/**
 * Opens a row's subject in a new tab. A component rather than a repeated
 * block so `rel="noopener noreferrer"` cannot be forgotten at the next call
 * site, and so the icon keeps its size paired with the control size.
 */
const ExplorerLink: React.FC<IExplorerLinkProps> = ({
  href,
  subject,
  large,
}) => (
  <ActionLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Open ${subject} in a new tab`}
    title="Open in a new tab"
    $large={large}
  >
    <MdOpenInNew size={large ? 16 : 14} />
  </ActionLink>
);

export default ExplorerLink;
