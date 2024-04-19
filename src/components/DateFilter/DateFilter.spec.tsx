import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextRouter from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getMonthWithYear, renderWithTheme } from '../../test/utils';
import DateFilter from './';

const props = {
  resetDate: jest.fn(),
  filterDate: jest.fn(),
  empty: true,
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      isReady: true,
    };
  },
}));

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

describe('Component: DateFilter', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    const useRouter = jest.spyOn(nextRouter, 'useRouter') as jest.Mock;
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    }));
    await act(async () => {
      renderWithTheme(<DateFilter />);
    });
  });

  it('Should render the input with the "Date Filter ', () => {
    const input = screen.getByPlaceholderText(/Date Filter/i);
    expect(input).toBeInTheDocument();
  });

  it('Should render the calendar container after click on the input', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Date Filter/i);

    await user.click(input);

    const calendar = screen.getByText(/Date Filter/i);
    expect(calendar).toBeInTheDocument();
  });

  it('Should match the style of the input and the calendar container', async () => {
    const user = userEvent.setup();

    const inputStyle = {
      width: '75%',
      fontWeight: '700',
      fontSize: '0.95rem',
      color: '#aa33b5',
      caretColor: 'transparent',
      cursor: 'pointer',
    };
    const input = screen.getByPlaceholderText(/Date Filter/i);
    expect(input).toHaveStyle(inputStyle);

    await user.click(input);

    const calendarContainer =
      screen.getByText(/Date Filter/i).parentNode?.parentNode?.parentNode;

    const calendarStyle = {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '18rem',
      width: '18rem',
      padding: '1rem',
      marginLeft: '5rem',
      backgroundColor: '#fff',
      position: 'absolute',
      bottom: '-0.5rem',
      right: '0',
      transform: 'translateY(100%)',
      zIndex: '2',
      borderRadius: '20px',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
    };
    expect(calendarContainer).toHaveStyle(calendarStyle);
  });

  it('Should render the correct month if click on arrows to change month', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Date Filter/i);

    await user.click(input);

    const arrowLeft = screen.getByText(/Choose the proper date/i).parentNode
      ?.nextSibling?.firstChild?.firstChild as HTMLElement;
    const rightArrow = screen.getByText(/Choose the proper date/i).parentNode
      ?.nextSibling?.firstChild?.lastChild as HTMLElement;

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
    const input = screen.getByPlaceholderText(/Date Filter/i);

    await user.click(input);

    const date = new Date();
    const arrowLeft = screen.getByText(/Choose the proper date/i).parentNode
      ?.nextSibling?.firstChild?.firstChild as HTMLElement;
    const rightArrow = screen.getByText(/Choose the proper date/i).parentNode
      ?.nextSibling?.firstChild?.lastChild as HTMLElement;
    const confirm = screen.getByText(/Confirm/i);

    if (date.getDate() <= 5) {
      await user.click(arrowLeft);
      const startDay = screen.getByText('18');
      const endDay = screen.getByText('23');

      expect(
        screen.getByText(getMonthWithYear('lastMonth', months)),
      ).toBeVisible();
      await user.click(startDay);
      await user.click(endDay);
      await user.click(confirm);
    } else {
      const startDay = screen.getByText(date.getDate() - 5);
      const endDay = screen.getByText(date.getDate());

      await user.click(startDay);
      await user.click(endDay);

      await user.click(confirm);
    }
  });

  it('Should select the days to filter', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Date Filter/i);

    await user.click(input);

    const confirm = screen.getByText(/Confirm/i);
    const date = new Date();

    if (date.getDate() <= 5) {
      const startDay = screen.getByText(date.getDate());
      const arrowLeft = screen.getByText(/Choose the proper date/i).parentNode
        ?.nextSibling?.firstChild?.firstChild as HTMLElement;

      await user.click(startDay);
      await user.click(arrowLeft);

      expect(
        screen.getByText(getMonthWithYear('lastMonth', months)),
      ).toBeVisible();
      const endDay = screen.getByText('25');

      await user.click(endDay);
      await user.click(confirm);
    } else {
      const startDay = screen.getByText(date.getDate());
      const endDay = screen.getByText(date.getDate() - 5);
      await user.click(startDay);
      await user.click(endDay);

      await user.click(confirm);
    }
  });
});
