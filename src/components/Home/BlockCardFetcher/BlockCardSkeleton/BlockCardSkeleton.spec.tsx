import theme from '@/styles/theme';
import { renderWithTheme } from '@/test/utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { default as BlockCardSkeleton } from '.';

describe('Component: BlockCard', () => {
  const textBlockCard: string[] = [
    'Titles.Transactions',
    'Miner',
    'Burned',
    'Reward',
  ];

  it('Should render the BlockCardSkeleton with the correct text', () => {
    renderWithTheme(<BlockCardSkeleton index={0} />);

    //mock translation t() function
    jest.mock('next-i18next', () => ({
      t: (key: string) => key,
      commonT: (key: string) => key,
    }));

    textBlockCard.forEach((item: string) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('Should have the correct styles for background-color, border-radius, cursor and padding', () => {
    const { container } = renderWithTheme(<BlockCardSkeleton index={0} />);

    const style = {
      backgroundColor: theme.white,
      borderRadius: '1rem',
      cursor: 'pointer',
      padding: '1.5rem',
    };

    expect(container.firstChild).toHaveStyle(style);
  });
});
