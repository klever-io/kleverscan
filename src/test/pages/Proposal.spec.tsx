import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import ProposalDetails, {
  getServerSideProps,
} from '../../pages/proposal/[number]';
import api from '../../services/api';
import { getMockedProposal } from '../../test/mocks/index';
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

describe('test proposal details page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render the page displaying the correct data for the mocked proposal number 0', async () => {
    // load mocked server side props:
    (api.get as jest.Mock).mockReturnValueOnce(getMockedProposal(0));

    const { props } = (await getServerSideProps({})) as any;

    // load page:
    renderWithTheme(<ProposalDetails {...props} />);

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

    const yesVotersBtn = screen.getByText(/Yes \(4\)/);
    const voter0 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );
    const voter1 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
    );
    const voter2 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
    );
    const voter3 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
    );

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

    const noVotersBtn = screen.getByText(/No \(2\)/);
    fireEvent.click(noVotersBtn);
    const noVoter0 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4',
    );
    const noVoter1 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs5',
    );
    expect(noVoter0).toBeInTheDocument();
    expect(noVoter1).toBeInTheDocument();
    expect(noVoter0).toBeVisible();
    expect(noVoter1).toBeVisible();

    const voter0Disappeared = screen.queryByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );
    expect(voter0Disappeared).toEqual(null);

    const noVoteDates = screen.getAllByText(/06\/24\/2022 12:00/);
    expect(noVoteDates.length).toEqual(2);
    const noVoterPowers = screen.getAllByText(/16.667%/);
    expect(noVoterPowers.length).toEqual(2);

    fireEvent.click(yesVotersBtn);
    const newVoter0 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );
    const newNoVoter0 = screen.queryByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4',
    );
    expect(newVoter0).toBeInTheDocument();
    expect(newVoter0).toBeVisible();
    expect(newNoVoter0).toEqual(null);
  });

  it('should render the page displaying the correct data for the mocked proposal number 7', async () => {
    (api.get as jest.Mock).mockReturnValueOnce(getMockedProposal(7));

    const { props } = (await getServerSideProps({})) as any;

    renderWithTheme(<ProposalDetails {...props} />);

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
    const totalVoted = screen.getByText(/712,528.422211/);
    const totalVotedPercent = screen.getByText(/71.18%/);
    const votedResume = screen.getByText(/Voted: 712.53 K \/ 1 Mi/);
    const yesPercentage = screen.getByText(/11.21%/);
    const noPercentage = screen.getByText(/59.97%/);
    const yesTotalVotes = screen.getByText(/112,213.412311/);
    const noTotalVotes = screen.getByText(/600,315.009900/);

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

    const yesVotersBtn = screen.getByText(/Yes \(1\)/);
    const voter0 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );

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

    const noVotersBtn = screen.getByText(/No \(3\)/);
    fireEvent.click(noVotersBtn);
    const noVoter1 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
    );
    const noVoter2 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
    );
    const noVoter3 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
    );
    const noVoters = [noVoter1, noVoter2, noVoter3];

    noVoters.forEach(voter => {
      expect(voter).toBeInTheDocument();
      expect(voter).toBeVisible();
    });

    const voter0Disappeared = screen.queryByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );
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
    const newVoter0 = screen.getByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
    );
    const newNoVoter0 = screen.queryByText(
      'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
    );
    expect(newVoter0).toBeInTheDocument();
    expect(newVoter0).toBeVisible();
    expect(newNoVoter0).toEqual(null);
  });

  it('should have the correct styles', async () => {
    (api.get as jest.Mock).mockReturnValueOnce(getMockedProposal(0));
    const { props } = (await getServerSideProps({})) as any;
    renderWithTheme(<ProposalDetails {...props} />);

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

    let yesVoters = screen.getByText(/Yes \(4\)/);
    let yesVotersBackground = yesVoters.parentElement;
    expect(yesVotersBackground).toBeInTheDocument();
    expect(yesVotersBackground).toBeVisible();
    expect(yesVotersBackground).toHaveStyle(selectedStyle);

    let noVoters = screen.getByText(/No \(2\)/);
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
    yesVoters = screen.getByText(/Yes \(4\)/);
    yesVotersBackground = yesVoters.parentElement;
    noVoters = screen.getByText(/No \(2\)/);
    noVotersBackground = noVoters.parentElement;
    expect(yesVotersBackground).toHaveStyle(notSelectedStyle);
    expect(noVotersBackground).toHaveStyle(selectedStyle);

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
  it('test getServerSideProps function', async () => {
    const parsedProposalResult = {
      props: {
        proposalId: 0,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'e46c6e4d389de415b04417562047fe1c9492f25cc477f7a838a2d7c18392f458',
        proposalStatus: 'ApprovedProposal',
        parameters: {
          '6': '15000000',
          '7': '40000000',
          '15': '5000000',
          '16': '7',
          '17': '1111',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8207,
        epochEnd: 8217,
        timestamp: 0,
        votes: { '0': 8000000000, '1': 4000000000 },
        voters: {
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr: {
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1: {
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2: {
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3: {
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4: {
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs5: {
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
        },
        totalStaked: 12000000000,
        votingPowers: {
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr: 2000000000,
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1: 2000000000,
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2: 2000000000,
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3: 2000000000,
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4: 2000000000,
          klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs5: 2000000000,
        },
        parsedParameters: [
          {
            paramIndex: '6',
            paramLabel: 'BlockRewards',
            paramValue: 15000000,
            paramText: 'Block Rewards',
          },
          {
            paramIndex: '7',
            paramLabel: 'StakingRewards',
            paramValue: 40000000,
            paramText: 'Staking Rewards',
          },
          {
            paramIndex: '15',
            paramLabel: 'KAppFeeWithdraw',
            paramValue: 5000000,
            paramText: 'KApp Fee for Withdraw',
          },
          {
            paramIndex: '16',
            paramLabel: 'KAppFeeClaim',
            paramValue: 7,
            paramText: 'KApp Fee for Claim',
          },
          {
            paramIndex: '17',
            paramLabel: 'KAppFeeUnjail',
            paramValue: 1111,
            paramText: 'KApp Fee for Unjail',
          },
        ],
      },
    };

    (api.get as jest.Mock).mockReturnValueOnce(getMockedProposal(0));

    const props = await getServerSideProps({});
    expect(props).toStrictEqual(parsedProposalResult);
  });
});
