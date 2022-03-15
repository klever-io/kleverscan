import React from 'react';

import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { Proposer,
  Row,
  ProposalStatus,
  ProposerDescAndLink,
  UpVotes,
  PercentIndicator, StakedIndicator
} from './styles';

import { getStatusIcon } from '@/assets/status';
import { format, fromUnixTime } from 'date-fns';
import { ProgressContent } from '@/views/proposals';
import Link from 'next/link';

import { IProposal } from '@/types/index'
import { parseAddress } from '@/utils/index';

interface IProposalsProps {
  proposalParams: IProposals;
  loading: boolean;
}

interface IProposals {
  [index: number]: IProposal;
}

const Proposals: React.FC<IProposalsProps> = ({ proposalParams, loading }) => {
  const TableBody: React.FC<IProposal> = ({
    proposalId,
    description,
    epochStart,
    epochEnd,
    proposalStatus,
    proposer
  }) => {
    const StatusIcon = getStatusIcon(proposalStatus);

    const stakedPercent = 50;

    return (
      <>
        <Row type="proposals">
          <span>
            <p>#{proposalId}</p>
          </span>
          <ProposerDescAndLink>
            <p>{description || ' - '}</p>
            <Proposer>Proposer</Proposer>
            <Link href="/">{parseAddress(proposer)}</Link>
          </ProposerDescAndLink>
          <span>
            <small>
            Start: {format(fromUnixTime(epochStart / 1000), 'MM/dd/yyyy HH:mm')}
            </small>{' '}
            <p />
            <small className="endTime">
              End: {format(fromUnixTime(epochEnd / 1000), 'MM/dd/yyyy HH:mm')}
            </small>
          </span>
          <UpVotes>
            <p>2000000\123456789</p>
            <ProgressContent>
              <StakedIndicator percent={stakedPercent} />
              <PercentIndicator percent={stakedPercent}>
                {stakedPercent}%
              </PercentIndicator>
            </ProgressContent>
          </UpVotes>
          <Status status={proposalStatus}>
            <StatusIcon />
            <ProposalStatus>{proposalStatus}</ProposalStatus>
          </Status>
          <span>
            <Link href={`/proposal/${proposalId}`}>Details</Link>
          </span>
        </Row>
      </>
    );
  };

  const header = [
    'Number',
    'Proposal Content',
    'Time',
    'Upvotes/Total Staked',
    'Status',
    '',
  ];

  const tableProps: ITable = {
    body: TableBody,
    data: proposalParams as any[],
    loading: loading,
    header,
    type: 'proposals',
  };

  return <Table {...tableProps} />;
};

export default Proposals;
