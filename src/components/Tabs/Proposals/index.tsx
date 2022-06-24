import React from 'react';

import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';
import {
  Proposer,
  ProposalStatus,
  ProposerDescAndLink,
  UpVotes,
  PercentIndicator,
  StakedIndicator,
  Description,
} from './styles';

import { getStatusIcon } from '@/assets/status';
import { format, fromUnixTime } from 'date-fns';
import { ProgressContent } from '@/views/proposals';
import Link from 'next/link';

import { IProposal } from '@/types/index';
import { capitalizeString, parseAddress } from '@/utils/index';

interface IProposalsProps {
  proposalParams: IProposals;
  loading: boolean;
}

interface IProposals {
  [index: number]: IProposal;
}

const Proposals: React.FC<IProposalsProps> = ({ proposalParams, loading }) => {
  const TableBody: React.FC<IProposal> = props => {
    const {
      proposalId,
      description,
      epochStart,
      epochEnd,
      proposalStatus,
      proposer,
      totalStaked,
      votes,
    } = props;
    const StatusIcon = getStatusIcon(proposalStatus);

    return (
      <>
        <Row type="proposals">
          <span>
            <p>#{proposalId}</p>
          </span>
          <ProposerDescAndLink>
            <Description>{description || ' - '}</Description>
            <Proposer>Proposer</Proposer>
            <Link href={`/account/${proposer}`}>
              <a>{parseAddress(proposer, 8)}</a>
            </Link>
          </ProposerDescAndLink>
          <span>
            <small>Created Epoch: {epochStart}</small> <p />
            <small className="endTime">Ended Epoch: {epochEnd}</small>
          </span>
          <UpVotes>
            <p>
              {votes['0'] / 1000000}\{totalStaked}
            </p>
          </UpVotes>
          <Status status={proposalStatus}>
            <StatusIcon />
            <ProposalStatus>{capitalizeString(proposalStatus)}</ProposalStatus>
          </Status>
          <span>
            <Link href={{ pathname: `/proposal/${proposalId}` }}>
              <a>Details</a>
            </Link>
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
