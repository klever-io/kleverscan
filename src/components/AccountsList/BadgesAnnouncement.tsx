import { VisuallyHidden } from '@/components/DataList/styles';
import React from 'react';
import type { ValidatorOwners } from '@/services/requests/accounts';

export interface IBadgesAnnouncementProps {
  owners: ValidatorOwners | null | undefined;
  message: string;
}

/**
 * Polite announcement for the deliberately late validator badges: the set
 * lands well after the rows have painted, and a reader that already passed a
 * row never learns it gained a badge (#699). Empty until the set actually
 * arrives; a failed fetch (null) stays silent, matching the badge itself.
 */
export const BadgesAnnouncement: React.FC<IBadgesAnnouncementProps> = ({
  owners,
  message,
}) => (
  <VisuallyHidden role="status" aria-live="polite">
    {owners ? message : ''}
  </VisuallyHidden>
);
