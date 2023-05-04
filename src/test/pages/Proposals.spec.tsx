import { CustomRouter } from '@/components/Tabs/ProprietaryAssets/ProprietaryAssets.spec';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import * as myRouter from 'next/router';
import React from 'react';
import Proposals from '../../pages/proposals/index';
import api from '../../services/api';
import {
  mockedProposalsList,
  mockedProposalsListPage2,
  mockNetworkParameters,
} from '../../test/mocks/index';
import { renderWithTheme } from '../../test/utils';

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

const router1 = () => {
  return {
    route: '/',
    pathname: '',
    query: '',
  };
};

jest.mock('next/router', () => {
  return {
    __esModule: true,
    useRouter: jest.fn().mockImplementation(router1),
  };
});
window.scrollTo = jest.fn();

describe('test proposals page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(api, 'get').mockImplementation(params => {
      switch (true) {
        case params.route.includes('network'):
          return Promise.resolve(mockNetworkParameters);
        case params.route.includes('proposals/list?status=&page=1'):
          return Promise.resolve(mockedProposalsList);
        case params.route.includes('proposals/list?status=&page=2'):
          return Promise.resolve(mockedProposalsListPage2);
        default:
          return Promise.reject(new Error(`Unexpected route: ${params.route}`));
      }
    });
  });
  it('should get the right props from ssp and render the elements correctly', async () => {
    act(() => {
      renderWithTheme(<Proposals />);
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
    const mockRouter: { useRouter: () => CustomRouter } = myRouter;
    mockRouter.useRouter = () =>
      ({
        asPath: '',
        basePath: '',
        isLocaleDomain: false,
        push: jest.fn(),
        ...router1(),
      } as unknown as CustomRouter);
    await act(async () => {
      renderWithTheme(<Proposals />);
    });

    const networkParamsTabProof = screen.getByText(
      'KApp Fee for Asset Trigger',
    );
    expect(networkParamsTabProof).toBeInTheDocument();
    expect(networkParamsTabProof).toBeVisible();

    let proposalsTabProof = screen.queryAllByText('ApprovedProposal');
    expect(proposalsTabProof.length).toEqual(0);
    const proposalsTab = screen.getAllByText('Proposals')[1];

    await act(async () => {
      fireEvent.click(proposalsTab);
    });
    expect(networkParamsTabProof).not.toBeInTheDocument();
    proposalsTabProof = screen.queryAllByText('ApprovedProposal');
    expect(proposalsTabProof.length).toEqual(4);
    expect(networkParamsTabProof).not.toBeInTheDocument();
    const page1Proposal = screen.getAllByText(/0\/4,000,000/)[0];
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
