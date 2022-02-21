import { ArrowLeft } from '@/assets/icons';
import { Input } from '@/views/proposals';
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

interface IProposalsPage {
  networkParams: INetworkParam[];
  proposals: IProposal[];
  totalProposalsPage: number;
}

interface INetworkParams {
  [index: number]: INetworkParam;
}

interface INetworkParam {
  number: number;
  parameter: string;
  currentValue: string;
}

interface IProposals {
  [index: number]: IProposal;
}

interface IProposal {
  proposalId: number;
  proposalStatus: string;
  parameter: string;
  value: string;
  description: string;
  epochStart: number;
  epochEnd: number;
  votes: number;
  voters: IVote[];
  // hash: string;
  // proposer: string;
}

interface IVote {
  address: string;
  amount: number;
}

const Proposals: React.FC<IProposalsPage> = ({
  networkParams: defaultNetworkParams,
  proposals: defaultProposals,
  totalProposalsPage,
}) => {
  const tableHeaders = ['Network Paramters', 'Proposals'];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);
  const [loadingNetworkParams, setLoadingNetWorkParams] = useState(false);
  const [loadingProposals, setLoadingProposals] = useState(false);

  const [networkParams, setNetworkParams] = useState(defaultNetworkParams);
  const [proposals, setProposals] = useState(defaultProposals);

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
      case 'Network Paramters':
        return (
          <>
            <NetworkParams
              networkParams={networkParams}
              loading={loadingNetworkParams}
            />
          </>
        );
      case 'Proposals':
        return (
          <>
            <ProposalsTab
              proposalParams={proposals}
              loading={loadingProposals}
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
        <Title>
          <div onClick={router.back}>
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

export const getServerSideProps: GetServerSideProps<IProposalsPage> = async ({
  params,
}) => {
  const props: IProposalsPage = {
    networkParams: [],
    proposals: [],
    totalProposalsPage: 0,
  };

  return { props };
};

export default Proposals;
