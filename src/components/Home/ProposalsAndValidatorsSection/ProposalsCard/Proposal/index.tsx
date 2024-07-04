import { PropsWithChildren } from 'react';
import { PurpleArrowRight } from '@/assets/icons';
import { Status } from '@/components/Table/styles';
import { getProposalStatusColorAndText } from '@/components/Tabs/Proposals';
import { IProposal } from '@/types/proposals';
import {
  ArrowIconContainer,
  CardDescription,
  CardHeader,
  CardTitle,
  InnerCardContainer,
} from '../../style';

interface ProposalProps {
  proposal: IProposal;
}

export const Proposal: React.FC<PropsWithChildren<ProposalProps>> = ({
  proposal,
}) => {
  const { description, proposalId, proposalStatus } = proposal;

  const proposalStatusColorAndText =
    getProposalStatusColorAndText(proposalStatus);
  return (
    <InnerCardContainer>
      {proposalId && (
        <CardHeader>
          <CardTitle href={`/proposals/${proposalId}`}>
            Proposal #{proposalId}
          </CardTitle>
          <ArrowIconContainer href={`/proposals/${proposalId}`}>
            <PurpleArrowRight />
          </ArrowIconContainer>
          <Status status={proposalStatusColorAndText.color}>
            {proposalStatusColorAndText.text}
          </Status>
        </CardHeader>
      )}
      <CardDescription>{description}</CardDescription>
    </InnerCardContainer>
  );
};
