import { transparentize } from 'polished';
import styled from 'styled-components';

export const CardContainer = styled.div`
  margin: auto;
  width: 90%;
  max-width: 1200px;
  margin-bottom: -2rem;
  padding: 2rem 0;

  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const WarningContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 1rem 2rem;

  border-radius: 1rem;

  border: 1px solid ${props => transparentize(0.1, props.theme.status.warning)};
  background: ${props => transparentize(0.8, props.theme.status.warning)};
  color: ${props => props.theme.darkText};

  svg {
    min-width: fit-content;
  }
`;

export const WarningText = styled.p`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  padding: 1rem 0;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
