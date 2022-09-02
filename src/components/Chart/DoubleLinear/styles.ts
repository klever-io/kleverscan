import styled from 'styled-components';

export const TooltipContainer = styled.div`
  background: white;
  color: black;
  padding: 1rem;
  border-radius: 0.35rem;
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
