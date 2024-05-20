import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(ReactTooltip)<{ displayMsg: boolean }>`
  width: fit-content !important;
  display: ${props => (props.displayMsg ? 'initial' : 'none')} !important;

  span {
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

export const ToolTipSpan = styled.span<{ maxVw: number | undefined }>`
  min-height: 20px;

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

  .opaque {
    opacity: 0.975 !important;
  }
`;
