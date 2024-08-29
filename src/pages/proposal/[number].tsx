import { Copy } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { proposalsMap } from '@/components/Tabs/NetworkParams/proposalsMap';
import Tooltip from '@/components/Tooltip';
import { useContractModal } from '@/contexts/contractModal';
import api from '@/services/api';
import {
  dataNetworkParams,
  dataOverviewCall,
  dataProposalCall,
} from '@/services/requests/proposals';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Container,
  Status,
} from '@/styles/common';
import { IRowSection } from '@/types/index';
import {
  INetworkParams,
  IParsedNetworkParams,
  IParsedParams,
  IParsedProposalParam,
  IParsedVote,
  IParsedVoterResponse,
  IProposalParams,
  IProposalVoters,
  NetworkParamsIndexer,
} from '@/types/proposals';
import { validateFormattedVotes } from '@/utils';
import { formatAmount, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useSkeleton } from '@/utils/hooks';
import { parseAddress } from '@/utils/parseValues';
import { typeVoteColors } from '@/utils/viewportStyles';
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
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useQuery } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';

const ProposalVoters = (props: IProposalVoters) => {
  const rowSections = (props: IParsedVote): IRowSection[] => {
    const { status, voter, votingPower, voteDate } = props;
    let sections: IRowSection[] = [{ element: props => <></>, span: 1 }];
    sections = [
      {
        element: props => (
          <CenteredRow key={voter}>
            <Link href={`/account/${voter}`} legacyBehavior>
              {parseAddress(voter, 24)}
            </Link>
            <Copy data={voter} info="voter"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: props => <span key={votingPower}>{votingPower}%</span>,
        span: 1,
      },
      {
        element: props => (
          <StatusContent key={status}>
            <AiFillCheckCircle
              color={typeVoteColors[status as keyof typeof typeVoteColors]}
              size={18}
              style={{ marginRight: 5 }}
            />
            <span>{voteDate}</span>
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

const ProposalDetails: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation(['common', 'proposals']);
  const [selectedFilter, setSelectedFilter] = useState(
    `${t('common:Statements.Yes')}`,
  );
  const [votesPercentage, setVotesPercentage] = useState('');
  const [expandDescription, setExpandDescription] = useState(false);
  const [isSkeleton, setLoading] = useSkeleton();
  const router = useRouter();
  const filter = [
    `${t('common:Statements.Yes')}`,
    `${t('common:Statements.No')}`,
  ];
  const { data: overview } = useQuery({
    queryKey: 'proposalOverview',
    queryFn: () => dataOverviewCall(),
  });
  const { data: proposal } = useQuery({
    queryKey: 'proposalsCall',
    queryFn: () => dataProposalCall(router),
    enabled: !!router.isReady,
  });
  const { data: params } = useQuery('paramsList', dataNetworkParams);
  const { getInteractionsButtons } = useContractModal();
  const [VoteButton] = getInteractionsButtons([
    {
      title: `${t('Vote Contract')}`,
      contractType: 'VoteContract',
      defaultValues: {
        proposalId: parseInt(router?.query?.number as string),
        type: 0,
      },
    },
  ]);

  useEffect(() => {
    if (proposal) {
      let percentage =
        (proposal?.totalVoted * 100) /
        (proposal?.totalStaked / 10 ** KLV_PRECISION);
      if (percentage < 0.01) {
        percentage = 0;
      }
      setVotesPercentage(percentage.toFixed(2));
      setLoading(false);
    }
  }, [proposal]);

  const getProposalNetworkParams = (
    params: IProposalParams,
    apiNetworkParams: INetworkParams,
  ): IParsedParams | null => {
    if (!params || !apiNetworkParams) return null;
    const currentNetworkParams = {} as IParsedNetworkParams;
    let parsedProposalParams: IParsedProposalParam[] = [];

    if (apiNetworkParams) {
      Object.keys(proposalsMap).map((key, index) => {
        currentNetworkParams[
          proposalsMap[key as keyof typeof proposalsMap].message
        ] = {
          number: index,
          parameter: proposalsMap[key as keyof typeof proposalsMap]
            ? proposalsMap[key as keyof typeof proposalsMap].message
            : '',
          currentValue:
            apiNetworkParams?.[key as keyof typeof proposalsMap]?.value,
          parameterLabel: key,
        };
      });
    }

    if (params) {
      parsedProposalParams = Object.entries(params).map(([index, value]) => {
        return {
          paramIndex: index,
          paramLabel: NetworkParamsIndexer[Number(index)],
          paramValue: Number(value),
          paramText:
            proposalsMap[
              NetworkParamsIndexer[Number(index)] as keyof typeof proposalsMap
            ].message,
        };
      });
    }
    return { currentNetworkParams, parsedProposalParams };
  };

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
            {t('proposals:CurrentValue')}:{' '}
            {
              parsedParams?.currentNetworkParams?.[param.paramText]
                ?.currentValue
            }
          </p>
        </div>
      ));
    }
  }, [proposal, params]);

  const Progress: React.FC<PropsWithChildren> = () => {
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
                background={typeVoteColors[item as keyof typeof typeVoteColors]}
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
      if (selectedFilter === `${t('common:Statements.Yes')}`) {
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

  const SelectedTabComponent: React.FC<PropsWithChildren> = useCallback(() => {
    switch (selectedFilter) {
      case `${t('common:Statements.Yes')}`:
        return <ProposalVoters proposalVotersProps={{ ...tableProps1 }} />;
      case `${t('common:Statements.No')}`:
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
            <Title
              route={'/proposals'}
              title={t('common:Titles.Proposal Details')}
            />
          </Header>
          <CardTabContainer>
            <CardHeader>
              <CardHeaderItem selected={true}>
                <span>{t('common:Tabs.Overview')}</span>
              </CardHeaderItem>
            </CardHeader>
            <CardContent>
              <Row>
                <span>
                  <h2>
                    {' '}
                    {isSkeleton(
                      `${t('common:Titles.Proposal')} # ${proposal?.proposalId}`,
                    )}
                  </h2>
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
                  <strong>{t('proposals:Proposer')}</strong>
                </span>
                <span style={{ marginRight: '0.2rem' }}>
                  <Link href={`/account/${proposal?.proposer}`} legacyBehavior>
                    <HoverLink>{isSkeleton(proposal?.proposer)}</HoverLink>
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
                <Link href={`/transaction/${proposal?.txHash}`} legacyBehavior>
                  <HoverLink>{isSkeleton(proposal?.txHash)}</HoverLink>
                </Link>
              </Row>
              <Row>
                <HalfRow>
                  <span>
                    <strong>{t('proposals:CreateEpoch')}</strong>
                  </span>
                  <span>
                    <span>{isSkeleton(proposal?.epochStart)}</span>
                  </span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong> {t('proposals:EndingEpoch')}</strong>
                  </span>
                  <span style={{ color: 'red' }}>
                    {isSkeleton(proposal?.epochEnd - 1)}
                  </span>
                </HalfRow>
                <HalfRow>
                  <span>
                    <strong>{t('proposals:ActualEpoch')}</strong>
                  </span>
                  <span>
                    <span>{isSkeleton(overview?.epochNumber)}</span>
                  </span>
                </HalfRow>
              </Row>
              <Row>
                <span>
                  <strong>{t('proposals:NetworkParameters')}</strong>
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
                  <strong>{t('proposals:Description')}</strong>
                </span>
                {proposal && proposal.description.length > 50 && (
                  <ButtonExpand
                    onClick={() => setExpandDescription(!expandDescription)}
                  >
                    {expandDescription
                      ? `${t('common:Buttons.Hide')}`
                      : `${t('common:Buttons.Expand')}`}
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
                    <BigSpan>
                      {isSkeleton(t('proposals:NoDescription'))}
                    </BigSpan>{' '}
                  </DescriptionContainer>
                )}
              </RowDescription>
              {proposal && proposal.proposalStatus === 'ActiveProposal' && (
                <Row>
                  <span>
                    <strong>Vote Now</strong>
                  </span>
                  <VoteButton />
                </Row>
              )}
            </CardContent>
          </CardTabContainer>

          <VotesContainer>
            <span>
              <h3>{t('proposals:Votes')}</h3>
            </span>

            <VotesHeader>
              <strong>{t('proposals:TotalVoted')}</strong>
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
                  <PassThresholdText>
                    {t('proposals:PassThreshold')}
                  </PassThresholdText>
                  <VerticalLine />
                </PassThresholdContainer>
                <Progress />
              </PassThresholdContainer>
              {proposal?.totalStaked ? (
                <span>
                  {t('proposals:Voted')} : {formatAmount(proposal.totalVoted)} /{' '}
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
                      <CardVote
                        key={key}
                        color={
                          typeVoteColors[item as keyof typeof typeVoteColors]
                        }
                      >
                        <span>{filter[key]}</span>
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
                <h1>{t('proposals:Voters')}</h1>
              </span>
              <FiltersValidators>
                {proposal &&
                  filter.map((item, key) => (
                    <OptionValidator
                      key={key}
                      onClick={() => setSelectedFilter(item)}
                      selected={selectedFilter === item}
                    >
                      <strong>{item}</strong>
                    </OptionValidator>
                  ))}
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

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'proposals'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default ProposalDetails;
