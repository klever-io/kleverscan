import { Proposals as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import NetworkParams from '@/components/Tabs/NetworkParams';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import ProposalsTab from '@/components/Tabs/Proposals';
import api from '@/services/api';
import {
  INetworkParams,
  IParsedProposal,
  IProposalsPage,
  IProposalsResponse,
} from '@/types/proposals';
import { getProposalNetworkParams } from '@/utils/parametersProposal';
import { Header } from '@/views/accounts/detail';
import { Card } from '@/views/blocks';
import { CardContainer, Container, Input } from '@/views/proposals';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

const Proposals: React.FC<IProposalsPage> = ({
  networkParams: defaultNetworkParams,
  proposals: defaultProposals,
  totalProposalsPage,
}) => {
  const tableHeaders = ['Network Parameters', 'Proposals'];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const requestProposals = async (page: number, limit: number) => {
    const proposals: IProposalsResponse = await api.get({
      route: `proposals/list?page=${page}&limit=${limit}`,
    });

    let parsedProposalResponse: any[] = [];
    parsedProposalResponse = parseAllProposals(proposals?.data?.proposals);
    return { ...proposals, data: { proposals: parsedProposalResponse } };
  };

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
        return <NetworkParams networkParams={defaultNetworkParams} />;
      case 'Proposals':
        return (
          <>
            <ProposalsTab
              proposals={defaultProposals}
              totalPages={totalProposalsPage}
              request={requestProposals}
            />
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
        <Title title="Proposals" Icon={Icon} />

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

export const getServerSideProps: GetServerSideProps<
  IProposalsPage
> = async () => {
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
