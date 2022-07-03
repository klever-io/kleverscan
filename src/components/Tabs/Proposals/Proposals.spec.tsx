import React from 'react';
import { screen } from '@testing-library/react';

import theme from '../../../styles/theme';
import { parseAddress } from '../../../utils/index';
import Proposals from './';
import { renderWithTheme } from '../../../test/utils';
import { mockedProposals} from '../../../test/mocks'

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
    });
  },
}));

describe('Component: Tabs/Proposals' , () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  
  it('Should render the Table and it\'s body and the header correctly', () => {
    renderWithTheme(
      <Proposals loading={false} proposalParams={mockedProposals} />
    );
    const proposalId = screen.getByText(`#${mockedProposals[0].proposalId}`);
    const headers = ['Number', 'Proposal Content', 'Time', 'Upvotes/Total Staked', 'Status'];

    const tableBody = proposalId.parentNode?.parentNode?.parentNode;
    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };

    expect(tableBody).toHaveStyle(tableBodyStyle);
    headers.forEach(( name ) => {
      const header = screen.getByText(name);
      expect(header).toBeInTheDocument();
    });
  });

  it('Should render the "Number", "Proposal Content", "Time", "Upvotes/Total Staked" and "Status" with the correct values', () => {
    renderWithTheme(
      <Proposals loading={false} proposalParams={mockedProposals} />
    );
    const proposalId = screen.getByText(`#${mockedProposals[0].proposalId}`);
    const description = screen.getByText(mockedProposals[0].description);
    const proposer = screen.getByText(parseAddress(mockedProposals[0].proposer, 8));
    const epochStart = screen.getAllByText(/Created Epoch/i)[0];
    const epochEnd = screen.getAllByText(/Ended Epoch/i)[0];
    
    
    expect(proposalId).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(proposer).toBeInTheDocument();
    expect(epochStart).toBeInTheDocument();
    expect(epochEnd).toBeInTheDocument();
    expect(epochStart).toHaveTextContent('Created Epoch: 4');
    expect(epochEnd).toHaveTextContent('Ended Epoch: 8');

    mockedProposals.forEach(({ votes, totalStaked }) => {
      const calc = `${votes["0"] / 1000000}\\${totalStaked}`;
      const votesAndTotalStaked = screen.getByText(calc);
      expect(votesAndTotalStaked).toBeInTheDocument();
      expect(votesAndTotalStaked).toHaveTextContent(calc);
    });
  });

  it('Should render "-" if don\'t pass any description and the "Details" button with the correct href', () => {
    renderWithTheme(
      <Proposals loading={false} proposalParams={mockedProposals} />
    );

    const proposer = screen.getAllByText(/Proposer/i)[1];
    const description = proposer.previousSibling;
    const links = screen.getAllByRole('link', { name: /Details/i});

    expect(proposer).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('-');
    links.forEach(( link, index ) => {
      expect(link)
      .toHaveAttribute('href', `/proposal/${mockedProposals[index].proposalId}`);
    });

  });

  it('Should match the style of the elements', () => {
    renderWithTheme(
      <Proposals loading={false} proposalParams={mockedProposals} />
    );
    const proposer = screen.getAllByText(/Proposer/i)[0];
    const description = screen.getByText(mockedProposals[0].description);

    const proposerStyle = {
      color: theme.table.text,
      fontWeight: 600,
      fontSize: '0.85rem',
    };

    const descriptionStyle = {
      overflow: 'auto',
      whiteSpace: 'normal',
      paddingBottom: '0.25rem',
    };

    expect(proposer).toHaveStyle(proposerStyle);
    expect(description).toHaveStyle(descriptionStyle);

  });
});
