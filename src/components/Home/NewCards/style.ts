import { DefaultCardStyles } from '@/styles/common';
import { CardIconContainer } from '@/views/home';
import styled from 'styled-components';

export const CardContent = styled.div`
  ${DefaultCardStyles}
  background-color: ${props => props.theme.dark && 'transparent'};
  display: grid;
  grid-template-columns: 3rem auto 1px 1fr 1fr;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid
    ${props => (props.theme.dark ? props.theme.card.background : 'none')};
  hr {
    display: block;
    height: 60%;
    background: ${props =>
      props.theme.dark ? props.theme.lightGray : '#D7D8DD'};
    width: 1px;
    border: 0;
  }
  padding: 1rem;
  border-radius: 1rem;
  height: 8rem;
`;
export const CardSection = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  min-width: 10rem;
  span {
    line-height: 1rem;
    font-size: 1.5rem;
  }

  span:nth-child(1) {
    color: ${props =>
      props.theme.dark ? props.theme.text.gray : props.theme.darkText};
    font-weight: 700;
    font-size: 1.1rem;
  }
  span:nth-child(2) {
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }
`;
export const CardsWrapper = styled.section`
  display: flex;
  width: 100%;
  gap: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;
export const CardContainer = styled.div`
  gap: 1.5rem;
  display: flex;
  width: 50%;
  flex-direction: column;
  span {
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;
export const Title = styled.span`
  padding-left: 0;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.125rem;
`;

export const NewCardsIconContainer = styled(CardIconContainer)`
  width: 4rem;
`;

export const NextImageValidatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  :nth-child(1) {
    position: absolute;
  }
`;

export const StackedImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
