import { screen } from '@testing-library/react';
import React from 'react';
import CoinCardSkeleton from '.';
import { renderWithTheme } from '../../../../test/utils';

describe('Component: CoinCardSkeleton', () => {
  it('Should render all the Skeleton components', () => {
    const container = renderWithTheme(<CoinCardSkeleton />).container;
    const skeletonsInCoinCards = screen.getAllByTestId('skeleton');

    expect(skeletonsInCoinCards.length).toBe(8);
  });
});
