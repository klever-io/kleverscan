import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(ReactTooltip)<{ displayMsg: boolean }>`
  width: fit-content !important;
  display: ${props => (props.displayMsg ? 'initial' : 'none')} !important;
`;

export const ToolTipSpan = styled.span<{ maxVw: number | undefined }>`
  height: 20px;

  div {
    max-width: ${props => (props.maxVw ? props.maxVw : 50)}vw;
    min-height: 0;
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
