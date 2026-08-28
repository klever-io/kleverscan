import { SummaryCard } from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
import styled, { css, DefaultTheme } from 'styled-components';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old CardContainer had, so the figures land where
// the cards used to. The loading shape carries the same margin, or the page
// shifts by 24px once the numbers arrive.
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

export const BlocksSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
`;

export const BlocksSummaryLoading = styled(SummaryLoading)`
  ${pageSummarySpacing}
`;

// Same red the holders bar uses for its burned segment, so one colour means
// one thing across the site.
const SEGMENT_COLOR = {
  burned: (theme: DefaultTheme) => (theme.dark ? '#FF4465' : theme.red),
  validators: (theme: DefaultTheme) => theme.violet,
  kapp: (theme: DefaultTheme) => theme.lightPurple,
};

export type FeeSegmentKey = keyof typeof SEGMENT_COLOR;

export const feeSegmentColor = (
  key: FeeSegmentKey,
  theme: DefaultTheme,
): string => SEGMENT_COLOR[key](theme);

/** The age of the figures, in the place the old card carried it. */
export const UpdatedNote = styled.p`
  margin-top: 0.75rem;

  color: ${props => props.theme.darkText};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
`;
