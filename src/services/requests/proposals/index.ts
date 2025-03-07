import { proposalsMap } from '@/components/Tabs/NetworkParams/proposalsMap';
import api from '@/services/api';
import { IParamList, IResponse } from '@/types';
import {
  INetworkParams,
  INodeOverview,
  IParsedNetworkParam,
  IProposalsResponse,
} from '@/types/proposals';
import { parseAllProposals, parseProposal } from '@/utils/parseValues';
import { NextRouter } from 'next/router';

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

  let networkParams = {} as IParsedNetworkParam[];
  const paramsList = [] as IParamList[];

  if (data) {
    networkParams = Object.keys(proposalsMap).map((key, index) => {
      return {
        number: index,
        parameter: proposalsMap[key as keyof typeof proposalsMap]
          ? proposalsMap[key as keyof typeof proposalsMap].message
          : '',
        currentValue: data.parameters[key]?.value,
        parameterLabel: key,
      };
    });
  }

  networkParams.length &&
    networkParams?.forEach((param: IParsedNetworkParam) => {
      paramsList.push({
        value: param.number,
        label: `${param.parameter}: ${param.currentValue}`,
        currentValue: param.currentValue,
        parameterLabel: param.parameterLabel,
      });
    });

  return paramsList;
};

export const dataOverviewCall = async (): Promise<
  INodeOverview | undefined
> => {
  try {
    const proposalResponse: IResponse = await api.get({
      route: 'node/overview',
    });
    return proposalResponse.data.overview;
  } catch (error) {
    console.error(error);
  }
};

export const dataNetworkParams = async (): Promise<
  INetworkParams | undefined
> => {
  try {
    const res = await api.get({
      route: 'network/network-parameters',
    });
    return res?.data?.parameters;
  } catch (error) {
    console.error(error);
  }
};

export const dataProposalCall = async (router: NextRouter): Promise<any> => {
  try {
    const res = await api.get({
      route: `proposals/${router.query.number}`,
      query: { voteType: 0 },
    });
    return parseProposal(res);
  } catch (error) {
    console.error(error);
  }
};

export const requestProposals = async (
  page: number,
  limit: number,
  router: NextRouter,
): Promise<IResponse> => {
  const { status } = router.query;
  const proposals: IProposalsResponse = await api.get({
    route: `proposals/list?status=${status || ''}&page=${page}&limit=${limit}`,
  });
  let parsedProposalResponse: any[] = [];
  parsedProposalResponse = parseAllProposals(proposals?.data?.proposals);
  return { ...proposals, data: { proposals: parsedProposalResponse } };
};
