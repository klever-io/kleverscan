import { getStatusIcon } from '@/assets/status';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import {
  IFullInfoParam,
  IParsedProposal,
  IProposalsProps,
} from '@/types/proposals';
import { capitalizeString, parseAddress } from '@/utils/index';
import Link from 'next/link';
import React, { useRef } from 'react';
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
  const tooltipRef = useRef<any>(null);

  const rowSections = (props: IParsedProposal): JSX.Element[] => {
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
          <Tooltip
            Component={() => (
              <div>{renderProposalsNetworkParams(parsedParameters)}</div>
            )}
            msg={message}
          ></Tooltip>
        );
      }
      return <></>;
    };

    const StatusIcon = getStatusIcon(proposalStatus);
    const precision = 10 ** 6;

    const getPositiveVotes = () => {
      let parsedPosVotes = votes['0'] / precision;
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
        return Math.round(totalStaked / precision).toLocaleString();
      }
      return <span style={{ color: 'red' }}>Unavailable</span>;
    };
    const sections = [
      <p key={proposalId}>#{proposalId}</p>,
      <ProposerDescAndLink key={proposer}>
        <Link href={`/account/${proposer}`}>
          <a>{parseAddress(proposer, 14)}</a>
        </Link>
      </ProposerDescAndLink>,
      <ProposalTime key={`${epochStart}/${epochEnd}`}>
        <small>Created Epoch: {epochStart}</small>
        <small className="endTime">Ending Epoch: {epochEnd}</small>
      </ProposalTime>,
      <UpVotes key={String(votes)}>
        <p>
          {getPositiveVotes()}/{parseTotalStaked()}
        </p>
      </UpVotes>,
      <Status status={proposalStatus} key={proposalStatus}>
        <StatusIcon />
        <ProposalStatus>{capitalizeString(proposalStatus)}</ProposalStatus>
      </Status>,
      <span key={String(parsedParameters)}>
        {renderProposalsNetworkParamsWithToolTip()}
      </span>,
      <Link href={{ pathname: `/proposal/${proposalId}` }} key={proposalId}>
        Details
      </Link>,
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
    columnSpans: [1, 1, 1, 1, 2, 2, 2],
    data: proposals as any[],
    header,
    type: 'proposals',
    scrollUp: false,
    totalPages,
    dataName: 'proposals',
    request: page => request(page),
  };

  return <Table {...tableProps} />;
};

export default Proposals;
