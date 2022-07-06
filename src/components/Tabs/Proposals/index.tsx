import React, { useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';
import {
  ProposalStatus,
  ProposerDescAndLink,
  UpVotes,
  TooltipText,
  Tooltip,
} from './styles';

import { getStatusIcon } from '@/assets/status';
import Link from 'next/link';

import { IProposal, IFullInfoParam } from '@/types/index';
import { capitalizeString, parseAddress } from '@/utils/index';

interface IProposalsProps {
  proposalParams: IProposals;
  loading: boolean;
  proposalsWithNetWorkParams: IFullInfoParam[][];
}

interface IProposals {
  [index: number]: IProposal;
}

const Proposals: React.FC<IProposalsProps> = ({
  proposalParams,
  loading,
  proposalsWithNetWorkParams,
}) => {
  const TableBody: React.FC<IProposal> = props => {
    const tooltipRef = useRef<any>(null);

    const renderProposalsNetworkParams = (
      fullParameters: IFullInfoParam[] | undefined,
    ) => {
      if (!fullParameters) {
        return <></>;
      }
      let tooltipMsg = '';
      const proposalsTooltipInfo = fullParameters.map(
        (param, index: number) => {
          tooltipMsg += `<div>${param.paramText}&nbsp;&nbsp;${param.paramValue}</div>`;
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
        },
      );
      return (
        <Tooltip onMouseOver={(e: any) => handleMouseOver(e)}>
          {proposalsTooltipInfo}
          <TooltipText ref={tooltipRef}>
            <div dangerouslySetInnerHTML={{ __html: tooltipMsg }}></div>
          </TooltipText>
        </Tooltip>
      );
    };

    const handleMouseOver = (e: any) => {
      const positionY = e.currentTarget.getBoundingClientRect().top;
      const positionX = e.currentTarget.getBoundingClientRect().left;

      tooltipRef.current.style.top = positionY - 30 + 'px';
      tooltipRef.current.style.left = positionX + 'px';
    };
    const {
      proposalId,
      epochStart,
      epochEnd,
      proposalStatus,
      proposer,
      totalStaked,
      votes,
      parameters,
    } = props;
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
    return (
      <Row type="proposals">
        <span>
          <p>#{proposalId}</p>
        </span>
        <ProposerDescAndLink>
          <Link href={`/account/${proposer}`}>
            <a>{parseAddress(proposer, 14)}</a>
          </Link>
        </ProposerDescAndLink>
        <span>
          <small>Created Epoch: {epochStart}</small> <p />
          <small className="endTime">Ended Epoch: {epochEnd}</small>
        </span>
        <UpVotes>
          <p>
            {getPositiveVotes()}/{parseTotalStaked()}
          </p>
        </UpVotes>
        <Status status={proposalStatus}>
          <StatusIcon />
          <ProposalStatus>{capitalizeString(proposalStatus)}</ProposalStatus>
        </Status>
        <span>
          {proposalsWithNetWorkParams
            ? renderProposalsNetworkParams(parameters)
            : null}
        </span>
        <span>
          <Link href={{ pathname: `/proposal/${proposalId}` }}>Details</Link>
        </span>
      </Row>
    );
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
    body: TableBody,
    data: proposalParams as any[],
    loading: loading,
    header,
    type: 'proposals',
  };

  return <Table {...tableProps} />;
};

export default Proposals;
