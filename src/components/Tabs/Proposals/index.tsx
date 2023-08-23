import { getStatusIcon } from '@/assets/status';
import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import { CustomLink, Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { paramsStyles } from '@/components/Tooltip/configs';
import { useMobile } from '@/contexts/mobile';
import { IRowSection } from '@/types/index';
import {
  IParsedProposal,
  IParsedProposalParam,
  IProposalsProps,
} from '@/types/proposals';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { parseAddress } from '@/utils/parseValues';
import { passViewportStyles } from '@/utils/viewportStyles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  FilterContainer,
  ProposalsContainer,
  ProposalStatus,
  ProposalTime,
  ProposerDescAndLink,
  UpVotes,
} from './styles';

const Proposals: React.FC<IProposalsProps> = ({ request }) => {
  const { isMobile, isTablet } = useMobile();
  const router = useRouter();
  const filters: IFilter[] = [
    {
      title: 'Status',
      data: ['Active', 'Approved', 'Denied'],
      onClick: selected => filterProposals(selected),
      current: router?.query?.status as string,
      isHiddenInput: false,
    },
  ];

  const filterProposals = async (status: string) => {
    const actualStatus =
      status === 'Approved'
        ? 'ApprovedProposal'
        : status === 'Denied'
        ? 'DeniedProposal'
        : status === 'Active'
        ? 'ActiveProposal'
        : '';

    setQueryAndRouter({ ...router.query, status: actualStatus }, router);
  };

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

    const getProposalStatusColor = () => {
      switch (proposalStatus) {
        case 'ApprovedProposal':
          return 'success';
        case 'DeniedProposal':
          return 'fail';
        case 'ActiveProposal':
          return 'pending';
        default:
          return 'text';
      }
    };

    const renderProposalsNetworkParams = (
      fullParameters: IParsedProposalParam[] | undefined,
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
      parsedParameters?.forEach(
        (param2, index2) =>
          (message += `${param2.paramText}  ${param2.paramValue}` + '\n'),
      );
      if (parsedParameters) {
        return (
          <span style={{ display: 'flex' }}>
            <Tooltip
              Component={() => (
                <div>{renderProposalsNetworkParams(parsedParameters)}</div>
              )}
              customStyles={passViewportStyles(
                isMobile,
                isTablet,
                ...paramsStyles,
              )}
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
      if (!votes) return;
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
              <a>{parseAddress(proposer, 20)}</a>
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
          <Status status={getProposalStatusColor()} key={proposalStatus}>
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
    header,
    type: 'proposals',
    scrollUp: true,
    dataName: 'proposals',
    request: (page, limit) => request(page, limit),
  };

  return (
    <ProposalsContainer>
      <FilterContainer>
        {filters.map((filter, index) => (
          <Filter key={String(index)} {...filter} />
        ))}
      </FilterContainer>
      <Table {...tableProps} />
    </ProposalsContainer>
  );
};

export default Proposals;
