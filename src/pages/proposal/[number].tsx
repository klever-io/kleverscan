import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';

import {
  CardContainer,
  CardContent,
  Container,
  Header,
  Title,
  Input,
  Row,
  HashText,
  EndedDate,
  CardVoteContainer,
  CardVote,
  PercentageText,
  QtyVotesText,
  OptionValidator,
  ProgressBar,
  VotesContainer,
  StatusContent,
  VotesHeader,
  ProgressBarVotes,
  ValidatorsContainer,
  FiltersValidators,
  VerticalLine,
  ProgressBarContent,
  PassThresholdContainer,
  PassThresholdText,
  DateContainer,
} from '@/views/proposals/detail';

import { ArrowLeft } from '@/assets/icons';
import { Status } from '@/components/Table/styles';
import { getStatusIcon } from '@/assets/status';
import { format, fromUnixTime } from 'date-fns';
import Table, { ITable } from '@/components/Table';
import { Row as TableRow } from '@/components/Table/styles';
import { addCommasToNumber, formatAmount, typeVoteColors } from '@/utils/index';
import api from '@/services/api';
import { Service } from '@/types/index';

import { AiFillCheckCircle } from 'react-icons/ai';

import Tooltip from '../../components/Tooltip';
import Link from 'next/link';

interface IProposalPage {
  proposal: IProposal;
}

interface IProposal {
  proposalId?: number;
  proposalStatus?: string;
  parameter?: string;
  value?: string;
  description?: string;
  epochStart: number;
  epochEnd: number;
  votes?: number;
  voters?: any;
  txHash?: string;
  proposer?: string;
  code?: string;
  maxVotes?: number;
  votingPowers?: any;
  timestampStart: number;
  timestampEnd: number;
}

interface IVote {
  status: string;
  validator: string;
  votingPower: string;
  voteDate: string;
  voter: string;
}

interface IVoter {
  voter: string;
  votingPower: number;
  voteDate: string;
  status: string;
}

const ProposalDetails: React.FC<IProposal> = props => {
  const [status, setStatus] = useState('');
  const StatusIcon = getStatusIcon(status);
  const router = useRouter();
  const proposalAPI: IProposal = props;

  const { votingPowers, maxVotes } = proposalAPI;

  const [filterVoters, setFilterVoters] = useState({
    Yes: 0,
    No: 0,
  });

  const [votedQty, setVotedQty] = useState(0);
  const [votersList, setVotersList] = useState<IVoter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Yes');
  const [votesPercentage, setVotesPercentage] = useState('');

  const stakedPercent = 50;

  useEffect(() => {
    if (maxVotes) {
      const percentage = ((votedQty * 100) / maxVotes).toString();
      setVotesPercentage(parseFloat(percentage).toPrecision(4));
    }
  }, [maxVotes, votedQty]);

  useEffect(() => {
    if (proposalAPI.proposalStatus) {
      setStatus(proposalAPI.proposalStatus);
    }

    Object.keys(proposalAPI.voters).map(async item => {
      if (maxVotes) {
        const list: IVoter[] = [...votersList];
        const votesInfo = proposalAPI.voters[item];

        const frozenBalance = votingPowers[item];

        list.push({
          voter: item,
          votingPower: (frozenBalance * 100) / maxVotes,
          voteDate: format(
            fromUnixTime(votesInfo.timestamp / 1000),
            'MM/dd/yyyy HH:mm',
          ),
          status: votesInfo.type === 0 ? 'Yes' : 'No',
        });

        setVotersList(list);

        const typeVote = proposalAPI.voters[item].type;
        const filters = { ...filterVoters };
        const qtyVote = votesInfo.amount / 1000000;
        switch (typeVote) {
          case 0:
            filters['Yes'] += qtyVote;
            setVotedQty(votedQty + qtyVote);
            setFilterVoters({ ...filters });
            break;

          case 1:
            filters['No'] += qtyVote;
            setVotedQty(votedQty + qtyVote);
            setFilterVoters({ ...filters });
            break;

          default:
            break;
        }
      }
    });
  }, []);

  const getQtyStatus = (status: string) => {
    let qtyStatus = 0;

    votersList.forEach((item: any) => {
      if (item.status === status) {
        qtyStatus += 1;
      }
    });

    return qtyStatus;
  };

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    return (
      <ProgressBar>
        {Object.keys(filterVoters).map((item: any, key: number) => {
          if (maxVotes) {
            let percentageCard = (
              (filterVoters[item] * 100) /
              maxVotes
            ).toString();
            if (percentageCard.split('.').length > 0) {
              percentageCard = parseFloat(percentageCard).toPrecision(4);
            }

            return (
              <ProgressBarContent
                key={key}
                widthPercentage={percentageCard}
                background={typeVoteColors[item]}
              />
            );
          }
        })}
      </ProgressBar>
    );
  };

  const TableBody: React.FC<IVote> = props => {
    const { status, voter, votingPower, voteDate } = props;
    if (status === selectedFilter) {
      return (
        <TableRow type="votes">
          <span>
            <small>{voter}</small>
          </span>
          <span>
            <p>{votingPower}%</p>
          </span>
          <span>
            <StatusContent>
              <AiFillCheckCircle
                color={typeVoteColors[status]}
                size={18}
                style={{ marginRight: 5 }}
              />
              <small>{voteDate}</small>
            </StatusContent>
          </span>
        </TableRow>
      );
    }

    return <></>;
  };

  const tableProps: ITable = {
    header: ['Voter', 'Voting Power', 'Vote date'],
    loading: false,
    type: 'votes',
    body: TableBody,
    data: votersList,
  };

  return (
    <>
      {proposalAPI ? (
        <Container>
          <Header>
            <Title>
              <div onClick={() => router.push('/proposals')}>
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
                  <h2>Proposal #{proposalAPI.proposalId}</h2>
                </span>
                <Status status={status}>
                  <StatusIcon />
                  <span>
                    {status === 'ApprovedProposal' ? 'Effective' : status}
                  </span>
                </Status>
              </Row>
              <Row>
                <span>
                  <strong>Proposer </strong>
                </span>
                <span>
                  <p>{proposalAPI.proposer}</p>
                </span>
                <Tooltip
                  msg={
                    'Always check the address. Names can be the same across multiple addresses.'
                  }
                />
              </Row>
              <Row>
                <span>
                  <strong>Proposal Content</strong>
                </span>
                <span>{proposalAPI.description}</span>
              </Row>
              <Row>
                <span>
                  <strong>Created Epoch:</strong>
                </span>
                <span>
                  <DateContainer>
                    <small>{proposalAPI.epochStart}</small>
                    <Tooltip
                      msg={`Epoch start at ${format(
                        proposalAPI.timestampStart,
                        'MM/dd/yyyy HH:mm',
                      )}`}
                    />
                  </DateContainer>
                </span>
                <span>
                  <strong>Ended Epoch:</strong>
                </span>
                <span>
                  <EndedDate>
                    {proposalAPI.epochEnd}
                    <Tooltip
                      msg={`Epoch start at ${format(
                        fromUnixTime(proposalAPI.timestampEnd),
                        'MM/dd/yyyy HH:mm',
                      )}`}
                    />
                  </EndedDate>
                </span>
              </Row>
              <Row>
                <span>
                  <strong>Hash</strong>
                </span>
                <Link href={`/transaction/${proposalAPI.txHash}`}>
                  <a>
                    <HashText>
                      <a>{proposalAPI.txHash}</a>
                    </HashText>
                  </a>
                </Link>
              </Row>
            </CardContent>
          </CardContainer>

          <VotesContainer>
            <span>
              <h3>Votes</h3>
            </span>

            <VotesHeader>
              <strong>Total Voted</strong>
              <span>
                {addCommasToNumber(votedQty)} ({votesPercentage}%)
              </span>
            </VotesHeader>

            <ProgressBarVotes>
              <PassThresholdContainer>
                <PassThresholdContainer>
                  <PassThresholdText>Pass threshold</PassThresholdText>
                  <VerticalLine />
                </PassThresholdContainer>
                <Progress percent={stakedPercent} />
              </PassThresholdContainer>
              {maxVotes ? (
                <span>
                  Voted: {formatAmount(votedQty)} / {formatAmount(maxVotes)}
                </span>
              ) : null}
            </ProgressBarVotes>

            <CardVoteContainer>
              {filterVoters &&
                Object.keys(filterVoters).map((item: any, key: number) => {
                  if (maxVotes) {
                    let percentageCard = (
                      (filterVoters[item] * 100) /
                      maxVotes
                    ).toString();

                    if (percentageCard.split('.').length > 0) {
                      percentageCard =
                        parseFloat(percentageCard).toPrecision(4);

                      if (Number(percentageCard.split('.')[1]) === 0) {
                        percentageCard = percentageCard.split('.')[0];
                      }
                    }

                    return (
                      <CardVote key={key} color={typeVoteColors[item]}>
                        <span>{item}</span>
                        <PercentageText>{percentageCard}%</PercentageText>
                        <QtyVotesText>
                          {addCommasToNumber(filterVoters[item])}
                        </QtyVotesText>
                      </CardVote>
                    );
                  }
                })}
            </CardVoteContainer>
          </VotesContainer>

          <ValidatorsContainer>
            <div>
              <span>
                <h1>Voters</h1>
              </span>
              <FiltersValidators>
                {Object.keys(filterVoters).map((item, key) => {
                  return (
                    <OptionValidator
                      key={key}
                      onClick={() => setSelectedFilter(item)}
                      selected={selectedFilter === item}
                    >
                      <strong>
                        {item} ({getQtyStatus(item)})
                      </strong>
                    </OptionValidator>
                  );
                })}
              </FiltersValidators>
            </div>
          </ValidatorsContainer>

          <Table {...tableProps} />
        </Container>
      ) : null}
    </>
  );
};

const getVotingPowers = async (voters: any, powers: any) => {
  const votingPowers = Object.keys(voters).map(async address => {
    const addressInfos: any = await api.get({
      route: `address/${address}`,
    });

    if (addressInfos?.data) {
      const { frozenBalance } = addressInfos.data.account?.assets?.KFI;
      powers[address] = frozenBalance / 1000000;
    }
  });

  return Promise.allSettled(votingPowers);
};

export const getServerSideProps: GetStaticProps<IProposal> = async ({
  params,
}) => {
  const maxVotesInfo: any = await api.get({
    route: 'assets/KFI',
  });

  const proposalInfos: any = await api.get({
    route: `proposals/${params?.number}`,
  });

  const votingPowers: any = {};

  await getVotingPowers(proposalInfos.data?.proposal?.voters, votingPowers);

  const props = proposalInfos.data.proposal;
  props.maxVotes = maxVotesInfo.data?.asset?.staking?.totalStaked / 1000000;
  props.votingPowers = votingPowers;

  let metrics = await api.get({
    route: 'node/metricsjson',
    service: Service.NODE,
  });

  metrics = metrics.data.metrics;

  const timestampStart =
    metrics.klv_start_time * 1000 +
    props.epochStart * metrics.klv_slots_per_epoch * metrics.klv_slot_duration;
  const timestampEnd =
    metrics.klv_start_time * 1000 +
    props.epochEnd * metrics.klv_slots_per_epoch * metrics.klv_slot_duration;

  props.timestampStart = timestampStart;
  props.timestampEnd = timestampEnd;

  return { props };
};

export default ProposalDetails;
