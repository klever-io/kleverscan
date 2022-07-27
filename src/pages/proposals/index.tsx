import { ArrowLeft } from '@/assets/icons';
import { Input } from '@/views/proposals';

import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import Tabs, { ITabs } from '@/components/Tabs';

import { Header, Title } from '@/views/accounts/detail';
import { Card } from '@/views/blocks';
import { CardContainer } from '@/views/proposals';
import router from 'next/router';
import { Container } from '@/views/proposals';
import { useState } from 'react';
import NetworkParams from '@/components/Tabs/NetworkParams';
import ProposalsTab from '@/components/Tabs/Proposals';
import { Proposals as Icon } from '@/assets/title-icons';
import { GetServerSideProps } from 'next';
import api from '@/services/api';
import { useDidUpdateEffect } from '@/utils/hooks';

import {
  IProposal,
  IProposals,
  IProposalsResponse,
  INetworkParam,
  INetworkParams,
  IProposalsPage,
  NetworkParamsIndexer,
  IRawParam,
  IFullInfoParam,
  IParsedProposal,
} from '@/types/proposals';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';

const Proposals: React.FC<IProposalsPage> = ({
  networkParams: defaultNetworkParams,
  proposals: defaultProposals,
  totalProposalsPage,
}) => {
  const tableHeaders = ['Network Parameters', 'Proposals'];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);
  const [loadingNetworkParams, setLoadingNetWorkParams] = useState(false);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [page, setPage] = useState(0);

  const [networkParams, setNetworkParams] = useState(defaultNetworkParams);
  const [proposals, setProposals] = useState<IParsedProposal[] | any[]>(defaultProposals);

  const fetchData = async () => {
    setLoadingProposals(true);
    const proposals: IProposalsResponse = await api.get({
      route: `proposals/list?page=${page}`,
    });
    if (!proposals.error && proposals?.data?.proposals) {
      let parsedProposalResponse: any[] = [];
      parsedProposalResponse = parseAllProposals(proposals?.data?.proposals);
        setProposals(parsedProposalResponse);
        setLoadingProposals(false);
      }
  };

  useDidUpdateEffect(() => {
    fetchData();
  }, [page]);

  const CardContent: React.FC = () => {
    return (
      <Card>
        <div>
          <span>
            The committee is made up of KFI holders who are responsible for
            modifying dynamic parameters such as block rewards and transaction
            fees on the KLV network. Each KFI holder who has KFI frozen is
            entitled to initiate and vote for proposals. A proposal is adopted
            as long as it is voted for by at least half of all the KFI frozen by
            the network. The adopted proposal will apply its changes to network
            parameters in the next epoch.
          </span>
        </div>
      </Card>
    );
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Network Parameters':
        return (
          <NetworkParams
            networkParams={networkParams}
            loading={loadingNetworkParams}
          />
        );
      case 'Proposals':
        return (
          <>
            <ProposalsTab proposals={proposals} loading={loadingProposals} />
            <PaginationContainer>
              <Pagination
                count={totalProposalsPage}
                page={page}
                onPaginate={page => {
                  setPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      default:
        return <div />;
    }
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Proposal</h1>
          <Icon />
        </Title>
        <Input />
      </Header>
      <CardContainer>
        <CardContent />
      </CardContainer>
      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const parseAllProposals = (
  arrayOfProposals: any[],
): IParsedProposal[] | [] => {
  if (arrayOfProposals) {
     arrayOfProposals.forEach((proposal, index) => {
      arrayOfProposals[index].parsedParameters = getProposalNetworkParams(
        proposal.parameters,
      );
    });
    return arrayOfProposals;
  }
  return [];
};

export const getProposalNetworkParams = (
  params: IRawParam,
): IFullInfoParam[] => {
  const fullInfoParams: IFullInfoParam[] = Object.entries(params).map(
    ([index, value]) => ({
      paramIndex: index,
      paramLabel: NetworkParamsIndexer[index],
      paramValue: Number(value),
      paramText: proposalsMessages[NetworkParamsIndexer[index]],
    }),
  );

  return fullInfoParams;
};

export const getServerSideProps: GetServerSideProps<IProposalsPage> = async ({
  params,
}) => {
  const { data } = await api.get({ route: 'network/network-parameters' });
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });
  let parsedProposalResponse: any[] = [];
  if (!proposalResponse.error && proposalResponse?.data?.proposals) {
    parsedProposalResponse = parseAllProposals(proposalResponse.data.proposals);
  }

  let networkParams = {} as INetworkParams;

  if (data) {
    networkParams = Object.keys(proposalsMessages).map((key, index) => {
      return {
        number: index,
        parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
        currentValue: data.parameters[key].value,
      };
    });
  }
  const props: IProposalsPage = {
    networkParams,
    proposals: parsedProposalResponse || [],
    totalProposalsPage: proposalResponse?.pagination?.totalPages || 0,
  };
  return { props };
};

export default Proposals;
