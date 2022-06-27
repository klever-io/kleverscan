import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


import theme from '../../styles/theme';

import { renderWithTheme, getMonthWithYear } from '../../test/utils';
import DateFilter from './';

const props = {
  resetDate: jest.fn(),
  filterDate: jest.fn(),
  empty: true,
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

  it('Should render the correct month if click on arrows to change month', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Add filter by date/i);

    await user.click(input);

    const arrowLeft: any = screen.getByText(/Choose the proper date/i).parentNode?.nextSibling?.firstChild?.firstChild;
    const rightArrow: any = screen.getByText(/Choose the proper date/i).parentNode?.nextSibling?.firstChild?.lastChild;


    const presentMonth = getMonthWithYear('', months);
    expect(screen.getByText(presentMonth)).toHaveTextContent(presentMonth);

    await user.click(arrowLeft);

    const lastMonth = getMonthWithYear('lastMonth', months);
    expect(screen.getByText(lastMonth)).toHaveTextContent(lastMonth);

    await user.click(rightArrow);
    expect(screen.getByText(presentMonth)).toHaveTextContent(presentMonth);
  });

  it('Should select the days to filter', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Add filter by date/i);

    await user.click(input);
    
    const date = new Date();
    const startDay: any = screen.getByText(date.getDate() - 5);
    const endDay: any = screen.getByText(date.getDate());
    await user.click(startDay);
    await user.click(endDay);
  });

  it('Should select the days to filter', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Add filter by date/i);

    await user.click(input);
    
    const date = new Date();
    const startDay: any = screen.getByText(date.getDate());
    const endDay: any = screen.getByText(date.getDate() - 5);
    await user.click(startDay);
    await user.click(endDay);

    const confirm: any = screen.getByText(/Confirm/i);
    await user.click(confirm);
  });
});