import { focusRing } from '@/components/DataList/styles';
import Link from 'next/link';
import styled from 'styled-components';

/* Fills the value column so the fit measures the free space and can grow
   after a narrower width. The text itself does not grow, so the icons stay
   against the value. */
export const LinkRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: 1 1 auto;

  button {
    flex-shrink: 0;
  }
`;

export const ValueLink = styled(Link)<{ $mono: boolean }>`
  && {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* Size and line height stay with the page. Forcing 1rem here beat the
       0.95rem and 0.9rem rules on the other detail pages. */
    font-weight: ${props => (props.$mono ? 400 : 600)};
    font-family: ${props =>
      props.$mono ? "'Fira Mono', monospace" : 'inherit'};
    color: ${props => props.theme.black};
    text-decoration: none;
    ${focusRing}
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const NewTab = styled.a`
  flex: 0 0 20px;
  width: 20px;
  min-width: 20px;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.black};
  line-height: 0;
`;
