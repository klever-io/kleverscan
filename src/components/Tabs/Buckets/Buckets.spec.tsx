import React from 'react';
import * as nextRouter from 'next/router';

import {screen} from '@testing-library/react'

import Buckets from './';
import { renderWithTheme } from '../../../test/utils';
import { parseAddress } from '@/utils/index';

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

  const address = 'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
  const frozenBalance = 10000000000000;
  const assetId = 'KLV';
  const assetName = 'KLEVER';
  const assetType = 0;
  const balance = 0;
  const precision = 6;
  const balanceBucket = 2000001000000;
  const bucketId = '9deb772022e3e5e1f258bb8cb6b6cf39d460750ffa727d7414b7fb3c8c8a87a2';
  const stakeAt = 1653329019;
  const unstakedEpoch = 4294967295;
  const stakedEpoch = 0;
  const delegation = '';

  jest.mock('next/router', () => ({
    useRouter() {
      return ({
        route: '/',
        pathname: '',
      });
    },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    const useRouter: any = jest.spyOn(nextRouter, "useRouter");
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: `account/${address}`,
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    }));
  });

  const assets = [{
    address,
    assetId,
    assetName,
    assetType,
    balance,
    buckets: [],
    frozenBalance,
    lastClaim: {timestamp: 0, epoch: 0},
    precision,
    unfrozenBalance: 0,
  }];

  const buckets = [{
    balance: balanceBucket,
    delegation,
    id: bucketId,
    stakeAt,
    stakedEpoch,
    unstakedEpoch,
  }];

  it('Should render the Buckets Tab correctly', () => {
    renderWithTheme(
      <Buckets buckets={buckets} assets={assets} />
    );

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(screen.getByText((balanceBucket / 10 ** precision).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(stakedEpoch.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(bucketId)).toBeInTheDocument();

    if (delegation.length > 0) {
      expect(screen.getByText(parseAddress(delegation, 22))).toBeInTheDocument();
    }
  });

  it('Should render the value of "unstaked epoch" when isn\'t to "UINT32_MAX" and "minEpochsToWithdraw" when exist property in assets', () => {
    const newBuckets = [...buckets];
    const newAssets = [...assets  ];
    newAssets[0]["staking"] = { minEpochsToWithdraw: 4 }

    newBuckets[0].unstakedEpoch = 55555;
    newBuckets[0].id = 'KLV';
    renderWithTheme(
      <Buckets buckets={newBuckets} assets={newAssets} />
    );

    const unstakedEpoch = screen.getByText((55555).toLocaleString());
    const minEpochsToWithdraw = unstakedEpoch.nextSibling;

    expect(unstakedEpoch).toBeInTheDocument();
    expect(unstakedEpoch).toBeVisible();
    expect(minEpochsToWithdraw).toBeInTheDocument();
    expect(minEpochsToWithdraw).toBeVisible();
    expect(minEpochsToWithdraw).toHaveTextContent((55559).toLocaleString());

  });

  it('Should render the fallback value for "minEpochsToWithdraw" when don\t exist the property in assets or don\' find the bucketId', () => {
    const newBuckets = [...buckets];
    const newAssets = [...assets  ];
    newBuckets[0].unstakedEpoch = 55555;
    newBuckets[0].id = 'KFI';
    renderWithTheme(
      <Buckets buckets={newBuckets} assets={newAssets} />
    );

    const unstakedEpoch = screen.getByText((55555).toLocaleString());
    const minEpochsToWithdraw = unstakedEpoch.nextElementSibling;

    expect(unstakedEpoch).toBeInTheDocument();
    expect(unstakedEpoch).toBeVisible();
    expect(minEpochsToWithdraw).toBeInTheDocument();
    expect(minEpochsToWithdraw).toBeVisible();
    expect(minEpochsToWithdraw).toHaveTextContent((55557).toLocaleString());
  });

  it('Should render the default "minEpochsToWithdraw" to KLV and when the link to "account" page when delegation has a value', () => {
    const newBuckets = [...buckets];
    const newAssets = [...assets  ];
    newBuckets[0].unstakedEpoch = 55555;
    newBuckets[0].delegation = 'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
    newBuckets[0].id = 'kvklalsdlmqweiqiwoekasmdasldlasdooiwqeoiwqelsaldaslmdaskdasjdaosk';
    renderWithTheme(
      <Buckets buckets={newBuckets} assets={newAssets} />
    );

    const { delegation } = newBuckets[0];
    const link = screen.getByRole('link',
      { name: parseAddress(delegation, 22)});

    expect(link).toBeInTheDocument();
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', `/account/${delegation}`);
  });
}); 
