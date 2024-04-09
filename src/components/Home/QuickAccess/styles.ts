import { DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';
import { TableGradientBorder } from '../../TableV2/styles';

export const Container = styled.div`
  ${TableGradientBorder}
  width: 100%;
  color: white;

  padding: 16px 24px;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TitleContainer = styled.div`
  width: 100%;
  small {
    color: ${props => props.theme.darkText};
    width: auto;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 18px;
  }
`;

export const CardItem = styled.div`
  ${DefaultCardStyles}
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 16px 20px;

  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.violet};
  cursor: pointer;

  transition: 0.25s ease-in-out;

  p {
    color: ${props => props.theme.black};
    font-weight: 700;
    font-size: 0.9rem;
  }

  :hover,
  :focus {
    background-color: ${props => props.theme.violet};
  }

  grid-column: span 2;

  :nth-last-child(2) {
    grid-column: 1/4;
  }
  :nth-last-child(1) {
    grid-column: 4/7;
  }
`;
export const PlusIcon = styled.div`
  color: black;

  svg {
    path {
      fill: ${props =>
        props.theme.dark
          ? props.theme.true.white
          : props.theme.violet} !important;
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  display: grid;
  gap: 8px;

  grid-template-columns: repeat(auto-fill, 6);

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  line-height: 1.75rem;
`;
