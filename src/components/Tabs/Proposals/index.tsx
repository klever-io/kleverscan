import React from 'react';

import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { Proposer, Row } from './styles';

import { getStatusIcon } from '@/assets/status';
import { format, fromUnixTime } from 'date-fns';
import { ProgressContent } from '@/views/proposals';
import { PercentIndicator, StakedIndicator } from './styles';
import Link from 'next/link';

interface IProposalsProps {
  proposalParams: IProposals;
  loading: boolean;
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

const Proposals: React.FC<IProposalsProps> = ({ proposalParams, loading }) => {
  const TableBody: React.FC<IProposal> = ({
    proposalId,
    description,
    epochStart,
    epochEnd,
    proposalStatus,
  }) => {
    const StatusIcon = getStatusIcon(proposalStatus);

    const stakedPercent = 50;

    return (
      <Row type="proposals">
        <span>
          <p>#{proposalId}</p>
        </span>
        <span>
          <p>{description}</p>
          <Proposer>Proposer</Proposer>
          <Link href=""></Link>
        </span>
        <span>
          <small>
            Start: {format(fromUnixTime(epochStart / 1000), 'MM/dd/yyyy HH:mm')}
          </small>{' '}
          <p />
          <small>
            End: {format(fromUnixTime(epochEnd / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>
          <p>2000000\123456789</p>
          <ProgressContent>
            <StakedIndicator percent={stakedPercent} />
            <PercentIndicator percent={stakedPercent}>
              {stakedPercent}%
            </PercentIndicator>
          </ProgressContent>
        </span>
        <Status status={proposalStatus}>
          <StatusIcon />
          <span>{proposalStatus}</span>
        </Status>
        <span>
          <Link href={`/proposal/${proposalId}`}>Details</Link>
        </span>
      </Row>
    );
  };

  const header = [
    'Number',
    'ProposalContent',
    'Time',
    'Upvotes/TotalStaked',
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
