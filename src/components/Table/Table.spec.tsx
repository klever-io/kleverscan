import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import { ITable } from '../../components/Table';
import theme from '../../styles/theme';
import { renderWithTheme } from '../../test/utils';
import Table from './';

const testHeaders = [
  'Rank',
  'Name',
  'Rating',
  'Status',
  'Stake',
  'Produced / Missed',
  'Can Delegate',
  'Cumulative Stake',
];

const tableProps: ITable = {
  type: 'validators',
  header: testHeaders,
  body: {},
  data: [],
  loading: false,
};

describe('Componenet: Table', () => {
  jest.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/',
        pathname: '',
      };
    },
  }));

  const useRouter: any = jest.spyOn(nextRouter, 'useRouter');
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/validators',
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the headers of the table and the empty row when there's no data", () => {
    renderWithTheme(<Table {...tableProps} />);
    testHeaders.forEach((header, index) => {
      const getHeader = screen.getByText(header);
      expect(getHeader).toBeInTheDocument();
      expect(getHeader).toHaveTextContent(testHeaders[index]);
    });

    const emptyRow = screen.getByText(/Oops! Apparently no data here./i);
    expect(emptyRow).toBeInTheDocument();
  });

  it('Should match the style for the header and the empty row', () => {
    renderWithTheme(<Table {...tableProps} />);
    const header = screen.getByText(/Rank/i).parentNode;
    const emptyRow = screen.getByText(
      /Oops! Apparently no data here./i,
    ).parentNode;
    const headerStyle = {
      padding: '1rem 1.5rem',
      color: theme.table.text,
      fontWeight: '600',
      fontSize: '0.85rem',
    };
    const emptyRowStyle = {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    };
    expect(header).toHaveStyle(headerStyle);
    expect(emptyRow).toHaveStyle(emptyRowStyle);
  });
});
