import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { ITable } from '../../components/Table';
import { renderWithTheme } from '../../test/utils';
import Table from './';
import { failedValidatorResponse } from './mocks';

const header = ['Rank', 'Name', 'Can Delegate', 'Cumulative Stake'];

const requestValidators = jest.fn().mockResolvedValue(failedValidatorResponse);

const tableProps: ITable = {
  type: 'validators',
  header,
  rowSections: undefined,
  request: page => requestValidators(page),
  totalPages: 0,
  scrollUp: true,
  dataName: 'validators',
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
  const useRouter = jest.spyOn(nextRouter, 'useRouter');
  useRouter.mockImplementation(
    () =>
      ({
        route: '/',
        pathname: '/validators',
      } as nextRouter.NextRouter),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should NOT render the headers of the table and the empty row when there's no data", async () => {
    await act(async () => {
      renderWithTheme(<Table {...tableProps} />);
    });
    // no more headers when failed requisition
    header.forEach((header, index) => {
      const getHeader = screen.queryByText(header);
      expect(getHeader).toEqual(null);
    });

    const emptyRow = screen.getByText(/Oops! Apparently no data here./i);
    expect(emptyRow).toBeInTheDocument();
  });

  it('Should match the style for the header and the empty row', async () => {
    await act(async () => {
      renderWithTheme(<Table {...tableProps} />);
    });

    const emptyRow = screen.getByText(
      /Oops! Apparently no data here./i,
    ).parentNode;

    const emptyRowStyle = {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    };
    expect(emptyRow).toHaveStyle(emptyRowStyle);
  });
});
