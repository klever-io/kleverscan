import React from 'react';

import theme from '../../../styles/theme';
import {screen} from '@testing-library/react'

import BlockCard from './';
import { renderWithTheme } from '../../../test/utils';
import { getAge } from '../../../utils';
import { fromUnixTime } from 'date-fns';

describe('Component: BlockCard', () => {
  const textBlockCard: string[] = ['Transactions', 'Miner', 'Burned', 'Reward'];
  const timestamp = 1652813596000;
  const hash = '110f313d0abe5a559c12e7c695037d930d5d5a05389fe17901ed03058d36b79a';
  const txBurnedFees = 1500000;
  const precision = 6;
  const nonce = 262522;
  const txCount = 146;
  const blockRewards = 15000000;

  it('Should render the BlockCard with the correct text', () => {
    renderWithTheme(
      <BlockCard
        hash={hash}
        nonce={nonce}
        parentHash={''}
        timestamp={timestamp}
        txCount={txCount}
        blockRewards={blockRewards}
        txBurnedFees={txBurnedFees}
        precision={precision}
      />
    );

    expect(screen.getByText(getAge(fromUnixTime(timestamp / 1000)) + ' ago')).toBeInTheDocument();
    expect(screen.getByText(hash)).toBeInTheDocument();
    expect(screen.getByText(`#${nonce}`)).toBeInTheDocument();

    textBlockCard.forEach((item: string) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    })
  });

  it('Should have the correct styles for background-color, border-radius, cursor and padding', () => {
    const { container } = renderWithTheme(
      <BlockCard
        hash={hash}
        nonce={nonce}
        parentHash={''}
        timestamp={timestamp}
        txCount={txCount}
        blockRewards={blockRewards}
        txBurnedFees={txBurnedFees}
        precision={precision}
      />
    );

    const style = {
      backgroundColor: theme.white,
      borderRadius: '1rem',
      cursor: 'pointer',
      padding: '1.5rem',
    };

    expect(container.firstChild).toHaveStyle(style);
  });
}); 
