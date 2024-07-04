import { PropsWithChildren } from 'react';
import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import {
  CustomFieldWrapper,
  CustomLink,
  Status,
} from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { paramsStyles } from '@/components/Tooltip/configs';
import { useMobile } from '@/contexts/mobile';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IRowSection } from '@/types/index';
import {
  IParsedProposal,
  IParsedProposalParam,
  IProposalsProps,
} from '@/types/proposals';
import { setQueryAndRouter } from '@/utils';
import { parseAddress } from '@/utils/parseValues';
import { passViewportStyles } from '@/utils/viewportStyles';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FilterContainer, ProposalsContainer } from './styles';

export const getProposalStatusColorAndText = (
  status: string,
): {
  color: string;
  text: string;
} => {
  switch (status) {
    case 'ApprovedProposal':
      return {
        color: 'success',
        text: 'Approved',
      };
    case 'DeniedProposal':
      return {
        color: 'fail',
        text: 'Denied',
      };
    case 'ActiveProposal':
      return {
        color: 'pending',
        text: 'Active',
      };
    default:
      return {
        color: 'text',
        text: 'Unknown',
      };
  }
};

const Proposals: React.FC<PropsWithChildren<IProposalsProps>> = ({
  request,
}) => {
  const { t } = useTranslation(['common', 'proposals']);
  const { isMobile, isTablet } = useMobile();
  const router = useRouter();
  const filters: IFilter[] = [
    {
      title: `${t('common:Buttons.Status')}`,
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

    if (parsedParameters?.length === 1) {
      parsedParameters.push({
        paramText: '- -',
        paramValue: 0,
        paramIndex: '- -',
        paramLabel: '- -',
      });
    }

    const proposalStatusColorAndText =
      getProposalStatusColorAndText(proposalStatus);

    const renderProposalsNetworkParams = (
      fullParameters: IParsedProposalParam[] | undefined,
    ) => {
      if (!fullParameters) {
        return <></>;
      }
      return fullParameters.map((param, index: number) => {
        if (index < 2) {
          return (
            <span
              key={index}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {param.paramText}
            </span>
          );
        }
        if (index === 2) {
          return <span key={index}>...</span>;
        }
      });
    };

    const renderProposalsNetworkParamsWithToolTip = () => {
      const message: string[] = [];
      parsedParameters?.forEach((param2, index2) => {
        if (param2.paramIndex !== '- -')
          message.push(`${param2.paramText}  ${param2.paramValue}`);
      });
      if (parsedParameters) {
        return (
          <Tooltip
            Component={() => (
              <DoubleRow {...props}>
                {renderProposalsNetworkParams(parsedParameters)}
              </DoubleRow>
            )}
            customStyles={passViewportStyles(
              isMobile,
              isTablet,
              ...paramsStyles,
            )}
            msg={message.join('\n')}
            maxVw={100}
          ></Tooltip>
        );
      }
      return <></>;
    };

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
    const sections: IRowSection[] = [
      {
        element: props => <p key={proposalId}>#{proposalId}</p>,
        span: 1,
        width: 100,
      },
      {
        element: props => (
          <DoubleRow {...props} key={proposer}>
            <Link href={`/account/${proposer}`}>
              <Mono>{parseAddress(proposer, 16)}</Mono>
            </Link>
            <Status
              status={proposalStatusColorAndText.color}
              key={proposalStatus}
            >
              {proposalStatusColorAndText.text}
            </Status>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow {...props} key={`${epochStart}/${epochEnd}`}>
            <span>Created Epoch: {epochStart}</span>
            <span className="endTime">Ending Epoch: {epochEnd - 1}</span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow {...props} key={String(votes)}>
            <CenteredRow>
              {getPositiveVotes()}
              <Tooltip
                msg="For a proposal to be approved, it needs to have more than 50% of the total staked votes."
                Component={() => (
                  <CustomFieldWrapper>
                    <span>
                      {' '}
                      (
                      {totalStaked
                        ? (((votes['0'] || 0) * 100) / totalStaked).toFixed(2)
                        : '- -'}
                      %)
                    </span>
                  </CustomFieldWrapper>
                )}
              />
            </CenteredRow>
            <span>{parseTotalStaked()}</span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => renderProposalsNetworkParamsWithToolTip(),
        span: 1,
      },
      {
        element: props => (
          <Link
            href={{ pathname: `/proposal/${proposalId}` }}
            key={proposalId}
            legacyBehavior
          >
            <CustomLink> {t('common:Buttons.Details')}</CustomLink>
          </Link>
        ),
        span: 2,
      },
    ];

    return sections;
  };

  const header = [
    'Number',
    'Proposer/Status',
    'Time',
    'Upvotes/Total Staked',
    'Network Parameters',
    '',
  ];

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'proposals',
    dataName: 'proposals',
    request: (page, limit) => request(page, limit, router),
    Filters: () => (
      <FilterContainer>
        {filters.map((filter, index) => (
          <Filter key={String(index)} {...filter} />
        ))}
      </FilterContainer>
    ),
  };

  return (
    <ProposalsContainer>
      <Table {...tableProps} />
    </ProposalsContainer>
  );
};

export default Proposals;
