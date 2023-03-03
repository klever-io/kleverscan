import { getRequestBuckets } from '@/pages/account/[account]';
import api from '@/services/api';
import { parseAddress } from '@/utils/parseValues';
import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderWithTheme } from '../../../test/utils';
import Buckets from './';
import {
  mockAccountResponse,
  mockAssetKLVResponse,
  mockBlockResponse,
} from './mock';

describe('Component: Buckets Tab', () => {
  const headerTable = [
    'Staked Values',
    'Staked',
    'Staked Epoch',
    'Bucket Id',
    'Unstaked Epoch',
    'Available Epoch',
    'Delegation',
  ];

  const address =
    'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s'; // devnet address
  const precision = 6;
  const balanceBucket = 10000000000000;
  const bucketId =
    'f9b9af152412066175a0728b731a2310af223b7bb15a936495c1144c21fbd648';
  const stakedEpoch = 0;
  const delegation = '';

  jest.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/',
        pathname: '',
      };
    },
  }));

  jest.mock('@/services/api', () => {
    return {
      get: jest.fn(),
    };
  });

  jest.spyOn(api, 'get').mockImplementation(params => {
    switch (true) {
      case params.route.includes('address'):
        return Promise.resolve(mockAccountResponse);
      case params.route.includes('assets'):
        return Promise.resolve(mockAssetKLVResponse);
      case params.route.includes('block'):
        return Promise.resolve(mockBlockResponse);
      default:
        return Promise.reject(new Error(`Unexpected route: ${params.route}`));
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const useRouter: any = jest.spyOn(nextRouter, 'useRouter');
    useRouter.mockImplementation(() => ({
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
    }));
  });

  it('Should render the Buckets Tab correctly', async () => {
    const address =
      'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
    const router = useRouter();
    const bucketsTableProps = {
      scrollUp: true,
      dataName: 'buckets',
      request: getRequestBuckets(address),
      query: router.query,
    };

    // TODO: showInteractions buttons without test, maybe it's best to test it in the account page test since this function uses state management
    await act(async () => {
      renderWithTheme(<Buckets bucketsTableProps={bucketsTableProps} />);
    });
    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(
      screen.getByText((balanceBucket / 10 ** precision).toLocaleString()),
    ).toBeInTheDocument();
    expect(screen.getByText(stakedEpoch.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(bucketId)).toBeInTheDocument();

    expect(screen.getByText('KLV')).toBeInTheDocument();
    expect(screen.getByText('10,000,000')).toBeInTheDocument();
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(
      screen.getByText(
        'f9b9af152412066175a0728b731a2310af223b7bb15a936495c1144c21fbd648',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('klv18slsv4v...lhveqv78t8s')).toBeInTheDocument();

    if (delegation.length > 0) {
      expect(
        screen.getByText(parseAddress(delegation, 22)),
      ).toBeInTheDocument();
    }
  });

  it('Should render the fallback value for "minEpochsToWithdraw" when don\t exist the property in assets or don\' find the bucketId', async () => {
    const address =
      'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
    const router = useRouter();
    const bucketsTableProps = {
      scrollUp: true,
      dataName: 'buckets',
      request: getRequestBuckets(address),
      query: router.query,
    };

    await act(async () => {
      renderWithTheme(<Buckets bucketsTableProps={bucketsTableProps} />);
    });

    const unstakedEpochElement = screen.getAllByText('--')[0];
    const minEpochsToWithdraw = unstakedEpochElement.nextElementSibling;

    expect(unstakedEpochElement).toBeInTheDocument();
    expect(unstakedEpochElement).toBeVisible();
    expect(minEpochsToWithdraw).toBeInTheDocument();
    expect(minEpochsToWithdraw).toBeVisible();
    expect(minEpochsToWithdraw).toHaveTextContent('--');
  });

  it('Should render the default "minEpochsToWithdraw" to KLV and when the link to "account" page when delegation has a value', async () => {
    const address =
      'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
    const router = useRouter();
    const bucketsTableProps = {
      scrollUp: true,
      dataName: 'buckets',
      request: getRequestBuckets(address),
      query: router.query,
    };
    const delegationAddress =
      'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';

    await act(async () => {
      renderWithTheme(<Buckets bucketsTableProps={bucketsTableProps} />);
    });

    const link = screen.getByRole('link', {
      name: parseAddress(delegationAddress, 22),
    });

    expect(link).toBeInTheDocument();
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', `/validator/${delegationAddress}`);
  });
});
