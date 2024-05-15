import { TableGradientBorder } from '@/components/TableV2/styles';
import { CardIconContainer } from '@/views/home';
import styled from 'styled-components';

export const CardContainer = styled.div`
  ${TableGradientBorder}
  background-color: ${props => props.theme.dark && 'transparent'};
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 100%;

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
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 0;

  span {
    line-height: 1.5rem;
    font-size: 1.25rem;
    font-weight: 600;

    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }

  a {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 1rem;

    color: ${({ theme }) => theme.violet};
    font-size: 0.875rem;
    line-height: 1rem;
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: start;
  }
`;

export const CardSection = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  gap: 8px;
  min-width: 10rem;

  span:nth-child(1) {
    font-size: 0.875rem;
    line-height: 1rem;
    font-weight: 400;

    color: ${props =>
      props.theme.dark ? props.theme.text.gray : props.theme.darkText};
  }
  span:nth-child(2) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;

    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }
`;
export const CardsWrapper = styled.section`
  display: flex;
  width: 100%;
  gap: 1rem;
  min-height: 400px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
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

export const NextImageCardWrapper = styled(NextImageValidatorWrapper)``;

export const StackedImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProposalCardsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProposalCardTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: ${props =>
    props.theme.dark ? props.theme.true.white : props.theme.true.black};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  > span {
    margin-left: auto;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: ${props => props.theme.darkText};
  }

  a {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  a:hover,
  a:active,
  a:focus {
    color: ${props => props.theme.violet};
  }
`;

export const ArrowIconContainer = styled.a`
  display: flex;
  align-items: center;
`;

export const CardTitle = styled.a`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: ${props => props.theme.violet};

  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const InnerCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  border-radius: 1rem;
  border: 1px solid
    ${props => (props.theme.dark ? props.theme.gray800 : props.theme.black10)};
  padding: 16px 12px;
`;

export const CardDescription = styled.span`
  font-size: 0.825rem;
  font-weight: 300;
  line-height: 1rem;
  color: ${props => props.theme.black};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProposalStatus = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1rem;
  color: ${props =>
    props.theme.dark ? props.theme.text.gray : props.theme.darkText};
`;

export const Timestamp = styled.span`
  margin-left: auto;
`;
