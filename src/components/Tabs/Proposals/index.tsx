import { getStatusIcon } from '@/assets/status';
import Table, { ITable } from '@/components/Table';
import { CustomLink, Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { useMobile } from '@/contexts/mobile';
import { IRowSection } from '@/types/index';
import {
  IFullInfoParam,
  IParsedProposal,
  IProposalsProps,
} from '@/types/proposals';
import { capitalizeString, parseAddress } from '@/utils/index';
import Link from 'next/link';
import React from 'react';
import {
  ProposalStatus,
  ProposalTime,
  ProposerDescAndLink,
  UpVotes,
} from './styles';

const Proposals: React.FC<IProposalsProps> = ({
  proposals,
  totalPages,
  request,
}) => {
  const { isMobile } = useMobile();

  const rowSections = (props: IParsedProposal): IRowSection[] => {
    const {
      proposalId,
      epochStart,
      epochEnd,
      proposalStatus,
      proposer,
      totalStaked,
      votes,
      parsedParameters,
    } = props;

    const renderProposalsNetworkParams = (
      fullParameters: IFullInfoParam[] | undefined,
    ) => {
      if (!fullParameters) {
        return <></>;
      }
      return fullParameters.map((param, index: number) => {
        if (index < 3) {
          return (
            <div
              key={index}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <small>{param.paramText}</small>
              <br />
            </div>
          );
        }
        if (index === 3) {
          return <div key={index}>...</div>;
        }
      });
    };

    const renderProposalsNetworkParamsWithToolTip = () => {
      let message = '';
      {
        parsedParameters.forEach(
          (param2, index2) =>
            (message += `${param2.paramText}  ${param2.paramValue}` + '\n'),
        );
      }
      if (parsedParameters) {
        return (
          <span style={{ display: 'flex' }}>
            <Tooltip
              Component={() => (
                <div>{renderProposalsNetworkParams(parsedParameters)}</div>
              )}
              customStyles={isMobile ? { offset: { left: 55 } } : {}}
              msg={message}
            ></Tooltip>
          </span>
        );
      }
      return <></>;
    };

    const StatusIcon = getStatusIcon(proposalStatus);
    const precision = 6;

    const getPositiveVotes = () => {
      let parsedPosVotes = votes['0'] / 10 ** precision;
      if (parsedPosVotes < 0.000001 || isNaN(parsedPosVotes)) {
        parsedPosVotes = 0;
      }
      if (parsedPosVotes > 1) {
        return Math.round(parsedPosVotes).toLocaleString();
      }
      return parsedPosVotes.toLocaleString();
    };

    const parseTotalStaked = () => {
      if (typeof totalStaked === 'number') {
        return Math.round(totalStaked / 10 ** precision).toLocaleString();
      }
      return <span style={{ color: 'red' }}>Unavailable</span>;
    };
    const sections = [
      { element: <p key={proposalId}>#{proposalId}</p>, span: 1 },
      {
        element: (
          <ProposerDescAndLink key={proposer}>
            <Link href={`/account/${proposer}`}>
              <a>{parseAddress(proposer, 14)}</a>
            </Link>
          </ProposerDescAndLink>
        ),
        span: 1,
      },
      {
        element: (
          <ProposalTime key={`${epochStart}/${epochEnd}`}>
            <small>Created Epoch: {epochStart}</small>
            <small className="endTime">Ending Epoch: {epochEnd}</small>
          </ProposalTime>
        ),
        span: 1,
      },
      {
        element: (
          <UpVotes key={String(votes)}>
            <p>
              {getPositiveVotes()}/{parseTotalStaked()}
            </p>
          </UpVotes>
        ),
        span: 1,
      },
      {
        element: (
          <Status status={proposalStatus} key={proposalStatus}>
            <StatusIcon />
            <ProposalStatus>{capitalizeString(proposalStatus)}</ProposalStatus>
          </Status>
        ),
        span: 1,
      },
      {
        element: (
          <span key={String(parsedParameters)}>
            {renderProposalsNetworkParamsWithToolTip()}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <Link href={{ pathname: `/proposal/${proposalId}` }} key={proposalId}>
            <CustomLink>Details</CustomLink>
          </Link>
        ),
        span: 2,
      },
    ];
    return sections;
  };

  const header = [
    'Number',
    'Proposer',
    'Time',
    'Upvotes/Total Staked',
    'Status',
    'Network Parameters',
    '',
  ];

  const tableProps: ITable = {
    rowSections,
    data: proposals as any[],
    header,
    type: 'proposals',
    scrollUp: false,
    totalPages,
    dataName: 'proposals',
    request: (page, limit) => request(page, limit),
  };

  return <Table {...tableProps} />;
};

export default Proposals;
