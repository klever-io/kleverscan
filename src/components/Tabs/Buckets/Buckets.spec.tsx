import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import { renderWithTheme } from '../../../test/utils';
import { IAccountAsset, IBucket } from '../../../types';
import { parseAddress } from '../../../utils/index';
import Buckets from './';

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
    'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
  const frozenBalance = 10000000000000;
  const assetId = 'KLV';
  const assetName = 'KLEVER';
  const assetType = 0;
  const balance = 0;
  const precision = 6;
  const balanceBucket = 2000001000000;
  const bucketId =
    '9deb772022e3e5e1f258bb8cb6b6cf39d460750ffa727d7414b7fb3c8c8a87a2';
  const stakeAt = 1653329019;
  const unstakedEpoch = 55555;
  const stakedEpoch = 0;
  const delegation = '';
  const MAX_UINT32 = 4294967295;

  jest.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/',
        pathname: '',
      };
    },
  }));

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

  const buckets: IBucket[] = [
    {
      balance: balanceBucket,
      delegation,
      id: bucketId,
      stakeAt,
      stakedEpoch,
      unstakedEpoch,
    },
  ];

  const assets: IAccountAsset[] = [
    {
      address,
      assetId,
      assetType,
      balance,
      buckets,
      frozenBalance,
      lastClaim: { timestamp: 0, epoch: 0 },
      precision,
      unfrozenBalance: 0,
    },
  ];

  it('Should render the Buckets Tab correctly', () => {
    renderWithTheme(<Buckets assets={assets} />);

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(
      screen.getByText((balanceBucket / 10 ** precision).toLocaleString()),
    ).toBeInTheDocument();
    expect(screen.getByText(stakedEpoch.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(bucketId)).toBeInTheDocument();

    if (delegation.length > 0) {
      expect(
        screen.getByText(parseAddress(delegation, 22)),
      ).toBeInTheDocument();
    }
  });

  it('Should render the fallback value for "minEpochsToWithdraw" when don\t exist the property in assets or don\' find the bucketId', () => {
    const newAssets = [...assets];
    renderWithTheme(<Buckets assets={newAssets} />);

    const unstakedEpochElement = screen.getByText(
      unstakedEpoch.toLocaleString(),
    );
    const minEpochsToWithdraw = unstakedEpochElement.nextElementSibling;

    expect(unstakedEpochElement).toBeInTheDocument();
    expect(unstakedEpochElement).toBeVisible();
    expect(minEpochsToWithdraw).toBeInTheDocument();
    expect(minEpochsToWithdraw).toBeVisible();
    expect(minEpochsToWithdraw).toHaveTextContent('--');
  });

  it('Should render the default "minEpochsToWithdraw" to KLV and when the link to "account" page when delegation has a value', () => {
    const newAssets = [...assets];

    const delegationAddress =
      'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';

    if (newAssets[0].buckets)
      newAssets[0].buckets[0].delegation = delegationAddress;
    renderWithTheme(<Buckets assets={newAssets} />);

    const link = screen.getByRole('link', {
      name: parseAddress(delegationAddress, 22),
    });

    expect(link).toBeInTheDocument();
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', `/account/${delegationAddress}`);
  });
});
