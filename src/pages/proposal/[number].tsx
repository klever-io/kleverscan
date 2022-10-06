import { Copy } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import api from '@/services/api';
import {
  IAPINetworkParams,
  IFullInfoParam,
  INetworkParams,
  IParsedParams,
  IParsedProposal,
  IProposal,
  IRawParam,
  IVote,
  IVotingPowers,
  NetworkParamsIndexer,
} from '@/types/proposals';
import {
  formatAmount,
  parseAddress,
  toLocaleFixed,
  typeVoteColors,
} from '@/utils/index';
import {
  BalanceContainer,
  BigSpan,
  CardContainer,
  CardContent,
  CardVote,
  CardVoteContainer,
  Container,
  FiltersValidators,
  HalfRow,
  Header,
  HoverLink,
  Input,
  NetworkParamsContainer,
  OptionValidator,
  PassThresholdContainer,
  PassThresholdText,
  PercentageText,
  ProgressBar,
  ProgressBarContent,
  ProgressBarVotes,
  QtyVotesText,
  Row,
  RowContent,
  StatusContent,
  ValidatorsContainer,
  VerticalLine,
  VotesContainer,
  VotesHeader,
} from '@/views/proposals/detail';
import { CenteredRow } from '@/views/validators/detail';
import { format, fromUnixTime } from 'date-fns';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import Tooltip from '../../components/Tooltip';

interface IParsedVote {
  status: string;
  validator: string;
  votingPower: string;
  voteDate: string;
  voter: string;
}

interface IParsedVoter {
  voter: string;
  votingPower: string;
  voteDate: string;
  status: string;
}

const ProposalDetails: React.FC<IParsedProposal> = props => {
  const [status, setStatus] = useState('');
  const StatusIcon = getStatusIcon(status);
  const precision = 6;
  const proposalAPI: IParsedProposal = props;
  const { votingPowers, totalStaked, description, pagination } = proposalAPI;
  const [filterVoters, setFilterVoters] = useState({
    Yes: 0,
    No: 0,
  });
  const [filterVotersPerPagination, setFilterVotersPerPagination] = useState({
    Yes: 0,
    No: 0,
  });
  const [votedQty, setVotedQty] = useState(0);
  const [totalVoted, setTotalVoted] = useState(0);
  const [votersList, setVotersList] = useState<IParsedVoter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Yes');
  const [votesPercentage, setVotesPercentage] = useState('');

  useEffect(() => {
    if (totalStaked) {
      let percentage = (totalVoted * 100) / (totalStaked / 10 ** precision);
      if (percentage < 0.01) {
        percentage = 0;
      }
      setVotesPercentage(percentage.toFixed(2));
    }
  }, [totalStaked, votedQty]);

  const validateFormattedVotes = (votesApi = proposalAPI) => {
    const list: IParsedVoter[] = [];
    const votingPowersAdd = getVotingPowers(votesApi?.voters);
    votesApi?.voters?.forEach(voter => {
      if (totalStaked && votingPowersAdd) {
        const votesInfo = voter;
        const frozenBalance = votingPowersAdd[voter.address];
        list.push({
          voter: voter.address,
          votingPower: ((frozenBalance * 100) / totalStaked).toFixed(3),
          voteDate: format(
            fromUnixTime(votesInfo.timestamp / 1000),
            'MM/dd/yyyy HH:mm',
          ),
          status: votesInfo.type === 0 ? 'Yes' : 'No',
        });
      }
    });
    return list;
  };

  const voteCountPerPage = () => {
    let tempVotedQty = 0;
    const tempFilterVoters = {
      Yes: 0,
      No: 0,
    };
    proposalAPI.voters.forEach(voter => {
      const votesInfo = voter;
      const typeVote = voter.type;
      const qtyVote = votesInfo.amount / 1000000;

      switch (typeVote) {
        case 0:
          tempVotedQty += qtyVote;
          tempFilterVoters['Yes'] += 1;
          break;

        case 1:
          tempVotedQty += qtyVote;
          tempFilterVoters['No'] += 1;
          break;

        default:
          break;
      }
    });
    setFilterVotersPerPagination(tempFilterVoters);
    setVotedQty(tempVotedQty);
  };

  useEffect(() => {
    if (proposalAPI.proposalStatus) {
      setStatus(proposalAPI.proposalStatus);
    }
    const qtyVotesYes = Object.values(proposalAPI.votes)[0] / 10 ** 6 || 0;
    const qtyVotesNo = Object.values(proposalAPI.votes)[1] / 10 ** 6 || 0;
    const votesAmount = qtyVotesYes + qtyVotesNo;
    const tempFilterVoters = {
      Yes: qtyVotesYes,
      No: qtyVotesNo,
    };
    validateFormattedVotes();
    voteCountPerPage();
    setTotalVoted(votesAmount);
    setFilterVoters(tempFilterVoters);
  }, []);

  const getQtyStatus = useCallback(
    (status: string) => {
      let qtyStatus = 0;

      votersList.forEach((item: any) => {
        if (item.status === status) {
          qtyStatus += 1;
        }
      });

      return qtyStatus;
    },
    [votersList],
  );

  const filterVotersList = (type: string) => {
    return votersList.filter(vote => vote.status === type);
  };

  const renderProposalParams = useCallback(() => {
    return proposalAPI?.parsedParameters.map(param => (
      <div key={param.paramIndex}>
        <strong>{param.paramText}</strong>
        <span>{param.paramValue}</span>
        <p>
          Current Value:{' '}
          {props?.currentNetworkParams?.[param.paramText]?.currentValue}
        </p>
      </div>
    ));
  }, [proposalAPI]);

  const Progress: React.FC = () => {
    return (
      <ProgressBar>
        {Object.keys(filterVoters).map((item: any, key: number) => {
          if (totalStaked) {
            let percentageCard = (
              (filterVoters[item] * 100) /
              (totalStaked / 10 ** precision)
            ).toString();
            if (Number(percentageCard) < 0.01) {
              percentageCard = '0';
            }
            if (percentageCard?.split('.').length > 0) {
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

  const rowSections = (vote: IParsedVote): JSX.Element[] => {
    const { status, voter, votingPower, voteDate } = vote;

    let sections = [<></>];
    if (status === selectedFilter) {
      sections = [
        <CenteredRow key={voter}>
          <Link href={`/account/${voter}`}>{parseAddress(voter, 24)}</Link>
          <Copy data={voter} info="voter"></Copy>
        </CenteredRow>,
        <p key={votingPower}>{votingPower}%</p>,
        <StatusContent key={status}>
          <AiFillCheckCircle
            color={typeVoteColors[status]}
            size={18}
            style={{ marginRight: 5 }}
          />
          <small>{voteDate}</small>
        </StatusContent>,
      ];
    }

    return sections;
  };

  const requestVoters = async (page: number) => {
    const voters = await api.get({
      route: `proposals/${proposalAPI.proposalId}?pageVoters=${page}`,
    });
    if (voters.error) {
      return {
        data: { voters: [] },
        pagination: {
          self: 0,
          next: 0,
          previous: 0,
          perPage: 0,
          totalPages: 0,
          totalRecords: 0,
        },
      };
    }
    const parsedVotersResponse = voters?.data?.proposal;
    const votesFormatted = validateFormattedVotes(parsedVotersResponse);
    setVotersList(votesFormatted);
    return {
      data: { voters: votesFormatted },
      pagination: voters.data?.proposal?.votersPage,
    };
  };

  const tableProps: ITable = {
    header: ['Voter', 'Voting Power', 'Vote date'],
    type: 'votes',
    rowSections,
    columnSpans: [2, 1, 1],
    data: votersList,
    totalPages: pagination?.totalPages,
    scrollUp: false,
    request: requestVoters,
    dataName: 'voters',
  };

  const tablePropsYes = { ...tableProps, data: filterVotersList('Yes') };
  const tablePropsNo = { ...tableProps, data: filterVotersList('No') };

  return (
    <>
      {proposalAPI ? (
        <Container>
          <Header>
            <Title route={'/proposals'} title="Proposal Details" />

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
                    <HoverLink>{proposalAPI.proposer}</HoverLink>
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
                <HalfRow>
                  <span>
                    <strong>Created Epoch</strong>
                  </span>
                  <span>
                    <span>{proposalAPI.epochStart}</span>
                  </span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong>Ending Epoch</strong>
                  </span>
                  <span style={{ color: 'red' }}>{proposalAPI.epochEnd}</span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong>Actual Epoch</strong>
                  </span>
                  <span>
                    <span>{proposalAPI.overview.epochNumber}</span>
                  </span>
                </HalfRow>
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
              <Row>
                <span>
                  <strong>Description</strong>
                </span>
                <BigSpan>{description}</BigSpan>
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
                {toLocaleFixed(totalVoted, 6)} ({votesPercentage}%)
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
                  Voted: {formatAmount(totalVoted)} /{' '}
                  {formatAmount(totalStaked / 10 ** precision)}
                </span>
              ) : null}
            </ProgressBarVotes>

            <CardVoteContainer>
              {filterVoters &&
                Object.keys(filterVoters).map((item: any, key: number) => {
                  if (totalStaked) {
                    let percentageCard =
                      (filterVoters[item] * 100) /
                      (totalStaked / 10 ** precision);
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
                {Object.keys(filterVotersPerPagination).map((item, key) => {
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
          {selectedFilter === 'Yes' ? (
            <Table {...tablePropsYes} />
          ) : (
            <Table {...tablePropsNo} />
          )}
        </Container>
      ) : null}
    </>
  );
};

export const getVotingPowers = (voters: IVote[]): IVotingPowers => {
  const powers = {};
  voters?.forEach(voter => {
    powers[voter.address] = voter?.amount;
  });
  return powers;
};

export const getProposalNetworkParams = (
  params: IRawParam,
  apiNetworkParams: IAPINetworkParams,
): IParsedParams => {
  const currentNetworkParams = {} as INetworkParams;
  let fullInfoParams: IFullInfoParam[] = [];

  if (apiNetworkParams) {
    Object.keys(proposalsMessages).map((key, index) => {
      currentNetworkParams[proposalsMessages[key]] = {
        number: index,
        parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
        currentValue: apiNetworkParams?.parameters?.[key]?.value,
      };
    });
  }

  if (params) {
    fullInfoParams = Object.entries(params).map(([index, value]) => {
      return {
        paramIndex: index,
        paramLabel: NetworkParamsIndexer[index],
        paramValue: Number(value),
        paramText: proposalsMessages[NetworkParamsIndexer[index]],
      };
    });
  }

  return { currentNetworkParams, fullInfoParams };
};

export const getServerSideProps: GetStaticProps<IProposal> = async ({
  params,
}) => {
  let props: any = {};

  const proposalInfosCall = new Promise(async (resolve, reject) => {
    const res = await api.get({
      route: `proposals/${params?.number}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }
    reject(res.error);
  });

  const dataParametersCall = new Promise(async (resolve, reject) => {
    const res = await api.get({ route: 'network/network-parameters' });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  const dataOverviewCall = new Promise(async (resolve, reject) => {
    const res = await api.get({ route: 'node/overview' });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  const promises = [proposalInfosCall, dataParametersCall, dataOverviewCall];
  await Promise.allSettled(promises).then(responses => {
    responses.forEach(async (res, index) => {
      if (res.status !== 'rejected') {
        const { value }: any = res;

        if (index === 0) {
          props = value.data.proposal;
          props.votingPowers = getVotingPowers(value?.data?.proposal.voters);
          props['pagination'] = value?.data?.proposal.votersPage;
          delete props['votersPage'];
        }

        if (index === 1) {
          const { data } = value;
          const parsedParameters = getProposalNetworkParams(
            props.parameters,
            data,
          );
          props.parsedParameters = parsedParameters?.fullInfoParams;
          props.currentNetworkParams = parsedParameters?.currentNetworkParams;
        }

        if (index === 2) {
          props.overview = value?.data?.overview;
        }
      }
    });
  });

  if (!props) {
    props = {};
  }

  return { props };
};

export default ProposalDetails;
