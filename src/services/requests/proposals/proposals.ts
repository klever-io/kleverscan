import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import api from '@/services/api';
import { IParamList } from '@/types';
import { INetworkParam, IProposalsResponse } from '@/types/proposals';

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

export const getParamsList = async (): Promise<IParamList[] | undefined> => {
  const { data } = await api.get({ route: 'network/network-parameters' });

  let networkParams = {} as INetworkParam[];
  const paramsList = [] as IParamList[];

  if (data) {
    networkParams = Object.keys(proposalsMessages).map((key, index) => {
      return {
        number: index,
        parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
        currentValue: data.parameters[key]?.value,
        parameterLabel: key,
      };
    });
  }

  networkParams.length &&
    networkParams?.forEach((param: INetworkParam) => {
      paramsList.push({
        value: param.number,
        label: `${param.parameter}: ${param.currentValue}`,
        currentValue: param.currentValue,
        parameterLabel: param.parameterLabel,
      });
    });

  return paramsList;
};
