import { getStatusIcon } from '@/assets/status';
import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';
import {
  IFullInfoParam,
  IParsedProposal,
  IProposalsProps,
} from '@/types/proposals';
import { capitalizeString, parseAddress } from '@/utils/index';
import Link from 'next/link';
import React, { useCallback, useRef } from 'react';
import {
  ProposalStatus,
  ProposerDescAndLink,
  Tooltip,
  TooltipText,
  UpVotes,
} from './styles';

const Proposals: React.FC<IProposalsProps> = ({ proposals, loading }) => {
  const TableBody: React.FC<IParsedProposal> = props => {
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

    const tooltipRef = useRef<any>(null);

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

    const renderProposalsNetworkParamsWithToolTip = useCallback(() => {
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
    }, [parsedParameters]);

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
          <small className="endTime">Ending Epoch: {epochEnd}</small>
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
        <span>{renderProposalsNetworkParamsWithToolTip()}</span>
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
    data: proposals as any[],
    loading: loading,
    header,
    type: 'proposals',
  };

  return <Table {...tableProps} />;
};

export default Proposals;
