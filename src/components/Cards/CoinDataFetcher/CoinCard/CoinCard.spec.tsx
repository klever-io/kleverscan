import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import CoinCard from '.';
import { CoinTest } from '../../../../test/mocks';
import { renderWithTheme } from '../../../../test/utils';

describe('Component: CoinCard', () => {
  it('Should render the CoinCard with the correct text', async () => {
    const container = renderWithTheme(<CoinCard />).container;
    expect(screen.getByText(CoinTest[0].shortname)).toBeInTheDocument();
    expect(screen.getByText(CoinTest[1].shortname)).toBeInTheDocument();
    // expect(
    //   screen.getByText(getVariation(CoinTest[0].variation)),
    // ).toBeInTheDocument();
    // [CoinTest[0].marketCap, CoinTest[0].volume].map(
    //   (item: ICoinInfo['marketCap'] | ICoinInfo['volume']) => {
    //     expect(screen.getAllByText(getVariation(item.variation)))[0];
    //     expect(screen.getByText(`$ ${' '}${item.price.toLocaleString()}`));
    //   },
    // );
  });

  // it('Should have the correct styles for width and border-radius', () => {
  //   const { container } = renderWithTheme(
  //   );

  //   const style = {
  //     width: '21rem',
  //     borderRadius: '1rem',
  //   };

  //   expect(container.firstChild?.firstChild).toHaveStyle(style);
  // });

  it('Test the selector when click and scroll to select a coin', () => {
    const { container } = renderWithTheme(<CoinCard />);

    const coinSelector = screen.getByRole('button', {
      name: new RegExp('Coin ' + CoinTest[1].shortname),
    });
    fireEvent.click(coinSelector);
  });
});
