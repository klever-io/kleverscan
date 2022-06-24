import React from 'react';
import * as nextRouter from 'next/router';

import {screen} from '@testing-library/react'

import Assets from './';
import { renderWithTheme } from '../../../test/utils';
import { formatAmount } from '@/utils/index';

describe('Component: Assets Tab', () => {
  const headerTable = ['Token', 'ID', 'Token Type', 'Precision', 'Balance', 'Frozen'];
  const address = 'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
  const frozenBalance = 10000000000000;
  const assetId = 'KLV';
  const assetName = 'KLEVER';
  const assetType = 0;
  const balance = 0;
  const precision = 6;
  const ticker = assetId.split('-')[0];
  const balanceText = `${formatAmount(balance / 10 ** precision)} ${ticker}`;
  const frozenBalanceText = `${formatAmount(frozenBalance / 10 ** precision)} ${ticker}`;
  const assetText = assetType === 0 ? 'Fungible' : 'Non Fungible';

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

  it('Should render the Assets Tab correctly', () => {
    renderWithTheme(
      <Assets assets={assets} />
    );

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(screen.getByText(balanceText)).toBeInTheDocument();
    expect(screen.getByText(frozenBalanceText)).toBeInTheDocument();
    expect(screen.getByText(assetText)).toBeInTheDocument();

    const idButton = screen.getByRole('link', {name: assetId});

    expect(idButton).toBeInTheDocument();  });
}); 
