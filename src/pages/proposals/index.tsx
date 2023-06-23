import { Proposals as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import NetworkParams from '@/components/Tabs/NetworkParams';
import ProposalsTab from '@/components/Tabs/Proposals';
import api from '@/services/api';
import { Card, Container, Header } from '@/styles/common';
import { IResponse } from '@/types';
import { IParsedProposal, IProposalsResponse } from '@/types/proposals';
import { setQueryAndRouter } from '@/utils';
import { getProposalNetworkParams } from '@/utils/networkFunctions';
import { CardContainer } from '@/views/proposals';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Proposals: React.FC = () => {
  const router = useRouter();
  const tableHeaders = ['Network Parameters', 'Proposals'];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const requestProposals = async (
    page: number,
    limit: number,
  ): Promise<IResponse> => {
    const { status } = router.query;
    const proposals: IProposalsResponse = await api.get({
      route: `proposals/list?status=${
        status || ''
      }&page=${page}&limit=${limit}`,
    });

    let parsedProposalResponse: any[] = [];
    parsedProposalResponse = parseAllProposals(proposals?.data?.proposals);
    return { ...proposals, data: { proposals: parsedProposalResponse } };
  };

  useEffect(() => {
    if (!router.isReady) return;
    setQueryAndRouter({ ...router.query }, router);
    setSelectedTab((router.query.tab as string) || tableHeaders[0]);
  }, [router.isReady]);

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
        return <NetworkParams />;
      case 'Proposals':
        return (
          <>
            <ProposalsTab request={requestProposals} />
          </>
        );
      default:
        return <div />;
    }
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header),
        setQueryAndRouter({ ...router.query, tab: header }, router);
    },
  };

  return (
    <Container>
      <Header>
        <Title title="Proposals" Icon={Icon} />
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

export default Proposals;
