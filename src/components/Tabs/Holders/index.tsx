import { PropsWithChildren, useEffect, useState } from 'react';
import ExplorerLink from '@/components/ExplorerLink';
import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import { IBalance, IHolders, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { parseAddress, parseHolders } from '@/utils/parseValues';
import React from 'react';
import {
  AddressContainer,
  AmountWithShare,
  FilterContainerHolders,
  PercentageText,
  RankingContainer,
  RankingText,
} from './styles';
import api from '@/services/api';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { RowAlert } from '@/styles/common';
import { IsTokenBurn, setQueryAndRouter } from '@/utils';
import { formatHolderPercentage } from '@/utils/voidSupply';

// Every amount is paired with its share, measured against the total supply so
// the void address counts as the holder it is and the shares add up to 100%.
const header = ['Rank', 'Address', 'Staked Amount', 'Balance', 'Total Balance'];

const Holders: React.FC<IHolders> = ({ asset }) => {
  const router = useRouter();
  const { t } = useTranslation(['assets']);
  const [holderQuery, setHolderQuery] = useState<string>('');
  // Total supply, so the void address counts as the holder it is.
  const totalSupply = asset.circulatingSupply;

  useEffect(() => {
    if (router?.isReady) {
      setHolderQuery(router.query.sortBy as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    setQueryAndRouter({ ...router.query, sortBy: holderQuery }, router);
  }, [holderQuery]);

  const rowSections = (props: IBalance): IRowSection[] => {
    const { address, frozenBalance, index, rank, balance, totalBalance } =
      props;
    const holderPercentage = formatHolderPercentage(totalBalance, totalSupply);
    return [
      {
        element: props => (
          <RankingContainer key={index}>
            <RankingText>{rank}°</RankingText>
          </RankingContainer>
        ),
        span: 1,
      },
      {
        element: props => (
          <AddressContainer key={address}>
            <ExplorerLink
              type="account"
              value={address}
              label={parseAddress(address, 40)}
              compact
            />
            {IsTokenBurn(address) && (
              <RowAlert>
                <span>{t('assets:Overview.Void')}</span>
              </RowAlert>
            )}
          </AddressContainer>
        ),
        span: 1,
      },
      {
        element: props => (
          <AmountWithShare>
            <span>{formatAmount(frozenBalance / 10 ** asset.precision)}</span>
            <PercentageText>
              ({formatHolderPercentage(frozenBalance, totalSupply)})
            </PercentageText>
          </AmountWithShare>
        ),
        span: 1,
        maxWidth: 150,
      },
      {
        element: props => (
          <AmountWithShare>
            <span>{formatAmount(balance / 10 ** asset.precision)}</span>
            <PercentageText>
              ({formatHolderPercentage(balance, totalSupply)})
            </PercentageText>
          </AmountWithShare>
        ),
        span: 1,
      },
      {
        element: props => (
          <AmountWithShare>
            <span>{formatAmount(totalBalance / 10 ** asset.precision)}</span>
            <PercentageText>({holderPercentage})</PercentageText>
          </AmountWithShare>
        ),
        span: 1,
      },
    ];
  };
  const getHeader = () => {
    if (asset.assetId === 'KFI') {
      return header.map(item => {
        if (item === 'Staked Amount') {
          return `Staked Amount/ Voting Power`;
        }
        return item;
      });
    }
    return header;
  };

  const filters: IFilter[] = [
    {
      title: 'Sort By',
      firstItem: 'Total Balance',
      data: ['Balance', 'Frozen'],
      onClick: value => {
        setHolderQuery(value);
      },
      current: holderQuery as string | undefined,
      inputType: 'button',
      isHiddenInput: false,
    },
  ];

  const requestAssetHolders = async (page: number, limit: number) => {
    let newQuery = {
      ...router.query,
      sortBy: holderQuery?.toLowerCase() || '',
    };
    if (holderQuery === 'Total Balance')
      newQuery = { ...router.query, sortBy: 'total' };

    if (asset) {
      const response = await api.get({
        route: `assets/holders/${asset.assetId}`,
        query: { ...newQuery, page, limit },
      });

      let parsedHolders: IBalance[] = [];
      if (!response.error) {
        const holders = response.data.accounts;

        parsedHolders = parseHolders(
          holders,
          asset.assetId,
          response.pagination,
        );
      }

      return { ...response, data: { accounts: parsedHolders } };
    }
    return { data: { accounts: [] } };
  };

  const tableProps: ITable = {
    rowSections,
    header: getHeader(),
    type: 'holders',
    dataName: 'accounts',
    request: (page: number, limit: number) => requestAssetHolders(page, limit),
  };

  return (
    <>
      <FilterContainerHolders>
        {filters.map(filter => (
          <Filter key={JSON.stringify(filter)} {...filter} />
        ))}
      </FilterContainerHolders>
      <Table {...tableProps} />
    </>
  );
};

export default Holders;
