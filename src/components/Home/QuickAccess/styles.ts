import { DefaultCardStyles } from '@/styles/common';
import styled, { css } from 'styled-components';
import { TableGradientBorder } from '../../Table/styles';

export const Container = styled.div`
  ${TableGradientBorder}
  width: 100%;
  color: white;

  padding: 16px 8px 8px;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 16px 24px;
  }
`;

export const TitleContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;

  small {
    color: ${props => props.theme.darkText};
    width: auto;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 18px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    text-align: center;
  }
`;

export const CardItem = styled.div`
  ${DefaultCardStyles}
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 16px 20px;

  border-radius: 8px;
  border: 1px solid ${props => props.theme.violet};
  cursor: pointer;

  transition: 0.25s ease-in-out;

  p {
    transition: 0.25s ease-in-out;

    color: ${props => props.theme.black};
    font-weight: 700;
    font-size: 0.9rem;
  }

  &:hover,
  &:focus {
    background-color: ${props => props.theme.violet};

    ${props =>
      !props.theme.dark &&
      css`
        p {
          color: ${props => props.theme.white};
        }

        svg {
          path {
            fill: ${props => props.theme.white} !important;
          }

          > circle {
            fill: ${props => props.theme.white} !important;

            stroke: ${props => props.theme.white} !important;
          }
          > rect {
            fill: ${props => props.theme.violet} !important;
          }
        }
      `}
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-column: span 2;

    &:nth-last-child(2) {
      grid-column: 0;
    }
    &:nth-last-child(1) {
      grid-column: 5/7;
    }
  }
`;
export const PlusIcon = styled.div`
  color: black;

  svg {
    transition: 0.25s ease-in-out;

    path {
      transition: 0.25s ease-in-out;

      fill: ${props =>
        props.theme.dark
          ? props.theme.true.white
          : props.theme.violet} !important;
    }

    > circle {
      transition: 0.25s ease-in-out;

      fill: ${props =>
        props.theme.dark
          ? props.theme.true.white
          : props.theme.violet} !important;

      stroke: ${props =>
        props.theme.dark
          ? props.theme.true.white
          : props.theme.violet} !important;
    }
    > rect {
      transition: 0.25s ease-in-out;

      fill: ${props => props.theme.white} !important;
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  display: grid;
  gap: 8px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: ${props => props.theme.black};
`;
