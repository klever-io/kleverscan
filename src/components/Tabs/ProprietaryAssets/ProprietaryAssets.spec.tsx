import { ownedAssetsRequest } from '@/pages/account/[account]';
import api from '@/services/api';
import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ProprietaryAssets from '.';
import { renderWithTheme } from '../../../test/utils';
import { mockAccountResponse, mockAssetsOwnerResponse } from './mock';

export type CustomRouter = nextRouter.NextRouter & {
  basePath: string;
  isLocaleDomain: boolean;
};
export const headerTable = [
  'Token',
  'ID',
  'Token Type',
  'Precision',
  'Circulating Supply',
  'Frozen Balance',
];
export const address =
  'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s'; //devnet account

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

const router1 = () => {
  return {
    route: '/',
    pathname: '',
    query: '',
  };
};

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
  };
});

jest.mock('next/router', () => {
  return {
    __esModule: true,
    useRouter: jest.fn().mockImplementation(router1),
  };
});

jest.spyOn(api, 'get').mockImplementation(params => {
  switch (true) {
    case params.route.includes('address'):
      return Promise.resolve(mockAccountResponse);
    case params.route.includes('assets'):
      return Promise.resolve(mockAssetsOwnerResponse);
    default:
      return Promise.reject(new Error(`Unexpected route: ${params.route}`));
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Component: Assets Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
          pathname: `account/${address}`,
          query: '',
          asPath: '',
          basePath: '',
          isLocaleDomain: false,
          push: jest.fn(),
          replace: jest.fn(),
          reload: jest.fn(),
          back: jest.fn(),
          prefetch: jest.fn(),
          beforePopState: jest.fn(),
          events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
          },
        } as unknown as CustomRouter),
    );
  });

  it('Should render the Assets Tab correctly', async () => {
    const router = useRouter();

    const getRequest = (page: number, limit: number): Promise<any> => {
      const address = router.query.account as string;

      return ownedAssetsRequest(address)(page, limit);
    };

    const mockAssetsTableProps = {
      scrollUp: false,
      dataName: 'assets',
      request: (page: number, limit: number) => getRequest(page, limit),
      query: router.query,
    };

    await act(async () => {
      renderWithTheme(
        <ProprietaryAssets
          assetsTableProps={mockAssetsTableProps}
          address={address}
        />,
      );
    });

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    const TOAs = screen.getAllByText('TOA');
    TOAs.forEach(TOA => expect(TOA).toBeInTheDocument());
    expect(TOAs).toHaveLength(1);
    expect(screen.getByText('Fungible')).toBeInTheDocument();
    expect(screen.getByText('20 Mi TOA')).toBeInTheDocument();
    expect(screen.getByText('0 TOA')).toBeInTheDocument();
  });
});
