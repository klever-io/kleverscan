import React from 'react';

import CoinCard from './';
import { renderWithTheme, CoinTest } from '../../../test/utils';
import { getVariation } from '@/utils/index';

import {screen} from '@testing-library/react'

describe('Component: CoinCard', () => {
  const actualTPS = '30 / 300';

  it('Should render the CoinCard with the correct text', () => {
    renderWithTheme(
      <CoinCard coins={[CoinTest]} actualTPS={actualTPS} />
    );

    expect(screen.getByText(CoinTest.shortname)).toBeInTheDocument();
    expect(screen.getByText(CoinTest.name)).toBeInTheDocument();
    expect(screen.getByText(getVariation(CoinTest.variation))).toBeInTheDocument();

    [CoinTest.marketCap, CoinTest.volume].map((item: any) => {
      expect(screen.getByText(getVariation(item.variation)));
      expect(screen.getByText(`$ ${item.price.toLocaleString()}`));      
    })
  });

  it('Should have the correct styles for width and border-radius', () => {
    const { container } = renderWithTheme(
      <CoinCard coins={[CoinTest]} actualTPS={actualTPS} />
    );

    const style = {
      width: '21rem',
      borderRadius: '1rem',
    };

    expect(container.firstChild?.firstChild).toHaveStyle(style);
    expect(container.firstChild?.firstChild?.firstChild).toHaveStyle('width: auto');
  });
}); 
