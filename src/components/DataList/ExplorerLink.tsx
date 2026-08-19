import React from 'react';
import { MdOpenInNew } from 'react-icons/md';
import { ActionLink } from './styles';

interface IExplorerLinkProps {
  href: string;
  /** Accessible name, already translated, e.g. "Open asset in a new tab". */
  label: string;
  /** Visible tooltip, already translated. */
  title: string;
  large?: boolean;
}

/**
 * Opens a row's subject in a new tab. A component rather than a repeated
 * block so `rel="noopener noreferrer"` cannot be forgotten at the next call
 * site, and so the icon keeps its size paired with the control size. The
 * labels arrive translated, because this module is shared and should not know
 * which namespace a page loads.
 */
const ExplorerLink: React.FC<IExplorerLinkProps> = ({
  href,
  label,
  title,
  large,
}) => (
  <ActionLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={title}
    $large={large}
  >
    <MdOpenInNew size={large ? 16 : 14} />
  </ActionLink>
);

export default ExplorerLink;
