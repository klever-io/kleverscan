import { getStatusIcon } from '@/assets/status';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
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
  Tooltip,
  TooltipText,
  UpVotes,
} from './styles';

const Proposals: React.FC<IProposalsProps> = ({ proposals, loading }) => {
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
      if (parsedParameters) {
        return (
          <Tooltip onMouseOver={(e: any) => handleMouseOver(e)}>
            {renderProposalsNetworkParams(parsedParameters)}
            <TooltipText ref={tooltipRef}>
              {parsedParameters.map((param2, index2) => (
                <div key={index2}>
                  {param2.paramText}&nbsp;&nbsp;{param2.paramValue}
                </div>
              ))}
            </TooltipText>
          </Tooltip>
        );
      }
      return <></>;
    };

    const handleMouseOver = (e: any) => {
      const positionY = e.currentTarget.getBoundingClientRect().top;
      const positionX = e.currentTarget.getBoundingClientRect().left;

      tooltipRef.current.style.top = positionY - 30 + 'px';
      tooltipRef.current.style.left = positionX + 'px';
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
    loading: loading,
    header,
    type: 'proposals',
  };

  return <Table {...tableProps} />;
};

export default Proposals;
