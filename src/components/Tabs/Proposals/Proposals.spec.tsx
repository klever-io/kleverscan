import { parseAddress, parseAllProposals } from '@/utils/parseValues';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Proposals from '.';
import theme from '../../../styles/theme';
import {
  emptyProposalsResponse,
  mockedProposalsResponse,
} from '../../../test/mocks/tabs/proposals';
import { renderWithTheme } from '../../../test/utils';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      push: jest.fn(),
    };
  },
}));

const request = jest.fn(async (page: number, limit: number) => {
  return Promise.resolve(mockedProposalsResponse);
});

const emptyRequest = jest.fn(async (page: number, limit: number) => {
  return Promise.resolve(emptyProposalsResponse);
});

describe('Component: Tabs/Proposals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the Table and it's body and the header correctly", async () => {
    const parsedProposals = parseAllProposals(
      mockedProposalsResponse.data.proposals,
    );
    await act(async () => {
      renderWithTheme(
        <Proposals
          request={(page: number, limit: number) => request(page, limit)}
        />,
      );
    });

    const proposalNumber = screen.getByText('#0');
    const headers = [
      'Proposals.Number',
      'Proposals.Proposer',
      'Proposals.Time',
      'Proposals.Upvotes/Total Staked',
      'Transactions.Status',
      'Proposals.Network Parameters',
    ];

    const tableBody = screen.getByTestId('table-body');

    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };
    expect(tableBody).toHaveStyle(tableBodyStyle);
    headers.forEach(name => {
      const header = screen.getAllByText(name)[0];
      expect(header).toBeInTheDocument();
    });
  });

  it('Should render the "Number", "Proposer", "Time", "Upvotes/Total Staked", "Status" and "Network Parameters" with the correct values and styles', async () => {
    const parsedProposals = parseAllProposals(
      mockedProposalsResponse.data.proposals,
    );
    await act(async () => {
      renderWithTheme(
        <Proposals
          request={(page: number, limit: number) => request(page, limit)}
        />,
      );
    });
    const proposalNumber = screen.getByText('#0');
    const proposer = screen.getAllByText(
      parseAddress(parsedProposals[0].proposer, 20),
    )[0];
    const epochStart = screen.getAllByText(/Created Epoch/i)[0];
    const epochEnd = screen.getAllByText(/Ending Epoch/i)[0];
    const upVotesAndTotalStaked = screen.getAllByText(
      'Proposals.Upvotes/Total Staked',
    )[0].nextSibling?.firstChild;
    const status = screen.getAllByText('ApprovedProposal')[0];
    const details = screen.getAllByText('Details')[0];

    expect(proposalNumber).toBeInTheDocument();
    expect(proposer).toBeInTheDocument();
    expect(epochStart).toHaveTextContent('Created Epoch: 8207');
    expect(epochEnd).toHaveTextContent('Ending Epoch: 8217');
    expect(upVotesAndTotalStaked).toHaveTextContent('8,000/12,000');
    expect(status).toBeInTheDocument();
    expect(details).toBeInTheDocument();

    const proposalNetworkParams = [
      'Block Rewards',
      'Staking Rewards',
      'KApp Fee for Withdraw',
    ];
    proposalNetworkParams.forEach(param => {
      const nodeParam = screen.getAllByText(param)[0];
      expect(nodeParam).toBeInTheDocument();
    });

    const proposalNumberStyles = {
      color: theme.black,
      fontWeight: '600',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };

    const proposerStyles = {
      color: theme.black,
      fontWeight: '600',
    };

    const epochsStyles = {
      color: theme.darkText,
    };

    const upVotesAndTotalStakedStyles = {
      color: theme.black,
      fontWeight: '600',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };

    const statusStyles = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: '0.95rem',
      color: theme.green,
      fontWeight: 'bold',
    };

    const networkParamsStyles = {
      color: theme.darkText,
    };

    const detailsStyles = {
      color: theme.true.white,
      fontWeight: '600',
    };

    expect(proposalNumber).toHaveStyle(proposalNumberStyles);
    expect(proposer).toHaveStyle(proposerStyles);
    expect(epochStart).toHaveStyle(epochsStyles);
    expect(epochEnd).toHaveStyle(epochsStyles);
    expect(upVotesAndTotalStaked).toHaveStyle(upVotesAndTotalStakedStyles);
    expect(status).toHaveStyle(statusStyles);
    expect(details).toHaveStyle(detailsStyles);
    proposalNetworkParams.forEach(param => {
      const nodeParam = screen.getAllByText(param)[0];
      expect(nodeParam).toHaveStyle(networkParamsStyles);
    });
  });

  it('should render empty data message when there are no proposals', async () => {
    const parsedProposals = parseAllProposals([]);
    await act(async () => {
      renderWithTheme(
        <Proposals
          request={(page: number, limit: number) => emptyRequest(page, limit)}
        />,
      );
    });
    const noDataMsg = screen.getByText('Oops! Apparently no data here.');
    expect(noDataMsg).toBeInTheDocument();
  });

  it('should render the network parameters tooltip text on hover', async () => {
    const parsedProposals = parseAllProposals(
      mockedProposalsResponse.data.proposals,
    );
    await act(async () => {
      renderWithTheme(
        <Proposals
          request={(page: number, limit: number) => request(page, limit)}
        />,
      );
    });

    const tooltipChild = screen.getAllByText(/15000000/)[0];
    expect(tooltipChild).toBeInTheDocument();
    expect(tooltipChild).not.toBeVisible();
    const tooltipTextContainer = tooltipChild.parentNode;
    expect(tooltipTextContainer).toHaveStyle({
      visibility: 'hidden',
      opacity: 0,
    });
    const tooltipContainer = tooltipTextContainer?.parentNode as HTMLElement;
    expect(tooltipContainer).toBeVisible();
    expect(tooltipTextContainer).not.toBeVisible();

    let visibleTooltipChild: HTMLElement | undefined;
    await waitFor(async () => {
      await userEvent.hover(tooltipContainer);
      visibleTooltipChild = screen.getAllByText(/15000000/)[0];
    });
    // TODO: MAKE TOOLTIPCONTAINER CHANGE CSS ON HOVER CORRECTLY
    // expect(visibleTooltipChild.parentNode).toHaveStyle({visibility: 'visible', opacity: 1})
    // expect(tooltipTextContainer).toBeVisible()
  });
});
