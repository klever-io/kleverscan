import { act, screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import { mockedValidators } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';
import Validators from './';

const header = ['Validator'];

describe('Component: Tabs/Validators', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock('next/router');

    const useRouter = jest.spyOn(nextRouter, 'useRouter');
    useRouter.mockReturnValue({
      route: '/',
      pathname: '',
      push: jest.fn(),
    } as unknown as nextRouter.NextRouter);
  });

  it('Should render the Validators Tab correctly', async () => {
    await act(async () => {
      renderWithTheme(<Validators validators={mockedValidators} />);
    });

    expect(screen.getAllByText(header[0])[0]).toBeInTheDocument();

    expect(screen.getByText(mockedValidators[0])).toBeInTheDocument();
  });
});
