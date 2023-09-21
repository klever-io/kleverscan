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
const ProposalsCard: React.FC = () => {
  const { totalProposals, activeProposals } = useContext(HomeData);

  return (
    <CardContainer>
      <Title>Proposals</Title>
      <CardContent>
        <NewCardsIconContainer>
          <CardBackground src="/homeCards/proposalsBackground.svg" />
          <CardIcon src="/homeCards/proposalsIcon.svg" />
        </NewCardsIconContainer>
        <CardSection>
          <span>Live Proposals</span>
          <span>{activeProposals}</span>
        </CardSection>
        <hr />
        <CardSection>
          <span>Completed Proposals</span>
          <span>{totalProposals}</span>
        </CardSection>
      </CardContent>
    </CardContainer>
  );
};

export default ProposalsCard;
