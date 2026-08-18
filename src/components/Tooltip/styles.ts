import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(Tooltip)<{ displayMsg: boolean }>`
  --rt-opacity: 0.975;

  width: fit-content !important;
  /* Above row separators and card backgrounds, below the sticky header (6)
     and the modal layers (6/7). */
  z-index: 5;
  /* Value cells set word-break: break-all for addresses; tooltip prose must
     not inherit it. */
  word-break: normal;
  display: ${props => (props.displayMsg ? 'initial' : 'none')} !important;
  background-color: ${props => props.theme.blueGray400} !important;

  span {
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

export const ToolTipSpan = styled.span<{ maxVw: number | undefined }>`
  min-height: 20px;

  div {
    max-width: ${props => (props.maxVw ? props.maxVw : 50)}vw;
    min-height: 1rem;
  }
  div > span {
    white-space: normal;
  }

  > svg {
    display: block;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    div {
      max-width: 100vw;
    }
  }
`;
