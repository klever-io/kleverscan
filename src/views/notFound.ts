import { transparentize } from 'polished';
import styled, { css } from 'styled-components';
import { default as DefaultBackground } from '../assets/not-found.svg';

export const Container = styled.div`
  padding: 10rem;

  display: flex;

  flex-direction: row;
  justify-content: space-between;

  background-color: ${props => props.theme.background};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 3rem;
    align-items: center;

    flex-direction: column-reverse;
  }
`;

export const Content = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;

  h1 {
    color: ${props => props.theme.black};
    font-weight: 700;
    font-size: 2.5rem;
  }

  span {
    max-width: 30rem;

    color: ${props => props.theme.darkText};
    font-weight: 400;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 1rem;

    align-items: center;

    h1 {
      font-size: 2rem;
    }

    span {
      max-width: 100%;
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 1rem;

  a {
    text-decoration: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;

    flex-direction: column;
  }
`;

const hoverBackground = css`
  filter: brightness(1.2);
`;

const hoverNoBackground = css`
  background-color: ${props => transparentize(0.8, props.theme.violet)};
`;

export const Button = styled.div<{ hasBackground: boolean }>`
  padding: 1rem 2rem;
  position: relative;
  z-index: 2;
  background-color: ${props =>
    props.hasBackground ? props.theme.violet : 'transparent'};

  border-radius: 0.5rem;

  cursor: pointer;

  span {
    font-weight: 500;
    color: ${props =>
      props.hasBackground ? props.theme.white : props.theme.violet};
  }

  transition: 0.2s ease;

  &:hover {
    ${props => (props.hasBackground ? hoverBackground : hoverNoBackground)};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;

    text-align: center;
  }
`;

export const Background = styled(DefaultBackground)`
  top: 30%;
  left: 50%;
  z-index: 0;
  position: absolute;

  transform: translate(-30%, -50%);

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const Number = styled.div`
  position: relative;
  z-index: 1;
  span {
    color: ${props => props.theme.black};
    font-weight: 500;
    font-size: 10rem;
    font-family: Rubik, sans-serif;

    text-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: 7rem;
    }
  }
`;
