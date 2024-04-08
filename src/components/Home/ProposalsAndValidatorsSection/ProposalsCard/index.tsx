import { HomeData } from '@/contexts/mainPage';
import Image from 'next/image';
import React, { useContext } from 'react';
import {
  CardContainer,
  CardSection,
  Content,
  NextImageValidatorWrapper,
  ProposalCardsSection,
  ProposalCardTitle,
  StackedImageWrapper,
  Title,
} from '../style';
import { Proposal } from './Proposal';

const ProposalsCard: React.FC = () => {
  const {
    totalProposals,
    activeProposalsCount,
    activeProposals,
    lastApprovedProposal,
  } = useContext(HomeData);

  return (
    <CardContainer>
      <Title>
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
        <span>Proposals</span>
      </Title>

      <Content>
        <CardSection>
          <span>Live Proposals</span>
          <span>{activeProposalsCount}</span>
        </CardSection>
        <CardSection>
          <span>Completed Proposals</span>
          <span>{totalProposals}</span>
        </CardSection>
      </Content>

      <ProposalCardsSection>
        <ProposalCardTitle>Last Approved Proposal</ProposalCardTitle>
        {lastApprovedProposal && <Proposal proposal={lastApprovedProposal} />}
      </ProposalCardsSection>
      <ProposalCardsSection>
        <ProposalCardTitle>Active Proposals</ProposalCardTitle>
        {activeProposals &&
          activeProposals.map(proposal => (
            <Proposal key={proposal.proposalId} proposal={proposal} />
          ))}
      </ProposalCardsSection>
    </CardContainer>
  );
};

export default ProposalsCard;
