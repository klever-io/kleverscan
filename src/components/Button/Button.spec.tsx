import React from 'react';
import { screen } from '@testing-library/react';

import theme from '../../styles/theme';

import Button from './';
import { renderWithTheme } from '../../test/utils';

describe('Component: Button', () => {
  it('Should render the button with the correct text', () => {
    renderWithTheme(<Button>Click</Button>)

    const button = screen.getByRole('button', {name: /Click/i});
    expect(button).toBeInTheDocument();
  });

  it('Should have the correct styles for background-color, border, border-radius, cursor and color when not in main page', () => {
    const { container } = renderWithTheme(<Button>Click</Button>);
    const styles = {
    background: theme.white,
    border: `1px solid ${theme.rose}`,
    borderRadius: '0.25rem',
    color: theme.white,
    cursor: 'pointer'
    };

    expect(container.firstChild).toHaveStyle(styles);
  });

  it('Should have the correct background-image, background-color and radius when is on main page', () => {
    const { container } = renderWithTheme(<Button mainPage>Click</Button>);
    const styles = {
    backgroundImage: theme.button.background,
    backgroundColor: 'unset',
    borderRadius: '0.5rem',
    };
    
    expect(container.firstChild).toHaveStyle(styles);
  })
  
}); 