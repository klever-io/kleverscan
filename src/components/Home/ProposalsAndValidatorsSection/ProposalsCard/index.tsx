import { PropsWithChildren } from 'react';
import { HomeData } from '@/contexts/mainPage';
import { IProposal } from '@/types/proposals';
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
import Link from 'next/link';
import { PurpleArrowRight } from '@/assets/icons';

const ProposalsCard: React.FC<PropsWithChildren> = () => {
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

        <Link
          href={{
            pathname: '/proposals',
          }}
        >
          <a>
            {' '}
            View All
            <PurpleArrowRight />
          </a>
        </Link>
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
        {lastApprovedProposal?.proposalId !== undefined ? (
          <Proposal proposal={lastApprovedProposal} />
        ) : (
          <Proposal
            proposal={
              {
                description: 'No approved proposals',
              } as IProposal
            }
          />
        )}
      </ProposalCardsSection>
      <ProposalCardsSection>
        <ProposalCardTitle>Active Proposals</ProposalCardTitle>
        {activeProposals && (activeProposals?.length || 0) > 0 ? (
          activeProposals.map(proposal => (
            <Proposal key={proposal.proposalId} proposal={proposal} />
          ))
        ) : (
          <Proposal
            proposal={
              {
                description: 'No active proposals',
              } as IProposal
            }
          />
        )}
      </ProposalCardsSection>
    </CardContainer>
  );
};

export default ProposalsCard;
