import React from 'react';
import * as nextRouter from 'next/router';

import {screen} from '@testing-library/react'

import Buckets from './';
import { renderWithTheme } from '../../../test/utils';
import { formatAmount, parseAddress } from '@/utils/index';

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
  const ticker = assetId.split('-')[0];
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
}); 
