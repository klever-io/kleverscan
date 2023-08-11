import { Copy } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import { tipMobile } from '@/components/Tooltip/configs';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  Container,
} from '@/styles/common';
import { IRowSection } from '@/types/index';
import {
  INetworkParams,
  INodeOverview,
  IParsedParams,
  IParsedProposal,
  IParsedProposalParam,
  IParsedVote,
  IParsedVoter,
  IParsedVoterResponse,
  IProposal,
  IProposalParams,
  IProposalResponse,
  IProposalVoters,
  IVote,
  IVotingPowers,
  NetworkParamsIndexer,
} from '@/types/proposals';
import { formatAmount, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useSkeleton } from '@/utils/hooks';
import { parseAddress } from '@/utils/parseValues';
import { passViewportStyles, typeVoteColors } from '@/utils/viewportStyles';
import {
  BalanceContainer,
  BigSpan,
  CardVote,
  CardVoteContainer,
  DescriptionContainer,
  EmptyDescription,
  FiltersValidators,
  HalfRow,
  Header,
  HoverLink,
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
  RowDescription,
  StatusContent,
  ValidatorsContainer,
  VerticalLine,
  VotesContainer,
  VotesHeader,
} from '@/views/proposals/detail';
import { ButtonExpand } from '@/views/transactions/detail';
import { CenteredRow } from '@/views/validators/detail';
import { format, fromUnixTime } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import Tooltip from '../../components/Tooltip';

const ProposalVoters = (props: IProposalVoters) => {
  const rowSections = (props: IParsedVote): IRowSection[] => {
    const { status, voter, votingPower, voteDate } = props;
    let sections = [{ element: <></>, span: 1 }];
    sections = [
      {
        element: (
          <CenteredRow key={voter}>
            <Link href={`/account/${voter}`}>{parseAddress(voter, 24)}</Link>
            <Copy data={voter} info="voter"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      { element: <p key={votingPower}>{votingPower}%</p>, span: 1 },
      {
        element: (
          <StatusContent key={status}>
            <AiFillCheckCircle
              color={typeVoteColors[status]}
              size={18}
              style={{ marginRight: 5 }}
            />
            <small>{voteDate}</small>
          </StatusContent>
        ),
        span: 1,
      },
    ];

    return sections;
  };
  const proposalTableProps = props.proposalVotersProps;

  const tableProps2: ITable = {
    header: ['Voter', 'Voting Power', 'Vote date'],
    rowSections,
    type: 'votes',
    ...proposalTableProps,
  };

  return <Table {...tableProps2} />;
};

const ProposalDetails: React.FC = () => {
  const [proposal, setProposal] = useState<null | IParsedProposal>(null);
  const [params, setParams] = useState<null | INetworkParams>(null);
  const [overview, setOverview] = useState<null | INodeOverview>(null);
  const [selectedFilter, setSelectedFilter] = useState('Yes');
  const [votesPercentage, setVotesPercentage] = useState('');
  const [expandDescription, setExpandDescription] = useState(false);
  const { isMobile, isTablet } = useMobile();
  const [isSkeleton, setLoading] = useSkeleton();
  const router = useRouter();

  useEffect(() => {
    if (proposal) {
      let percentage =
        (proposal?.totalVoted * 100) /
        (proposal?.totalStaked / 10 ** KLV_PRECISION);
      if (percentage < 0.01) {
        percentage = 0;
      }
      setVotesPercentage(percentage.toFixed(2));
    }
  }, [proposal]);

  const validateFormattedVotes = (
    proposalResponse: IProposal,
  ): IParsedVoter[] => {
    const list: IParsedVoter[] = [];
    if (!proposalResponse) return list;
    const votingPowersAdd = getVotingPowers(proposalResponse.voters);
    proposalResponse?.voters?.forEach((voter: IVote) => {
      if (proposalResponse.totalStaked && votingPowersAdd) {
        const votesInfo = voter;
        const frozenBalance = votingPowersAdd[voter.address];
        list.push({
          voter: voter.address,
          votingPower: (
            (frozenBalance * 100) /
            proposalResponse.totalStaked
          ).toFixed(3),
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

  const parseProposal = (proposal: IProposalResponse) => {
    const votesYes = (proposal.data.proposal.votes['0'] || 0) / 10 ** 6;
    const votesNo = (proposal.data.proposal.votes['1'] || 0) / 10 ** 6;
    return {
      ...proposal.data.proposal,
      votingPowers: getVotingPowers(proposal?.data?.proposal.voters),
      pagination: proposal?.data?.proposal.votersPage,
      votes: {
        Yes: votesYes,
        No: votesNo,
      },
      totalVoted: votesYes + votesNo,
      parsedVoters: validateFormattedVotes(proposal.data.proposal),
    };
  };

  const getProposalNetworkParams = (
    params: IProposalParams,
    apiNetworkParams: INetworkParams,
  ): IParsedParams | null => {
    if (!params || !apiNetworkParams) return null;
    const currentNetworkParams = {} as INetworkParams;
    let parsedProposalParams: IParsedProposalParam[] = [];

    if (apiNetworkParams) {
      Object.keys(proposalsMessages).map((key, index) => {
        currentNetworkParams[proposalsMessages[key]] = {
          number: index,
          parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
          currentValue: apiNetworkParams?.[key]?.value,
          parameterLabel: key,
        };
      });
    }

    if (params) {
      parsedProposalParams = Object.entries(params).map(([index, value]) => {
        return {
          paramIndex: index,
          paramLabel: NetworkParamsIndexer[index],
          paramValue: Number(value),
          paramText: proposalsMessages[NetworkParamsIndexer[index]],
        };
      });
    }
    return { currentNetworkParams, parsedProposalParams };
  };

  useEffect(() => {
    const loadPageInitialData = async () => {
      if (router.query?.number) {
        let parsedProposal = null;
        let params = null;
        let overview = null;
        const proposalInfosCall = new Promise(async (resolve, reject) => {
          const res = await api.get({
            route: `proposals/${router.query.number}`,
            query: { voteType: 0 },
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

        const promises = [
          proposalInfosCall,
          dataParametersCall,
          dataOverviewCall,
        ];
        await Promise.allSettled(promises).then(responses => {
          responses.forEach(async (res, index) => {
            if (res.status !== 'rejected') {
              const { value }: any = res;
              if (index === 0) {
                parsedProposal = parseProposal(value);
              }

              if (index === 1) {
                const { data } = value;
                params = data?.parameters;
              }

              if (index === 2) {
                overview = value?.data?.overview;
              }
            }
          });
        });
        setProposal(parsedProposal);
        setParams(params);
        setOverview(overview);
        setLoading(false);
      }
    };
    loadPageInitialData();
  }, [router.query?.number]);

  const renderProposalParams = useCallback(() => {
    if (proposal && params) {
      const parsedParams = getProposalNetworkParams(
        proposal.parameters,
        params,
      );
      return parsedParams?.parsedProposalParams.map(param => (
        <div key={param.paramIndex}>
          <strong>{param.paramText}</strong>
          <span>{param.paramValue}</span>
          <p>
            Current Value:{' '}
            {
              parsedParams?.currentNetworkParams?.[param.paramText]
                ?.currentValue
            }
          </p>
        </div>
      ));
    }
  }, [proposal, params]);

  const Progress: React.FC = () => {
    if (!proposal) return null;
    return (
      <ProgressBar>
        {Object.keys(proposal.votes).map((item: any, key: number) => {
          if (proposal.totalStaked) {
            let percentageCard = (
              (proposal.votes[item] * 100) /
              (proposal.totalStaked / 10 ** KLV_PRECISION)
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

  const requestVoters = useCallback(
    async (page: number, limit: number): Promise<IParsedVoterResponse> => {
      let response;
      if (selectedFilter === 'Yes') {
        response = await api.get({
          route: `proposals/${router.query.number}`,
          query: { pageVoters: page, limitVoters: limit, voteType: 0 },
        });
      } else {
        response = await api.get({
          route: `proposals/${router.query.number}`,
          query: { pageVoters: page, limitVoters: limit, voteType: 1 },
        });
      }
      const proposalResponse = response?.data?.proposal;
      const votesFormatted = validateFormattedVotes(proposalResponse);
      return {
        data: { voters: votesFormatted },
        pagination: response.data?.proposal?.votersPage,
        error: response.error,
        code: 'successful',
      };
    },
    [selectedFilter, router.query.number],
  );

  const tableProps1 = {
    scrollUp: false,
    request: requestVoters,
    dataName: 'voters',
  };

  const SelectedTabComponent: React.FC = useCallback(() => {
    switch (selectedFilter) {
      case 'Yes':
        return <ProposalVoters proposalVotersProps={{ ...tableProps1 }} />;
      case 'No':
        return <ProposalVoters proposalVotersProps={{ ...tableProps1 }} />;
      default:
        return <div />;
    }
  }, [selectedFilter]);

  const renderStatusIcon = () => {
    let StatusIcon = null;
    if (proposal) {
      StatusIcon = getStatusIcon(proposal.proposalStatus);
      return <StatusIcon />;
    }
    return StatusIcon;
  };
  return (
    <>
      {
        <Container>
          <Header>
            <Title route={'/proposals'} title="Proposal Details" />
          </Header>
          <CardTabContainer>
            <CardHeader>
              <CardHeaderItem selected={true}>
                <span>Overview</span>
              </CardHeaderItem>
            </CardHeader>
            <CardContent>
              <Row>
                <span>
                  <h2> {isSkeleton(`Proposal # ${proposal?.proposalId}`)}</h2>
                </span>
                {proposal && (
                  <Status status={proposal.proposalStatus}>
                    {renderStatusIcon()}
                    <span>
                      {proposal.proposalStatus === 'ApprovedProposal'
                        ? 'Effective'
                        : proposal.proposalStatus}
                    </span>
                  </Status>
                )}
              </Row>
              <Row>
                <span>
                  <strong>Proposer </strong>
                </span>
                <span style={{ marginRight: '0.2rem' }}>
                  <Link href={`/account/${proposal?.proposer}`}>
                    <HoverLink>{isSkeleton(proposal?.proposer)}</HoverLink>
                  </Link>
                </span>
                <Tooltip
                  msg={
                    'Always check the address. Names can be the same across multiple addresses.'
                  }
                  customStyles={passViewportStyles(
                    isMobile,
                    isTablet,
                    tipMobile,
                  )}
                />
              </Row>
              <Row>
                <span>
                  <strong>Hash</strong>
                </span>
                <Link href={`/transaction/${proposal?.txHash}`}>
                  <HoverLink>{isSkeleton(proposal?.txHash)}</HoverLink>
                </Link>
              </Row>
              <Row>
                <HalfRow>
                  <span>
                    <strong>Created Epoch</strong>
                  </span>
                  <span>
                    <span>{isSkeleton(proposal?.epochStart)}</span>
                  </span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong>Ending Epoch</strong>
                  </span>
                  <span style={{ color: 'red' }}>
                    {isSkeleton(proposal?.epochEnd)}
                  </span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong>Actual Epoch</strong>
                  </span>
                  <span>
                    <span>{isSkeleton(overview?.epochNumber)}</span>
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
                      {isSkeleton(renderProposalParams())}
                    </NetworkParamsContainer>
                  </BalanceContainer>
                </RowContent>
              </Row>
              <RowDescription>
                <span>
                  <strong>Description</strong>
                </span>
                {proposal && proposal.description.length > 50 && (
                  <ButtonExpand
                    onClick={() => setExpandDescription(!expandDescription)}
                  >
                    {expandDescription ? 'Hide' : 'Expand'}
                  </ButtonExpand>
                )}
                {proposal?.description && (
                  <DescriptionContainer expandDescription={expandDescription}>
                    <BigSpan expandDescription={expandDescription}>
                      {proposal.description}
                    </BigSpan>
                  </DescriptionContainer>
                )}
                {!proposal && (
                  <>
                    <DescriptionContainer
                      expandDescription={expandDescription}
                    ></DescriptionContainer>
                    <EmptyDescription>
                      <BigSpan>{isSkeleton(undefined)}</BigSpan>
                    </EmptyDescription>
                  </>
                )}
                {proposal && !proposal.description && (
                  <DescriptionContainer expandDescription={expandDescription}>
                    <BigSpan>{isSkeleton('No description provided.')}</BigSpan>{' '}
                  </DescriptionContainer>
                )}
              </RowDescription>
            </CardContent>
          </CardTabContainer>

          <VotesContainer>
            <span>
              <h3>Votes</h3>
            </span>

            <VotesHeader>
              <strong>Total Voted</strong>
              <span>
                {proposal &&
                  `${toLocaleFixed(
                    proposal.totalVoted,
                    6,
                  )} ${votesPercentage}%`}
                {!proposal && isSkeleton(undefined)}
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
              {proposal?.totalStaked ? (
                <span>
                  Voted: {formatAmount(proposal.totalVoted)} /{' '}
                  {formatAmount(proposal.totalStaked / 10 ** KLV_PRECISION)}
                </span>
              ) : (
                isSkeleton(undefined)
              )}
            </ProgressBarVotes>

            <CardVoteContainer>
              {proposal &&
                Object.keys(proposal.votes).map((item: any, key: number) => {
                  if (proposal.totalStaked) {
                    let percentageCard =
                      (proposal.votes[item] * 100) /
                      (proposal.totalStaked / 10 ** KLV_PRECISION);
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
                          {proposal && toLocaleFixed(proposal.votes[item], 6)}
                        </QtyVotesText>
                      </CardVote>
                    );
                  }
                })}
              {!proposal && isSkeleton(undefined)}
            </CardVoteContainer>
          </VotesContainer>

          <ValidatorsContainer>
            <div>
              <span>
                <h1>Voters</h1>
              </span>
              <FiltersValidators>
                {proposal &&
                  Object.keys(proposal.votes).map((item, key) => {
                    return (
                      <OptionValidator
                        key={key}
                        onClick={() => setSelectedFilter(item)}
                        selected={selectedFilter === item}
                      >
                        <strong>{item}</strong>
                      </OptionValidator>
                    );
                  })}
                {!proposal && isSkeleton(undefined)}
              </FiltersValidators>
            </div>
          </ValidatorsContainer>
          <SelectedTabComponent />
        </Container>
      }
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

export default ProposalDetails;
