import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithTheme } from '../../test/utils';
import Proposals, { getServerSideProps } from '../../pages/proposals/index';
import api from '../../services/api';
import {
  mockedProposalsList,
  mockedProposalsListPage2,
  networkParametersMock,
} from '../../test/mocks/index';


jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
  };
});
describe('test proposals page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should get the right props from ssp and render the elements correctly', async () => {
    (api.get as jest.Mock)
      .mockReturnValueOnce(networkParametersMock)
      .mockReturnValueOnce(mockedProposalsList);
    const getServerSidePropsCopy = getServerSideProps as any;
    const { props } = (await getServerSidePropsCopy({})) as any;
    act(() => {
      renderWithTheme(<Proposals {...props} />);
    });

    const pageInitialText = screen.getByText(
      /The committee is made up of KFI holders/,
    );

    const pageInitialTextContent =
      'The committee is made up of KFI holders who are responsible for modifying dynamic parameters such as block rewards and transaction fees on the KLV network. Each KFI holder who has KFI frozen is entitled to initiate and vote for proposals. A proposal is adopted as long as it is voted for by at least half of all the KFI frozen by the network. The adopted proposal will apply its changes to network parameters in the next epoch.';

    expect(pageInitialText).toBeInTheDocument();
    expect(pageInitialText).toBeVisible();
    expect(pageInitialText).toHaveTextContent(pageInitialTextContent);
  });

  it('should paginate the proposals correctly', async () => {
    (api.get as jest.Mock)
      .mockReturnValueOnce(networkParametersMock)
      .mockReturnValueOnce(mockedProposalsList)
      .mockReturnValueOnce(mockedProposalsListPage2);
    const getServerSidePropsCopy = getServerSideProps as any;
    const { props } = (await getServerSidePropsCopy({})) as any;
    act(() => {
      renderWithTheme(<Proposals {...props} />);
    });

    const networkParamsTabProof = screen.getByText(
      'KApp Fee for Asset Trigger',
    );
    expect(networkParamsTabProof).toBeInTheDocument();
    expect(networkParamsTabProof).toBeVisible();

    let proposalsTabProof = screen.queryAllByText('ApprovedProposal');
    expect(proposalsTabProof.length).toEqual(0);
    const proposalsTab = screen.getByText('Proposals');

    fireEvent.click(proposalsTab);

    expect(networkParamsTabProof).not.toBeInTheDocument();
    proposalsTabProof = screen.queryAllByText('ApprovedProposal');
    expect(proposalsTabProof.length).toEqual(3);
    expect(networkParamsTabProof).not.toBeInTheDocument();

    const page1Proposal = screen.getByText(/0\/4,000,000/);
    let page2Proposal = screen.queryByText(/0\/3,000,000/);
    expect(page2Proposal).toEqual(null);
    expect(page1Proposal).toBeInTheDocument();
    expect(page1Proposal).toBeVisible();
    const page2 = screen.getByText('2');
    await waitFor(() => {
      fireEvent.click(page2);
    });
    expect(page1Proposal).not.toBeInTheDocument();
    page2Proposal = screen.getByText(/0\/3,000,000/);
    expect(page2Proposal).toBeInTheDocument();
    expect(page2Proposal).toBeVisible();
  });
});
