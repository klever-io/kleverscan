import { screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import { renderWithTheme } from '../../../test/utils';
import { formatAmount } from '../../../utils/index';
import Assets from './';

export const headerTable = [
  'Token',
  'ID',
  'Token Type',
  'Precision',
  'Balance',
  'Frozen',
];
export const address =
  'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s';
const frozenBalance = 10000000000000;
export const assetId = 'KLV';
const assetName = 'KLEVER';
const assetType = 0;
const balance = 0;
const precision = 6;
const ticker = assetId.split('-')[0];
export const balanceText = `${formatAmount(
  balance / 10 ** precision,
)} ${ticker}`;
export const frozenBalanceText = `${formatAmount(
  frozenBalance / 10 ** precision,
)} ${ticker}`;
export const assetText = assetType === 0 ? 'Fungible' : 'Non Fungible';

const assets = [
  {
    address,
    assetId,
    assetName,
    assetType,
    balance,
    buckets: [],
    frozenBalance,
    lastClaim: { timestamp: 0, epoch: 0 },
    precision,
    unfrozenBalance: 0,
  },
];

export const mockedAssets = <Assets assets={assets} address={address} />;
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

  it('Should render the Assets Tab correctly', () => {
    renderWithTheme(mockedAssets);

    headerTable.map(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(screen.getByText(balanceText)).toBeInTheDocument();
    expect(screen.getByText(frozenBalanceText)).toBeInTheDocument();
    expect(screen.getByText(assetText)).toBeInTheDocument();

    const idButton = screen.getByRole('link', { name: assetId });

    expect(idButton).toBeInTheDocument();
  });
});
