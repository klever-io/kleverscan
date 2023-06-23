import styled from 'styled-components';

export const ButtonModal = styled.button<{
  isLocked?: boolean;
}>`
  color: ${props => props.theme.true.white};
  background-color: ${props => props.theme.violet};
  height: 2.5rem;

  align-self: end;

  min-width: 13rem;
  max-width: 15rem;

  padding: 0 1rem;
  border-radius: 4px;

  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  > span {
    color: ${props => props.theme.true.white} !important;
  }

  :active {
    transform: ${props => (props.isLocked ? '' : 'translateY(0.1rem)')};
  }

  :hover {
    opacity: ${props => (props.isLocked ? '' : '0.8')};
  }

  opacity: ${props => (props.isLocked ? '0.3' : '1')};

  cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 100%;
  }
`;
