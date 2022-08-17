import styled, { css, keyframes } from 'styled-components';

export const LanguageContainer = styled.div`
  height: 1rem;

  font-weight: 400;

  color: ${props => props.theme.navbar.text};

  cursor: pointer;

  position: relative;
`;

export const FadeIn = keyframes`
  from {
    opacity: 0.1;
    transform: translateX(-25%) translateY(-4px);

  }
  to {
    opacity: 1;
    transform: translateX(-25%) translateY(0);
  }
`;

export const LanguageDropdown = styled.div<{ active: boolean }>`
  position: absolute;
  top: 2rem;
  left: 0;

  width: calc(5ch + 3rem);

  padding: 0.5rem 1rem;

  background-color: ${props => props.theme.card.background};
  border-radius: 0.5rem;

  transform: translateX(-25%);

  display: none;
  flex-direction: column;
  gap: 0.25rem;

  animation: ${FadeIn} 0.1s ease-in-out;

  ${props =>
    props.active &&
    css`
      display: flex;
    `};
`;

export const LanguageDropdownItem = styled.div`
  border-radius: 0.5rem;
  background-color: inherit;
  padding: 0.25rem 0.5rem;
  &:hover {
    filter: brightness(1.3);
  }
`;
