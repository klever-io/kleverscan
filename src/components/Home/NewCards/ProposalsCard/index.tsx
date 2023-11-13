import { HomeData } from '@/contexts/mainPage';
import Image from 'next/image';
import React, { useContext } from 'react';
import {
  CardContainer,
  CardContent,
  CardSection,
  NextImageValidatorWrapper,
  StackedImageWrapper,
  Title,
} from '../style';
const ProposalsCard: React.FC = () => {
  const { totalProposals, activeProposals } = useContext(HomeData);

  return (
    <CardContainer>
      <Title>Proposals</Title>
      <CardContent>
        <StackedImageWrapper>
          <NextImageValidatorWrapper>
            <Image
              src="/homeCards/proposalsIcon.svg"
              alt="Proposals icon"
              width={32}
              height={32}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageValidatorWrapper>
          <NextImageValidatorWrapper>
            <Image
              src="/homeCards/proposalsBackground.svg"
              alt="Proposals icon background"
              width={48}
              height={48}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageValidatorWrapper>
        </StackedImageWrapper>
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
