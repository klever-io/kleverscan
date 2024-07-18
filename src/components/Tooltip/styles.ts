import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(Tooltip)<{ displayMsg: boolean }>`
  --rt-opacity: 0.975;

  width: fit-content !important;
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

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    div {
      max-width: 100vw;
    }
  }
`;
