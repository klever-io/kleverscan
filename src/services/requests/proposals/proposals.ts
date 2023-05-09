import api from '@/services/api';
import { IProposalsResponse } from '@/types/proposals';

export const proposalsActiveResponse = async (): Promise<void> => {
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });
  const proposals: any = [];
  const descriptionProposal = (item: any) => {
    if (item.description !== '') {
      if (item.description.length < 40) {
        return `${item.proposalId}: ${item.description}`;
      }
      return `${item.proposalId}: ${item.description.substring(0, 40)}...`;
    }

    return String(item.proposalId);
  };
  proposalResponse?.data?.proposals
    .filter(proposal => proposal.proposalStatus === 'ActiveProposal')
    .forEach((item: any) => {
      proposals.push({
        label: descriptionProposal(item),
        value: item.proposalId,
      });
    });
  proposals.sort((a: any, b: any) => (a.value > b.value ? 1 : -1));
  return proposals;
};
