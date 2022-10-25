import styled from 'styled-components';

export const TooltipContainer = styled.div`
  background: ${props => props.theme.chart.backgroundTooltip};
  color: black;
  padding: 1rem;
  border-radius: 0.35rem;

  -webkit-box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);

  p {
    :first-child {
      color: black;
    }
    :nth-child(2) {
      color: ${props => props.theme.violet};
    }
    :nth-child(3) {
      color: ${props => props.theme.lightBlue};
    }
  }
`;
