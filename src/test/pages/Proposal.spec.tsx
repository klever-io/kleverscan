import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as myRouter from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ProposalDetails from '../../pages/proposal/[number]';
import {
  mockGetMockedProposal,
  mockNetworkParameters,
  mockOverViewParameters,
} from '../../test/mocks/index';
import { renderWithTheme } from '../../test/utils';

const promiseResolver = (router: any) => {
  const routerEnd = router.route.split('/')[1];
  switch (router.route) {
    case `proposals/${routerEnd}`:
      return Promise.resolve(
        mockGetMockedProposal(routerEnd, router.query.voteType),
      );
    case `network/${routerEnd}`:
      return Promise.resolve(mockNetworkParameters);
    case `node/${routerEnd}`:
      return Promise.resolve(mockOverViewParameters);
    default:
      return Promise.resolve({});
  }
};

const router1 = () => {
  return {
    route: '/proposal/',
    pathname: '',
    query: { number: 1 },
  };
};

const router2 = () => {
  return {
    route: '/proposal/',
    pathname: '',
    query: { number: 8 },
  };
};

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(promiseResolver),
  };
});

jest.mock('next/router', () => {
  return {
    __esModule: true,
    useRouter: jest.fn().mockImplementation(router1),
  };
});

describe('test proposal details page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render the page displaying the correct data for the mocked proposal number 1', async () => {
    const mockRouter = myRouter as { useRouter: any };
    mockRouter.useRouter = router1;

    await act(async () => {
      renderWithTheme(<ProposalDetails />);
    });

    const proposer = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
    );
    const hash = screen.getByText(
      'e46c6e4d389de415b04417562047fe1c9492f25cc477f7a838a2d7c18392f458',
    );
    const createdEpoch = screen.getByText('8207');
    const endedEpoch = screen.getByText('8217');
    const displayedData = [proposer, hash, createdEpoch, endedEpoch];
    displayedData.forEach(data => {
      expect(data).toBeInTheDocument();
      expect(data).toBeVisible();
    });

    const networkParams = [
      'Block Rewards',
      'Staking Rewards',
      'KApp Fee for Withdraw',
      'KApp Fee for Claim',
      'KApp Fee for Unjail',
    ];
    const networkParamsValues = [
      '15000000',
      '40000000',
      '5000000',
      '7',
      '1111',
    ];
    networkParams.forEach((param, index) => {
      const searchedParam = screen.getByText(param);
      expect(searchedParam).toBeInTheDocument();
      expect(searchedParam.nextElementSibling).toHaveTextContent(
        networkParamsValues[index],
      );
    });
    const totalVoted = screen.getByText(/12,000.000000/);
    const totalVotedPercent = screen.getByText(/100.00%/);
    const votedResume = screen.getByText(/Voted: 12 K \/ 12 K/);
    const yesPercentage = screen.getByText(/66.67%/);
    const noPercentage = screen.getByText(/33.33%/);
    const yesTotalVotes = screen.getByText(/8,000.000000/);
    const noTotalVotes = screen.getByText(/4,000.000000/);

    const votesData = [
      totalVoted,
      totalVotedPercent,
      votedResume,
      yesPercentage,
      noPercentage,
      yesTotalVotes,
      noTotalVotes,
    ];
    votesData.forEach(data => {
      expect(data).toBeInTheDocument();
      expect(data).toBeVisible();
    });

    const yesVotersBtn = screen.getAllByText(/Yes/)[1];
    const voter0 = screen.getByText('klv1vq9f7xta...sfu3xshpmjsr');
    const voter1 = screen.getByText('klv1vq9f7xta...sfu3xshpmjs1');
    const voter2 = screen.getByText('klv1vq9f7xta...sfu3xshpmjs2');
    const voter3 = screen.getByText('klv1vq9f7xta...sfu3xshpmjs3');

    const yesVoters = [voter0, voter1, voter2, voter3];
    yesVoters.forEach(voter => {
      expect(voter).toBeInTheDocument();
      expect(voter).toBeVisible();
    });
    expect(yesVotersBtn).toBeInTheDocument();
    expect(yesVotersBtn).toBeVisible();
    const yesVoteDates = screen.getAllByText(/06\/24\/2022 12:00/);
    expect(yesVoteDates.length).toEqual(4);
    const yesVoterPowers = screen.getAllByText(/16.667%/);
    expect(yesVoterPowers.length).toEqual(4);

    for (let i = 0; i < 4; i += 1) {
      expect(yesVoteDates[i]).toHaveTextContent(/06\/24\/2022 12:00/);
      expect(yesVoterPowers[i]).toHaveTextContent(/16.667%/);
    }

    const noVotersBtn = screen.getAllByText(/No/)[1];
    fireEvent.click(noVotersBtn);

    const noVoter0 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjs4');
    const noVoter1 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjs5');
    expect(noVoter0).toBeInTheDocument();
    expect(noVoter1).toBeInTheDocument();
    expect(noVoter0).toBeVisible();
    expect(noVoter1).toBeVisible();

    const voter0Disappeared = screen.queryByText('klv1vq9f7xta...sfu3xshpmjsr');
    expect(voter0Disappeared).toEqual(null);

    const noVoteDates = screen.getAllByText(/06\/24\/2022 12:00/);
    expect(noVoteDates.length).toEqual(2);
    const noVoterPowers = screen.getAllByText(/16.667%/);
    expect(noVoterPowers.length).toEqual(2);

    fireEvent.click(yesVotersBtn);
    const newVoter0 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjsr');
    const newNoVoter0 = screen.queryByText('klv1vq9f7xta...sfu3xshpmjs4');
    expect(newVoter0).toBeInTheDocument();
    expect(newVoter0).toBeVisible();
    expect(newNoVoter0).toEqual(null);
  });

  it('should render the page displaying the correct data for the mocked proposal number 8', async () => {
    const mockRouter = myRouter as { useRouter: any };
    mockRouter.useRouter = router2;

    await act(async () => {
      renderWithTheme(<ProposalDetails />);
    });

    const proposer = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
    );
    const hash = screen.getByText(
      '871640d46a5d747766cd5a9b806860c2a4e255d489e26d9821a41519e7e35914',
    );
    const createdEpoch = screen.getByText('89');
    const endedEpoch = screen.getByText('99');
    const displayedData = [proposer, hash, createdEpoch, endedEpoch];
    displayedData.forEach(data => {
      expect(data).toBeInTheDocument();
      expect(data).toBeVisible();
    });

    const networkParams = ['Block Rewards'];
    const networkParamsValues = ['15000000'];
    networkParams.forEach((param, index) => {
      const searchedParam = screen.getByText(param);
      expect(searchedParam).toBeInTheDocument();
      expect(searchedParam.nextElementSibling).toHaveTextContent(
        networkParamsValues[index],
      );
    });

    const totalVoted = screen.getByText(/5,080,469.741311/);
    const totalVotedPercent = screen.getByText(/507.51%/);
    const votedResume = screen.getByText(/Voted: 5.08 Mi \/ 1 Mi/);
    const yesPercentage = screen.getByText(/11.21%/);
    const noPercentage = screen.getByText(/496.30%/);
    const yesTotalVotes = screen.getByText(/112,213.412311/);
    const noTotalVotes = screen.getByText(/4,968,256.329000/);

    const votesData = [
      totalVoted,
      totalVotedPercent,
      votedResume,
      yesPercentage,
      noPercentage,
      yesTotalVotes,
      noTotalVotes,
    ];
    votesData.forEach(data => {
      expect(data).toBeInTheDocument();
      expect(data).toBeVisible();
    });

    const yesVotersBtn = screen.getAllByText(/Yes/)[1];
    const voter0 = screen.getByText('klv1vq9f7xta...sfu3xshpmjsr');

    const yesVoters = [voter0];
    yesVoters.forEach(voter => {
      expect(voter).toBeInTheDocument();
      expect(voter).toBeVisible();
    });
    expect(yesVotersBtn).toBeInTheDocument();
    expect(yesVotersBtn).toBeVisible();

    const yesVoteDates = screen.getAllByText(/06\/24\/2022 11:54/);
    expect(yesVoteDates.length).toEqual(1);
    const yesVoterPowers = screen.getAllByText(/11.210%/);
    expect(yesVoterPowers.length).toEqual(1);

    for (let i = 0; i < 1; i += 1) {
      expect(yesVoteDates[i]).toHaveTextContent(/06\/24\/2022 11:54/);
      expect(yesVoterPowers[i]).toHaveTextContent(/11.210%/);
    }

    const noVotersBtn = screen.getAllByText(/No/)[1]
      .parentElement as HTMLElement;

    fireEvent.click(noVotersBtn);

    const noVoter1 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjs1');
    const noVoter2 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjs2');
    const noVoter3 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjs3');
    const noVoters = [noVoter1, noVoter2, noVoter3];

    noVoters.forEach(voter => {
      expect(voter).toBeInTheDocument();
      expect(voter).toBeVisible();
    });

    const voter0Disappeared = screen.queryByText('klv1vq9f7xta...sfu3xshpmjsr');
    expect(voter0Disappeared).toEqual(null);

    const noVoteDates = screen.getAllByText(/06\/24\/2022 12:44/);
    expect(noVoteDates.length).toEqual(3);
    const noVoterPower0 = screen.getByText(/10.000%/);
    const noVoterPower1 = screen.getByText(/19.990%/);
    const noVoterPower2 = screen.getByText(/29.979%/);

    const noVotersPowers = [noVoterPower0, noVoterPower1, noVoterPower2];
    noVotersPowers.forEach(power => {
      expect(power).toBeInTheDocument();
      expect(power).toBeVisible();
    });

    fireEvent.click(yesVotersBtn);
    const newVoter0 = await screen.findByText('klv1vq9f7xta...sfu3xshpmjsr');
    const newNoVoter0 = screen.queryByText('klv1vq9f7xta...sfu3xshpmjs1');
    expect(newVoter0).toBeInTheDocument();
    expect(newVoter0).toBeVisible();
    expect(newNoVoter0).toEqual(null);
  });

  it('should have the correct styles for proposal number 1', async () => {
    const mockRouter = myRouter as { useRouter: any };
    mockRouter.useRouter = router1;

    await act(async () => {
      renderWithTheme(<ProposalDetails />);
    });
    const passThreshold = screen.getByText('Pass threshold');
    expect(passThreshold).toBeInTheDocument();
    expect(passThreshold).toBeVisible();
    expect(passThreshold).toHaveStyle({
      color: '#b039bf',
      fontSize: '11px',
      marginBottom: '5px',
      fontWeight: 'bold',
    });
    const purpleBar =
      passThreshold.parentElement?.nextElementSibling?.firstElementChild;
    expect(purpleBar).toBeInTheDocument();
    expect(purpleBar).toBeVisible();
    expect(purpleBar).toHaveStyle({
      height: '3rem',
      width: '66.67%',
      backgroundColor: '#B039BF',
    });

    const redBar = purpleBar?.nextElementSibling;
    expect(redBar).toBeInTheDocument();
    expect(redBar).toBeVisible();
    expect(redBar).toHaveStyle({
      height: '3rem',
      width: '33.33%',
      backgroundColor: '#FF4A4A',
    });

    const totalYesVotes = screen.getByText('8,000.000000');
    const yesVotesBox = totalYesVotes.parentElement;
    expect(yesVotesBox).toBeInTheDocument();
    expect(yesVotesBox).toBeVisible();
    expect(yesVotesBox).toHaveStyle({
      width: '13rem',
      padding: '30px 25px 30px 25px',
      border: '1px solid #B039BF',
      borderRadius: '10px',
    });

    const noVotesBox = yesVotesBox?.nextElementSibling;
    expect(noVotesBox).toBeInTheDocument();
    expect(noVotesBox).toBeVisible();
    expect(noVotesBox).toHaveStyle({
      width: '13rem',
      padding: '30px 25px 30px 25px',
      border: '1px solid #FF4A4A',
      borderRadius: '10px',
    });

    const selectedStyle = {
      backgroundColor: '#B039BF',
      padding: '6px 11px 6px 11px',
      borderRadius: '13px',
      cursor: 'pointer',
    };

    const notSelectedStyle = {
      backgroundColor: 'rgb(0,0,0,0.4)',
      padding: '6px 11px 6px 11px',
      borderRadius: '13px',
      cursor: 'pointer',
    };

    let yesVoters = screen.getAllByText(/Yes/)[1];
    let yesVotersBackground = yesVoters.parentElement;
    expect(yesVotersBackground).toBeInTheDocument();
    expect(yesVotersBackground).toBeVisible();
    expect(yesVotersBackground).toHaveStyle(selectedStyle);

    let noVoters = screen.getAllByText(/No/)[1];
    let noVotersBackground = noVoters.parentElement;
    expect(noVotersBackground).toBeInTheDocument();
    expect(noVotersBackground).toBeVisible();
    expect(noVotersBackground).toHaveStyle(notSelectedStyle);

    const yesVotesDate = screen.getAllByText('06/24/2022 12:00');
    yesVotesDate.forEach(date => {
      const YesVoteIcon = date.previousElementSibling;
      expect(YesVoteIcon).toBeInTheDocument();
      expect(YesVoteIcon).toBeVisible();
      expect(YesVoteIcon).toHaveStyle({
        color: 'rgb(176, 57, 191)',
        marginRight: '5px',
      });
    });
    fireEvent.click(noVoters);
    await waitFor(
      () => {
        yesVoters = screen.getAllByText(/Yes/)[1];
        yesVotersBackground = yesVoters.parentElement;
        noVoters = screen.getAllByText(/No/)[1];
        noVotersBackground = noVoters.parentElement;
        expect(yesVotersBackground).toHaveStyle(notSelectedStyle);
        expect(noVotersBackground).toHaveStyle(selectedStyle);
      },
      {
        timeout: 3000,
        interval: 100,
      },
    );

    const noVotesDate = screen.getAllByText('06/24/2022 12:00');
    noVotesDate.forEach(date => {
      const noVoteIcon = date.previousElementSibling;
      expect(noVoteIcon).toBeInTheDocument();
      expect(noVoteIcon).toBeVisible();
      expect(noVoteIcon).toHaveStyle({
        color: 'rgb(255, 74, 74)',
        marginRight: '5px',
      });
    });
  });
});
