import styled from 'styled-components';

export const TooltipContainer = styled.div`
  background: ${props => props.theme.white};
  color: ${props => props.theme.violet};
  padding: 1rem;
  border-radius: 0.35rem;
  opacity: 0.8;

  -webkit-box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);
`;
