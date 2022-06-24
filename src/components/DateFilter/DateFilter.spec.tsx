import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


import theme from '../../styles/theme';

import { renderWithTheme } from '../../test/utils';
import DateFilter from './';

const props = { 
  resetDate: jest.fn(),
  filterDate: jest.fn(),
  empty: true,
}

describe('Component: Footer', () => {
  beforeEach(() => {
    renderWithTheme(<DateFilter {...props} />);
  });

  it('Should render the input with the "Add filter by ', () => {
    const input = screen.getByPlaceholderText(/Add filter by date/i);
    expect(input).toBeInTheDocument();    
  });

  it('Should render the calendar container after click on the input', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Add filter by date/i);

    await user.click(input);

    const calendar = screen.getByText(/Date Filter/i);
    expect(calendar).toBeInTheDocument();
  });

  it('Should match the style of the input and the calendar container', async() => {
    const user = userEvent.setup();

    const inputStyle = {
      width: '75%',
      fontWeight: '700',
      cursor: 'pointer',
      caretColor: 'transparent',
    };
    const input = screen.getByPlaceholderText(/Add filter by date/i);
    expect(input).toHaveStyle(inputStyle);

    await user.click(input);
    
    const calendarContainer = screen.getByText(/Date Filter/i).parentNode?.parentNode?.parentNode;

    const calendarStyle = {
      minHeight: '18rem',
      width: '18rem',
      padding: '1rem',
      backgroundColor: `${theme.white}`,
      left: '-3rem',
      bottom: '-0.5rem',
      position: 'absolute',
      borderRadius: '20px',
    };
    expect(calendarContainer).toHaveStyle(calendarStyle);
  });
});