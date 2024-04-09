import { DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';
import { TableGradientBorder } from '../TableV2/styles';

export const Container = styled.div`
  ${TableGradientBorder}
  width: 100%;
  color: white;

  padding: 16px 24px;
  border-radius: 16px;
`;

export const TitleContainer = styled.div`
  padding-bottom: 1rem;
  small {
    color: ${props => props.theme.navbar.text};
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
  justify-content: space-between;
  padding: 0 20px 10px;
  height: 94px;

  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.violet};
  cursor: pointer;
  p {
    color: ${props => props.theme.black};
    font-weight: 700;
    font-size: 0.9rem;
  }

  transition: 0.25s ease-in-out;

  :hover,
  :focus {
    background-color: ${props => props.theme.violet};
  }
`;
export const PlusIcon = styled.div`
  align-self: flex-end;
  padding-top: 1rem;
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
  display: grid;
  gap: 8px;

  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;
