import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { toLocaleFixed } from '@/utils/index';

import {
  CardContainer,
  CardContent,
  Container,
  Header,
  Title,
  Input,
  Row,
  HoverLink,
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
  RowContent,
  BalanceContainer,
  NetworkParamsContainer,
} from '@/views/proposals/detail';

import { ArrowLeft } from '@/assets/icons';
import { Status } from '@/components/Table/styles';
import { getStatusIcon } from '@/assets/status';
import { format, fromUnixTime } from 'date-fns';
import Table, { ITable } from '@/components/Table';
import { Row as TableRow } from '@/components/Table/styles';
import { formatAmount, typeVoteColors } from '@/utils/index';
import api from '@/services/api';
import { IRawParam, IFullInfoParam } from '@/types/index';

import { AiFillCheckCircle } from 'react-icons/ai';

import Tooltip from '../../components/Tooltip';
import Link from 'next/link';
import { NetworkParamsIndexer } from '@/types/index';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';

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
  totalStaked?: number;
  votingPowers?: any;
  timestampStart: number;
  timestampEnd: number;
  parameters: { [key: string]: string };
  fullParameters: IFullInfoParam[];
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
  votingPower: string;
  voteDate: string;
  status: string;
}

const ProposalDetails: React.FC<IProposal> = props => {
  const [status, setStatus] = useState('');
  const StatusIcon = getStatusIcon(status);
  const router = useRouter();
  const precision = 10 ** 6;
  const proposalAPI: IProposal = props;
  const { votingPowers, totalStaked } = proposalAPI;
  const [filterVoters, setFilterVoters] = useState({
    Yes: 0,
    No: 0,
  });

  const [votedQty, setVotedQty] = useState(0);
  const [votersList, setVotersList] = useState<IVoter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Yes');
  const [votesPercentage, setVotesPercentage] = useState('');

  useEffect(() => {
    if (totalStaked) {
      let percentage = (votedQty * 100) / (totalStaked / precision);
      if (percentage < 0.01) {
        percentage = 0;
      }
      setVotesPercentage(percentage.toFixed(2));
    }
  }, [totalStaked, votedQty]);

  useEffect(() => {
    if (proposalAPI.proposalStatus) {
      setStatus(proposalAPI.proposalStatus);
    }

    const list: IVoter[] = [];
    let tempVotedQty = 0;
    const tempFilterVoters = {
      Yes: 0,
      No: 0,
    };

    Object.keys(proposalAPI.voters ? proposalAPI.voters : []).map(
      async item => {
        if (totalStaked) {
          const votesInfo = proposalAPI.voters[item];
          const frozenBalance = votingPowers[item];
          list.push({
            voter: item,
            votingPower: ((frozenBalance * 100) / totalStaked).toFixed(2),
            voteDate: format(
              fromUnixTime(votesInfo.timestamp / 1000),
              'MM/dd/yyyy HH:mm',
            ),
            status: votesInfo.type === 0 ? 'Yes' : 'No',
          });

          const typeVote = proposalAPI.voters[item].type;
          const qtyVote = votesInfo.amount / 1000000;

          switch (typeVote) {
            case 0:
              tempFilterVoters['Yes'] += qtyVote;
              tempVotedQty += qtyVote;

              break;

            case 1:
              tempFilterVoters['No'] += qtyVote;
              tempVotedQty += qtyVote;
              break;

            default:
              break;
          }
        }
      },
    );

    setVotedQty(tempVotedQty);
    setVotersList(list);
    setFilterVoters(tempFilterVoters);
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

  const renderProposalParams = () => {
    return proposalAPI?.fullParameters.map(param => (
      <div key={param.paramIndex}>
        <strong>{param.paramText}</strong>
        <span>{param.paramValue}</span>
      </div>
    ));
  };

  const Progress: React.FC = () => {
    return (
      <ProgressBar>
        {Object.keys(filterVoters).map((item: any, key: number) => {
          if (totalStaked) {
            let percentageCard = (
              (filterVoters[item] * 100) /
              (totalStaked / precision)
            ).toString();
            if (Number(percentageCard) < 0.01) {
              percentageCard = '0';
            }
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
            <Link href={`/account/${voter}`}>
              <HoverLink>
                <small>{voter}</small>
              </HoverLink>
            </Link>
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
                <span style={{ marginRight: '0.2rem' }}>
                  <Link href={`/account/${proposalAPI.proposer}`}>
                    <HoverLink>
                      <p>{proposalAPI.proposer}</p>
                    </HoverLink>
                  </Link>
                </span>
                <Tooltip
                  msg={
                    'Always check the address. Names can be the same across multiple addresses.'
                  }
                />
              </Row>
              <Row>
                <span>
                  <strong>Hash</strong>
                </span>
                <Link href={`/transaction/${proposalAPI.txHash}`}>
                  <HoverLink>{proposalAPI.txHash}</HoverLink>
                </Link>
              </Row>
              <Row>
                <span>
                  <strong>Created Epoch:</strong>
                </span>
                <span>
                  <DateContainer>
                    <small>{proposalAPI.epochStart}</small>
                  </DateContainer>
                </span>
                <span>
                  <strong>Ended Epoch:</strong>
                </span>
                <span>
                  <EndedDate>{proposalAPI.epochEnd}</EndedDate>
                </span>
              </Row>
              <Row>
                <span>
                  <strong>Network Parameters</strong>
                </span>
                <RowContent>
                  <BalanceContainer>
                    <NetworkParamsContainer>
                      {renderProposalParams()}
                    </NetworkParamsContainer>
                  </BalanceContainer>
                </RowContent>
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
                {toLocaleFixed(votedQty, 6)} ({votesPercentage}%)
              </span>
            </VotesHeader>

            <ProgressBarVotes>
              <PassThresholdContainer>
                <PassThresholdContainer>
                  <PassThresholdText>Pass threshold</PassThresholdText>
                  <VerticalLine />
                </PassThresholdContainer>
                <Progress />
              </PassThresholdContainer>
              {totalStaked ? (
                <span>
                  Voted: {formatAmount(votedQty)} /{' '}
                  {formatAmount(totalStaked / precision)}
                </span>
              ) : null}
            </ProgressBarVotes>

            <CardVoteContainer>
              {filterVoters &&
                Object.keys(filterVoters).map((item: any, key: number) => {
                  if (totalStaked) {
                    let percentageCard =
                      (filterVoters[item] * 100) / (totalStaked / precision);
                    if (percentageCard < 0.01) {
                      percentageCard = 0;
                    }

                    return (
                      <CardVote key={key} color={typeVoteColors[item]}>
                        <span>{item}</span>
                        <PercentageText>
                          {percentageCard.toFixed(2)}%
                        </PercentageText>
                        <QtyVotesText>
                          {toLocaleFixed(filterVoters[item], 6)}
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

          {filterVoters[selectedFilter] ? (
            <Table {...tableProps} />
          ) : (
            <Table {...{ ...tableProps, data: [] }} />
          )}
        </Container>
      ) : null}
    </>
  );
};

const getVotingPowers = async (voters: any, powers: any) => {
  if (!voters) {
    voters = [];
  }

  Object.entries(voters).forEach(async ([address, data]: any[]) => {
    powers[address] = data?.amount;
  });
};

const getProposalNetworkParams = (params: IRawParam): IFullInfoParam[] => {
  if (params) {
    const fullInfoParams: IFullInfoParam[] = Object.entries(params).map(
      ([index, value]) => ({
        paramIndex: index,
        paramLabel: NetworkParamsIndexer[index],
        paramValue: Number(value),
        paramText: proposalsMessages[NetworkParamsIndexer[index]],
      }),
    );

    return fullInfoParams;
  }
  return [];
};

export const getServerSideProps: GetStaticProps<IProposal> = async ({
  params,
}) => {
  const proposalInfos: any = await api.get({
    route: `proposals/${params?.number}`,
  });
  const votingPowers: any = {};
  getVotingPowers(proposalInfos?.data?.proposal?.voters, votingPowers);
  let props = proposalInfos?.data?.proposal;
  if (!props) {
    props = {};
  }

  props.votingPowers = votingPowers;
  const paramsWithText = getProposalNetworkParams(props.parameters);
  props.fullParameters = paramsWithText;
  return { props };
};

export default ProposalDetails;
