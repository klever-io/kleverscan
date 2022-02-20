import React, { useState, Component } from 'react';

import { useRouter } from 'next/router';
import { IconHelp } from '../../assets/help';
import { GetStaticProps } from 'next';

import {
  CardContainer,
  CardContent,
  Container,
  Header,
  Title,
  Input,
  Row,
  CenteredRow,
  ProgressContent,
} from '@/views/proposals/detail';

import { ArrowLeft, Copy } from '@/assets/icons';
import { format, fromUnixTime } from 'date-fns';
import { Status } from '@/components/Table/styles';
import { getStatusIcon } from '@/assets/status';
import Table, { ITable } from '@/components/Table';
import { Row as TableRow } from '@/components/Table/styles';
import { PercentIndicator, StakedIndicator } from '@/views/proposals/detail';
import { ProgressContainer } from '@/views/proposals/detail';
import Link from 'next/link';

import Tooltip from '../../components/Tooltip';

interface IProposalPage {
  proposal: IProposal;
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

const ProposalDetails: React.FC<IProposalPage> = ({
  proposal: defaultProposal,
}) => {
  const [status, setStatus] = useState('success');
  const StatusIcon = getStatusIcon(status);
  const router = useRouter();

  const header = ['Address', 'Votes', 'Vote Date'];
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState(defaultProposal);

  const stakedPercent = 50;
  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    return (
      <ProgressContainer>
        <ProgressContent>
          <StakedIndicator percent={stakedPercent} />
          <PercentIndicator percent={stakedPercent}>
            {stakedPercent}%
          </PercentIndicator>
        </ProgressContent>
      </ProgressContainer>
    );
  };

  const TableBody: React.FC<IVote> = ({ address, amount }) => {
    return (
      <TableRow type="votes">
        <span>
          <Link href={`/address/${address}`}>{address}</Link>
        </span>
        <span>
          <p>{amount}</p>
        </span>
        <span>
          <small>
            {format(fromUnixTime(+new Date() / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
      </TableRow>
    );
  };

  const tableProps: ITable = {
    body: TableBody,
    data: proposal.voters as any[],
    header,
    loading,
    type: 'votes',
  };

  return (
    <>
      <Container>
        <Header>
          <Title>
            <div onClick={router.back}>
              <ArrowLeft />
            </div>
            <h1>Proposal Details</h1>
          </Title>
          <Input />
        </Header>

        <CardContainer>
          <CardContent>
            <Row>
              <span>
                <h2>Proposal #{proposal.proposalId}</h2>
              </span>
              <Status status={status}>
                <StatusIcon />
                <span>{status}</span>
              </Status>
            </Row>
            <Row>
              <span>
                <strong>Proposer </strong>
              </span>
              <span>
                <p>proposer</p>
              </span>
              <Tooltip msg="Always check the address. Names can be the same across multiple addresses." />
            </Row>
            <Row>
              <span>
                <strong>Proposal Content</strong>
              </span>
              <span>{proposal.description}</span>
            </Row>
            <Row>
              <span>
                <strong>Created:</strong>
              </span>
              <span>
                <small>
                  {format(fromUnixTime(+new Date() / 1000), 'MM/dd/yyyy HH:mm')}
                </small>
              </span>
              <span>
                <strong>Ended:</strong>
              </span>
              <span>
                <small>
                  {format(fromUnixTime(+new Date() / 1000), 'MM/dd/yyyy HH:mm')}
                </small>
              </span>
            </Row>
            <Row>
              <span>
                <strong>Hash</strong>
              </span>
              <CenteredRow>
                <span>hash</span>
              </CenteredRow>
            </Row>
          </CardContent>
        </CardContainer>

        <CardContainer>
          <Row className="votes">
            <span>
              <h2>Votes</h2>
            </span>
            <span>
              <small>Upvotes {proposal.votes} / Total Staked 20000</small>
            </span>
            <Tooltip msg="Always check the address. Names can be the same across multiple addresses." />
            <Progress percent={stakedPercent} />
          </Row>
        </CardContainer>
        <Table {...tableProps} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetStaticProps<IProposalPage> = async ({
  params,
}) => {
  const props: IProposalPage = {
    proposal: { voters: [] as IVote[] } as IProposal,
  };

  return { props };
};
export default ProposalDetails;
