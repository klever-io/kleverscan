import {
  BadgePill,
  BadgeVariant,
  VisuallyHidden,
} from '@/components/DataList/styles';
import Tooltip from '@/components/Tooltip';
import React, { PropsWithChildren } from 'react';

export interface IExplainedBadgeProps {
  /** The full explanation. Shown on hover or focus, and read out as part of
   *  the pill, so it must be a sentence rather than a label. */
  msg: string;
  variant: BadgeVariant;
}

/**
 * A badge whose explanation is reachable by keyboard, touch and screen reader.
 *
 * A bare `title` opens on neither keyboard nor touch and readers expose it
 * inconsistently (#699). The tooltip mounts only while hovered or focused, so
 * the message also rides inside the pill as hidden text: a reader in browse
 * mode would otherwise never meet it at all.
 */
const ExplainedBadge: React.FC<PropsWithChildren<IExplainedBadgeProps>> = ({
  msg,
  variant,
  children,
}) => (
  <Tooltip msg={msg} focusable>
    <BadgePill $variant={variant}>
      {children}
      <VisuallyHidden>{`, ${msg}`}</VisuallyHidden>
    </BadgePill>
  </Tooltip>
);

export default ExplainedBadge;
