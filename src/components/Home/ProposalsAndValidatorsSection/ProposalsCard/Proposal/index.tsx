import { Status } from '@/components/TableV2/styles';
import { getProposalStatusColorAndText } from '@/components/Tabs/Proposals';
import { IProposal } from '@/types/proposals';
import {
  ProposalContainer,
  ProposalDescription,
  ProposalTitle,
} from '../../style';

interface ProposalProps {
  proposal: IProposal;
}

export const Proposal: React.FC<ProposalProps> = ({ proposal }) => {
  const { description, proposalId, proposalStatus } = proposal;

  const proposalStatusColorAndText =
    getProposalStatusColorAndText(proposalStatus);
  return (
    <ProposalContainer>
      <ProposalTitle>
        Proposal #{proposalId}
        <Status status={proposalStatusColorAndText.color}>
          {proposalStatusColorAndText.text}
        </Status>
      </ProposalTitle>
      <ProposalDescription>{description}</ProposalDescription>
    </ProposalContainer>
  );
};
