import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { CoinTest } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';
import { getVariation } from '../../../utils/index';
import CoinCard from './';

describe('Component: CoinCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const actualTPS = '30 / 300';

  it('Should render the CoinCard with the correct text', () => {
    renderWithTheme(<CoinCard coins={CoinTest} actualTPS={actualTPS} />);

    expect(screen.getByText(CoinTest[0].shortname)).toBeInTheDocument();
    expect(screen.getByText(CoinTest[0].name)).toBeInTheDocument();
    expect(
      screen.getByText(getVariation(CoinTest[0].variation)),
    ).toBeInTheDocument();

    [CoinTest[0].marketCap, CoinTest[0].volume].map((item: any) => {
      expect(screen.getAllByText(getVariation(item.variation)))[0];
      expect(screen.getByText(`$ ${item.price.toLocaleString()}`));
    });
  });

  // it('Should have the correct styles for width and border-radius', () => {
  //   const { container } = renderWithTheme(
  //     <CoinCard coins={CoinTest} actualTPS={actualTPS} />
  //   );

  //   const style = {
  //     width: '21rem',
  //     borderRadius: '1rem',
  //   };

  //   expect(container.firstChild?.firstChild).toHaveStyle(style);
  // });

  it('Test the selector when click and scroll to select a coin', () => {
    const { container } = renderWithTheme(
      <CoinCard coins={CoinTest} actualTPS={actualTPS} />,
    );

    const coinSelector: any = container.firstChild?.lastChild?.childNodes[1];
    fireEvent.click(coinSelector);
    const contentScroll: any = container.firstChild?.firstChild;
    fireEvent.scroll(contentScroll);
  });
});
