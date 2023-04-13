import { assetsRequest } from '@/pages/account/[account]';
import api from '@/services/api';
import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderWithTheme } from '../../../test/utils';
import { CustomRouter } from '../ProprietaryAssets/ProprietaryAssets.spec';
import Assets from './';
import { mockAccountResponse, mockAssetsOwnerResponse } from './mock';

export const headerTable = [
  'Token',
  'ID',
  'Token Type',
  'Precision',
  'Balance',
  'Frozen',
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
          push: jest.fn(),
          events: {
            on: jest.fn(),
            off: jest.fn(),
          },
          beforePopState: jest.fn(() => null),
          prefetch: jest.fn(() => null),
        } as unknown as CustomRouter),
    );
  });

  it('Should render the Assets Tab correctly', async () => {
    const router = useRouter();
    const getRequest = (page: number, limit: number): Promise<any> => {
      const address = router.query.account as string;

      return assetsRequest(address)(page, limit);
    };
    const mockAssetsTableProps = {
      scrollUp: false,
      dataName: 'assets',
      request: (page: number, limit: number) => getRequest(page, limit),
      query: router.query,
    };

    await act(async () => {
      renderWithTheme(
        <Assets assetsTableProps={mockAssetsTableProps} address={address} />,
      );
    });

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    const KLVs = screen.getAllByText('KLV');
    KLVs.forEach(KLV => expect(KLV).toBeInTheDocument());
    expect(KLVs).toHaveLength(2);
    expect(screen.getByText('Fungible')).toBeInTheDocument();
    expect(screen.getByText('20 Mi KLV')).toBeInTheDocument();
    expect(screen.getByText('10 Mi KLV')).toBeInTheDocument();
  });
});
