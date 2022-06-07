import React from 'react';
import { screen } from '@testing-library/react';

import theme from '../../../styles/theme';

import { parseAddress } from '@/utils/index';
import Proposals from './';
import { renderWithTheme } from '../../../test/utils';

const mockedProposals: any = [
  {
    proposalId: 0,
    description: 'Test description',
    epochStart: 0,
    epochEnd: 10000,
    proposalStatus: 'sucess',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
    votes: 10223
  },
  {
    proposalId: 1,
    description: '',
    epochStart: 500,
    epochEnd: 30000,
    proposalStatus: 'sucess',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waa5s89w5s25',
    votes: 53257
  }
];

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
    });
  },
}));

describe('Component: Tabs/Proposals' , () => {
  
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
    // TODO - Add upvotes / total staked test
    renderWithTheme(
      <Proposals loading={false} proposalParams={mockedProposals} />
    );
    const proposalId = screen.getByText(`#${mockedProposals[0].proposalId}`);
    const description = screen.getByText(mockedProposals[0].description);
    const proposer = screen.getByText(parseAddress(mockedProposals[0].proposer, 8));
    const epochStart = screen.getAllByText(/Start/i)[0];
    const epochEnd = screen.getAllByText(/End/i)[0];
    
    expect(proposalId).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(proposer).toBeInTheDocument();
    expect(epochStart).toBeInTheDocument();
    expect(epochEnd).toBeInTheDocument();
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
    const status = screen.getAllByRole('link', { name: /Details/i})[0].parentNode?.previousSibling;
    const percentIndicator = status?.previousSibling?.firstChild?.nextSibling?.lastChild;
    const description = screen.getByText(mockedProposals[0].description);

    const proposerStyle = {
      color: theme.table.text,
      fontWeight: 600,
      fontSize: '0.85rem',
    };
    const percentIndicatorStyle = {
      margin: '0 auto',
      position: 'absolute',
      top: '0.25rem',
      left: '30%',
    };
    const descriptionStyle = {
      overflow: 'auto',
      whiteSpace: 'normal',
      paddingBottom: '0.25rem',
    };

    expect(proposer).toHaveStyle(proposerStyle);
    expect(percentIndicator).toHaveStyle(percentIndicatorStyle);
    expect(description).toHaveStyle(descriptionStyle);

  });
});