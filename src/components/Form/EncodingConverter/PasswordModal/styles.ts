import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: grid;
  place-content: center;

  width: 100vw;
  height: 100vh;

  z-index: 10;
  backdrop-filter: brightness(0.3);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rem;
  color: ${props => props.theme.black};
  padding: 2rem;

  height: fit-content;
  max-width: 90vw;
  min-width: 50vw;

  border-radius: 1rem;

  background-color: ${props => props.theme.card.background};
`;

export const DetailsRow = styled.pre`
  color: ${props => props.theme.white};

  border-bottom: 1px solid ${props => props.theme.card.border};
  border-top: 1px solid ${props => props.theme.card.border};
`;

export const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Button = styled.button`
  cursor: pointer;
  font-size: 0.8rem;
  width: 5rem;

  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  line-height: 12px;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`;

export const LinkRow = styled.div``;

export const Link = styled.a`
  color: ${props => props.theme.white};

  &:visited {
    color: ${props => props.theme.white};
  }
`;

export const Input = styled.input`
  width: 100%;

  padding: 1rem 1.25rem;

  border: 1px solid ${({ theme }) => theme.input.border.search};
  border-radius: 0.5rem;

  color: ${({ theme }) => theme.black};

  box-shadow: unset !important;

  font-weight: 500;

  &:focus {
    outline: unset !important;
    outline-offset: unset !important;
    border: 1px solid ${({ theme }) => theme.input.border};
  }
`;

export const ContainerButton: any = styled.button`
  padding: 1rem 1.25rem;

  width: 100%;

  position: relative;

  background-color: ${props => props.theme.white};

  border: 1px solid ${props => props.theme.rose};
  border-radius: 0.25rem;

  color: ${({ theme }) => theme.black};
  font-size: 0.9rem;
  text-transform: uppercase;

  cursor: pointer;

  transition: 0.3s ease;
`;
