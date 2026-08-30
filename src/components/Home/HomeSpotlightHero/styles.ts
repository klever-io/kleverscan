import { kbdAccent } from '@/styles/common';
import styled from 'styled-components';

export const HeroWrap = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    margin-top: 2rem;
  }
`;

export const HeroButton = styled.button`
  width: 100%;
  max-width: 44rem;
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.75rem;
  min-height: 3.25rem;
  padding: 0.85rem 1rem 0.85rem 1.15rem;
  border-radius: 999px;
  text-align: left;
  cursor: pointer;
  color: inherit;
  background: ${props =>
    props.theme.dark ? 'rgba(18, 18, 26, 0.95)' : props.theme.true.white};
  border: 1px solid
    ${props =>
      props.theme.dark ? 'rgba(255, 255, 255, 0.1)' : props.theme.black10};
  box-shadow: ${props =>
    props.theme.dark
      ? '0 0 0 1px rgba(0, 0, 0, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.04)'};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${props =>
      props.theme.dark ? 'rgba(155, 108, 255, 0.45)' : props.theme.purple};
    box-shadow: 0 0 0 3px
      ${props =>
        props.theme.dark
          ? 'rgba(125, 63, 241, 0.12)'
          : 'rgba(125, 63, 241, 0.1)'};
  }

  &:focus-visible {
    outline: 2px solid
      ${props => (props.theme.dark ? '#9B6CFF' : props.theme.purple)};
    outline-offset: 2px;
  }
`;

export const HeroIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
    props.theme.dark ? 'rgba(196, 181, 253, 0.9)' : props.theme.purple};

  svg {
    width: 1.1rem;
    height: 1.1rem;

    path {
      fill: currentColor;
    }
  }
`;

export const HeroLabel = styled.span`
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${props =>
    props.theme.dark ? 'rgba(168, 169, 196, 0.85)' : props.theme.gray700};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeroKbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.4rem;
  height: 1.45rem;
  padding: 0 0.45rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.02em;
  ${kbdAccent}
`;

export const HeroHint = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 500;
  color: ${props =>
    props.theme.dark ? 'rgba(168, 169, 196, 0.55)' : props.theme.gray700};
`;
