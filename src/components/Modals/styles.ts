import styled, { css } from 'styled-components';
import { IButton } from '../Button';

export const Container = styled.div<{ open?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 6;
  backdrop-filter: brightness(0.3);

  transition: all 0.2s ease-in-out;

  ${props =>
    props.open
      ? css`
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        `
      : css`
          opacity: 0;
          visibility: hidden;
          transform: translateY(1rem);
        `}
`;

export const Image = styled.img`
  border-radius: 0.5rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  h1 {
    color: white;
  }
  padding: 2rem;
  height: fit-content;
  width: clamp(50vw, 90vw, 90vw);
  border-radius: 1rem;
  background-color: ${props => props.theme.card.background};
`;

export const ContentHeader = styled.div`
  width: 100%;
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  > h1 {
    align-self: center;
  }
`;

export const DetailsRow = styled.pre`
  width: 100%;
  color: ${props => props.theme.white};
  position: relative;
  border-bottom: 1px solid ${props => props.theme.card.border};
  border-top: 1px solid ${props => props.theme.card.border};
`;

export const MessageContent = styled.div`
  color: ${props => props.theme.status.warning};
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    min-width: 32px;
  }
`;

export const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  button:nth-child(2) {
    background-color: ${props => props.theme.filter.item.selected};
  }
`;

export const ButtonContainer = styled.button<IButton>`
  background-color: #515395;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  border: 0.2px solid ${({ theme }) => theme.input.border};
  user-select: none;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 45%;
  }
  &[type='submit'] {
    background-color: ${props => props.theme.purple};
  }
`;
