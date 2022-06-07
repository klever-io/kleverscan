import React from 'react';
import { screen } from '@testing-library/react';


import NetworkParams from './';
import { renderWithTheme } from '../../../test/utils';

const mockedNetWorkParams = [
  {
    number: 0,
    parameter: 'Block Rewards',
    currentValue: '1000000' 
  },
  {
    number: 1,
    parameter: 'KApp Fee for Validator Creation',
    currentValue: '100000' 
  },
];

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
    });
  },
}));

describe('Component: Tabs/NetworkParams' , () => {
  it('Should render the the Table and it\'s Body and header correctly', () => {
    renderWithTheme(
      <NetworkParams loading={false} networkParams={mockedNetWorkParams} />
    );

    const number = screen.getByText(`#${mockedNetWorkParams[0].number}`);
    const headers = ['Number', 'Parameter', 'Current Value'];
    const tableBody = number.parentNode?.parentNode?.parentNode;
    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };
    
    expect(tableBody).toHaveStyle(tableBodyStyle);
    headers.forEach(( name ) => {
      const header = screen.getByText(name);
      expect(header).toBeInTheDocument();
    });

  });

  it('Should render the "Number", "Parameter" and "Current Value" with the correct', () => {
    renderWithTheme(
      <NetworkParams loading={false} networkParams={mockedNetWorkParams} />
    );
    const number = screen.getByText(`#${mockedNetWorkParams[0].number}`);
    const parameter = screen.getByText(mockedNetWorkParams[0].parameter);
    const currentValue = screen.getByText(mockedNetWorkParams[0].currentValue);

    expect(number).toBeInTheDocument();
    expect(parameter).toBeInTheDocument();
    expect(currentValue).toBeInTheDocument();
  });
});