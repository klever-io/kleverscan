import { validatorsHeaders } from '@/pages/validators';
import { screen } from '@testing-library/react';
import { useTranslation } from 'next-i18next';
import * as nextRouter from 'next/router';
import React from 'react';
import { ITable } from '../../components/Table';
import { renderWithTheme } from '../../test/utils';
import Table from './';
import { failedValidatorResponse, validatorResponse } from './mocks';

const emptyValidatorsRequest = jest
  .fn()
  .mockResolvedValue(failedValidatorResponse);

const validValidatorsRequest = jest.fn().mockResolvedValue(validatorResponse);

describe('Component: Table', () => {
  jest.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/',
        pathname: '',
        push: jest.fn(),
      };
    },
  }));
  const useRouter = jest.spyOn(nextRouter, 'useRouter');
  useRouter.mockImplementation(
    () =>
      ({
        route: '/',
        pathname: '/validators',
        push: jest.fn(),
      } as unknown as nextRouter.NextRouter),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should NOT render the headers of the table and the empty row when there's no data", async () => {
    const { t } = useTranslation('table');
    const emptyTableProps: ITable = {
      type: 'validators',
      header: validatorsHeaders(t),
      rowSections: undefined,
      request: page => emptyValidatorsRequest(page),
      totalPages: 0,
      scrollUp: true,
      dataName: 'validators',
    };
    renderWithTheme(<Table {...emptyTableProps} />);
    // no more headers when failed requisition
    for await (const header of validatorsHeaders(t)) {
      const getHeader = screen.queryByText(header);
      expect(getHeader).toEqual(null);
    }

    const emptyRow = screen.getByText(/Oops! Apparently no data here./i);
    expect(emptyRow).toBeInTheDocument();
  });

  it('Should render the headers of the table and the rows when there is data', async () => {
    const { t } = useTranslation('table');
    const validTableProps: ITable = {
      type: 'validators',
      header: validatorsHeaders(t),
      rowSections: undefined,
      request: page => validValidatorsRequest(page),
      scrollUp: true,
      dataName: 'validators',
    };
    renderWithTheme(<Table {...validTableProps} />);

    for await (const header of validatorsHeaders(t)) {
      const getHeader = await screen.findByText(header);
      expect(getHeader).toBeInTheDocument();
    }
  });
});
