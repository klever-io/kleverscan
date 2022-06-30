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

import { IProposal, IProposalsResponse } from '@/types/index';

interface IProposalsPage {
  networkParams: INetworkParams;
  proposals: IProposal[];
  totalProposalsPage: number;
}

interface IProposalsMessages {
  FeePerDataByte: string;
  KAppFeeCreateValidator: string;
  KAppFeeCreateAsset: string;
  MaxEpochsUnclaimed: string;
  MinSelfDelegatedAmount: string;
  MinTotalDelegatedAmount: string;
  BlockRewards: string;
  StakingRewards: string;
  KAppFeeTransfer: string;
  KAppFeeAssetTrigger: string;
  KAppFeeValidatorConfig: string;
  KAppFeeFreeze: string;
  KAppFeeUnfreeze: string;
  KAppFeeDelegate: string;
  KAppFeeUndelegate: string;
  KAppFeeWithdraw: string;
  KAppFeeClaim: string;
  KAppFeeUnjail: string;
  KAppFeeSetAccountName: string;
  KAppFeeProposal: string;
  KAppFeeVote: string;
  KAppFeeConfigITO: string;
  KAppFeeSetITOPrices: string;
  KAppFeeBuy: string;
  KAppFeeSell: string;
  KAppFeeCancelMarketOrder: string;
  KAppFeeCreateMarketplace: string;
  KAppFeeConfigMarketplace: string;
  KAppFeeUpdateAccountPermission: string;
  MaxNFTMintBatch: string;
  MinKFIStakedToEnableProposals: string;
  MinKLVBucketAmount: string;
  MaxBucketSize: string;
  LeaderValidatorRewardsPercentage: string;
  ProposalMaxEpochsDuration: string;
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
  const [proposals, setProposals] = useState(defaultProposals);

  const fetchData = async () => {
    setLoadingProposals(true);

    const proposals: IProposalsResponse = await api.get({
      route: `proposals/list'${page}`,
    });

    if (!proposals.code) {
      const mapProposals: IProposal[] = proposals.data.proposals.map(
        (proposal: IProposal, index: number) => {
          return {
            proposalId: proposal.proposalId,
            proposalStatus: proposal.proposalStatus,
            parameter: proposal.parameter,
            value: proposal.value,
            description: proposal.description,
            epochStart: proposal.epochStart,
            epochEnd: proposal.epochEnd,
            votes: proposal.voters[index].amount,
            voters: proposal.voters,
            proposer: proposal.proposer,
            txHash: proposal.txHash,
            createdDate: proposal.createdDate,
            endedDate: proposal.endedDate,
          };
        },
      );
      setProposals(mapProposals);
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
            <ProposalsTab
              proposalParams={proposals}
              loading={loadingProposals}
            />
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

export const getServerSideProps: GetServerSideProps<IProposalsPage> = async ({
  params,
}) => {
  const { data } = await api.get({ route: 'network/network-parameters' });
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });

  const maxVotesInfo: any = await api.get({
    route: 'assets/KFI',
  });

  proposalResponse.data?.proposals?.forEach((item: IProposal) => {
    item.totalStaked = maxVotesInfo.data?.asset?.staking?.totalStaked / 1000000;
  });

  const proposalsMessages: IProposalsMessages = {
    FeePerDataByte: 'Fee Per Data Byte',
    KAppFeeCreateValidator: 'KApp Fee for Validator Creation',
    KAppFeeCreateAsset: 'KApp Fee for Asset Creation',
    MaxEpochsUnclaimed: 'Max Epochs to clear unclaimed',
    MinSelfDelegatedAmount: 'Min Self Delegation Amount',
    MinTotalDelegatedAmount: 'Min Total Delegation Amount',
    BlockRewards: 'Block Rewards',
    StakingRewards: 'Staking Rewards',
    KAppFeeTransfer: 'KApp Fee for Transfer',
    KAppFeeAssetTrigger: 'KApp Fee for Asset Trigger',
    KAppFeeValidatorConfig: 'KApp Fee for Validator Config',
    KAppFeeFreeze: 'KApp Fee for Freeze',
    KAppFeeUnfreeze: 'KApp Fee for Unfreeze',
    KAppFeeDelegate: 'KApp Fee for Delegation',
    KAppFeeUndelegate: 'KApp Fee for Undelegate',
    KAppFeeWithdraw: 'KApp Fee for Withdraw',
    KAppFeeClaim: 'KApp Fee for Claim',
    KAppFeeUnjail: 'KApp Fee for Unjail',
    KAppFeeSetAccountName: 'KApp Fee for Account Name',
    KAppFeeProposal: 'KApp Fee for Proposal',
    KAppFeeVote: 'KApp Fee for Vote',
    KAppFeeConfigITO: 'KApp Fee for Config ITO',
    KAppFeeSetITOPrices: 'KApp Fee for Set ITO Prices',
    KAppFeeBuy: 'KApp Fee for Buy',
    KAppFeeSell: 'KApp Fee for Sell',
    KAppFeeCancelMarketOrder: 'KApp Fee for Cancel Market Order',
    KAppFeeCreateMarketplace: 'KApp Fee for Marketplace Creation',
    KAppFeeConfigMarketplace: 'KApp Fee for Config Marketplace',
    KAppFeeUpdateAccountPermission: 'KApp Fee for Update Account Permission',
    MaxNFTMintBatch: 'Max NFT Mint per batch',
    MinKFIStakedToEnableProposals: 'Min KFI staked to enable Proposals Kapps',
    MinKLVBucketAmount: 'Min KLV Bucket Amount',
    MaxBucketSize: 'Max bucket size',
    LeaderValidatorRewardsPercentage: 'Leader Validator rewards percentage',
    ProposalMaxEpochsDuration: 'Max Epochs for active proposal duration',
  };

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
    proposals: proposalResponse.data?.proposals || [],
    totalProposalsPage: proposalResponse?.pagination?.totalPages || 0,
  };

  return { props };
};

export default Proposals;
