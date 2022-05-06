import React from 'react';
import { render, screen } from '@testing-library/react';

import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';

import Button from '../components/Button';

describe('Test jest setup', () => {
  it('Test button', () => {
    render(
    <ThemeProvider theme={theme}>
      <Button>Hello</Button>
    </ThemeProvider>
    );

    const ButtonText = screen.getByText(/Hello/i);
    expect(ButtonText).toBeInTheDocument();
  })
});