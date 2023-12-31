import api from '@/services/api';
import { assetsRequest } from '@/services/requests/account';
import { screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import Tabs from '.';
import { renderWithTheme } from '../../test/utils';
import Assets from './Assets';
import { address, headerTable } from './Assets/Assets.spec';
import { mockAccountResponse, mockAssetsOwnerResponse } from './Assets/mock';

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

jest.mock('@/contexts/contractModal', () => {
  return {
    useContractModal: jest.fn().mockReturnValue({
      getInteractionsButtons: jest.fn().mockImplementation(() => {
        return [<></>];
      }),
    }),
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

const tableHeaders = ['Assets', 'Transactions'];

describe('Component: Tabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const router1 = () => {
      return {
        route: '/',
        pathname: '',
        query: {
          account:
            'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s',
        },
      };
    };

    jest.mock('next/router', () => {
      return {
        __esModule: true,
        useRouter: jest.fn().mockImplementation(router1),
      };
    });
  });

  it('Should render the Assets Tab correctly', async () => {
    const router = useRouter();
    const getRequest = (page: number, limit: number): Promise<any> => {
      return assetsRequest(router.query.account as string)(page, limit);
    };
    const mockAssetsTableProps = {
      scrollUp: false,
      dataName: 'assets',
      request: (page: number, limit: number) => getRequest(page, limit),
      query: router.query,
    };
    const tabProps = {
      headers: tableHeaders,
      dateFilterProps: {
        resetDate: jest.fn(),
        filterDate: jest.fn(),
        empty: true,
      },
      showDataFilter: false,
    };
    renderWithTheme(
      <Tabs {...tabProps}>
        <Assets assetsTableProps={mockAssetsTableProps} address={address} />
      </Tabs>,
    );

    headerTable.map(header => {
      expect(screen.getAllByText(header)[0]).toBeInTheDocument();
    });
    const KLVs = screen.getAllByText('KLV');
    KLVs.forEach(KLV => expect(KLV).toBeInTheDocument());
    expect(KLVs).toHaveLength(2);
    expect(screen.getByText('20 Mi KLV')).toBeInTheDocument();
    expect(screen.getByText('10 Mi KLV')).toBeInTheDocument();

    const idButton = screen.getByRole('link', { name: 'KLV' });

    expect(idButton).toBeInTheDocument();
  });
});
