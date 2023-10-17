import { HomeData } from '@/contexts/mainPage';
import { CardBackground, CardIcon } from '@/views/home';
import React, { useContext } from 'react';
import {
  CardContainer,
  CardContent,
  CardSection,
  NewCardsIconContainer,
  Title,
} from '../style';

const ValidatorsCard: React.FC = () => {
  const { totalValidators, activeValidators } = useContext(HomeData);
  return (
    <CardContainer>
      <Title>Validators</Title>
      <CardContent>
        <NewCardsIconContainer>
          <CardIcon src="/homeCards/validatorsIcon.svg" />
          <CardBackground src="/homeCards/validatorsBackground.svg" />
        </NewCardsIconContainer>
        <CardSection>
          <span>Active Vals.</span>
          <span>{activeValidators}</span>
        </CardSection>
        <hr />
        <CardSection>
          <span>Total Vals.</span>
          <span>{totalValidators}</span>
        </CardSection>
      </CardContent>
    </CardContainer>
  );
};

export default ValidatorsCard;
