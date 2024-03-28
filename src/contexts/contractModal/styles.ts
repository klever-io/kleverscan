import styled from 'styled-components';

export const ButtonModal = styled.button<{
  isLocked?: boolean;
}>`
  color: ${props => props.theme.true.white};
  background-color: transparent;
  border: 1px solid
    ${props => (!props.isLocked ? props.theme.violet : props.theme.darkGray)};

  font-size: 0.875rem;
  line-height: 1.25rem;

  align-self: end;

  min-width: 8rem;
  max-width: 15rem;

  padding: 4px 16px;
  border-radius: 24px;

  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  transition: all 0.1s ease;

  > span {
    color: ${props => props.theme.true.white} !important;
  }

  :active {
    transform: ${props => (props.isLocked ? '' : 'translateY(0.1rem)')};
  }

  :hover {
    background-color: ${props =>
      props.isLocked ? props.theme.darkGray : props.theme.violet};
    cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};
  }

  opacity: ${props => (props.isLocked ? '0.3' : '1')};

  cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 100%;
  }
`;
