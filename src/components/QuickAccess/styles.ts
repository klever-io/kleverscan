import { DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  color: white;
  padding: 2.5rem 0 0 1rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 2rem 0 0 1rem;
  }
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
  width: 8.5rem;
  height: 8.125rem;
  margin-bottom: 1rem;

  background: ${props => props.theme.dark && props.theme.blue};
  border-radius: 0.5rem;
  cursor: pointer;
  p {
    color: ${props => props.theme.black};
    font-weight: 700;
    font-size: 0.9rem;
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
