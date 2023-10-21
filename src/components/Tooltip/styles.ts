import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(ReactTooltip)<{ displayMsg: boolean }>`
  width: fit-content !important;
  display: ${props => (props.displayMsg ? 'initial' : 'none')} !important;
  word-wrap: break-word !important;
  overflow: hidden;
`;

export const ToolTipSpan = styled.span`
  height: 24px;
  div > span {
    white-space: normal;
  }
`;
