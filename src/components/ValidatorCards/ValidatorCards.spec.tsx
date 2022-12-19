import { screen } from '@testing-library/react';
import React from 'react';
import ValidatorCards from '.';
import { renderWithTheme } from '../../test/utils';

describe('test ValidatorCards component', () => {
  beforeAll(() => {
    jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockReturnValue(100);
    jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(100);
    jest.clearAllMocks();
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('should render the component', () => {
    renderWithTheme(
      <ValidatorCards
        totalStake={10000000000000}
        commission={2000}
        maxDelegation={10000000000000}
      />,
    );

    const currentDelegationsLabel = screen.getByText(/Current Delegations/i);
    const currentDelegationsTime = screen.getAllByText(
      /\(Updated: 0 sec ago\)/i,
    )[0];
    const currentDelegationsValue = screen.getAllByText(/10,000,000/i)[0];
    const currentDelegationsPercentage = screen.getByText(/\+3\.75%/i);

    const rewardDistributionRatioLabel = screen.getByText(
      /Reward Distribution Ratio/i,
    );
    const rewardDistributionRatioVotersLabel = screen.getByText(/Voters/i);
    const rewardDistributionRatioCommissionLabel =
      screen.getByText(/Commission/i);
    const rewardDistributionRatioVotersValue = screen.getByText(/80%/i);
    const rewardDistributionRatioCommissionValue = screen.getByText(/20%/i);

    const delegatedLabel = screen.getByText(/Delegated/i);
    const delegatedTime = screen.getAllByText(/\(Updated: 0 sec ago\)/i)[1];
    const delegatedValue = screen.getAllByText(/10,000,000/i)[1];
    const delegatedPercentage = screen.getByText(/100%/i);

    [
      currentDelegationsLabel,
      currentDelegationsTime,
      currentDelegationsValue,
      currentDelegationsPercentage,
      rewardDistributionRatioLabel,
      rewardDistributionRatioVotersLabel,
      rewardDistributionRatioCommissionLabel,
      rewardDistributionRatioVotersValue,
      rewardDistributionRatioCommissionValue,
      delegatedLabel,
      delegatedTime,
      delegatedValue,
      delegatedPercentage,
    ].forEach(item => {
      expect(item).toBeInTheDocument();
    });
  });
});
