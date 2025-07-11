import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { IRowSection } from '@/types';
import { Search } from '@/assets/icons';
import Copy from '@/components/Copy';
import api from '@/services/api';
import Table, { ITable } from '@/components/Table';
import { CardsTitleWrapper, InputContractContainer } from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';
import { Cell } from '@/components/Home/MostTransacted/styles';
import { formatDate } from '@/utils/formatFunctions';
import Link from 'next/link';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { NextRouter, useRouter } from 'next/router';

interface IRequestQuery {
  deployer?: string;
}

const smartContractsListRowSections = (
  smartContracts: SmartContractsList,
): IRowSection[] => {
  const {
    name,
    deployTxHash,
    deployer,
    timestamp,
    upgrades,
    totalTransactions,
    contractAddress,
  } = smartContracts;

  return [
    {
      element: props => (
        <DoubleRow>
          <CenteredRow>
            <span>{name || '- -'}</span>
          </CenteredRow>
          <CenteredRow>
            <Link href={''}>
              <Mono>{parseAddress(contractAddress, 25)}</Mono>
            </Link>
            <Copy data={contractAddress} info="contractAddress" />
          </CenteredRow>
        </DoubleRow>
      ),
      span: 2,
    },

    {
      element: props => (
        <CenteredRow>
          <span>{totalTransactions || '- -'}</span>
        </CenteredRow>
      ),
      span: 1,
    },

    {
      element: props => (
        <CenteredRow>
          <Link href={''}>
            <Mono>{parseAddress(deployer, 25)}</Mono>
          </Link>
          <Copy data={deployer} info="deployer" />
        </CenteredRow>
      ),
      span: 1,
    },

    {
      element: props => (
        <DoubleRow>
          <CenteredRow>
            <Link href={''}>
              <Mono>{parseAddress(deployTxHash, 25)}</Mono>
            </Link>
            <Copy data={deployTxHash} info="deployTxHash" />
          </CenteredRow>
          <CenteredRow>
            <span>{formatDate(timestamp)}</span>
          </CenteredRow>
        </DoubleRow>
      ),
      span: 1,
    },
  ];
};

const BrowseAllDeployedContracts: React.FC<PropsWithChildren> = () => {
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const router = useRouter();

  const requestSmartContractsList = async (
    page: number,
    limit: number,
    router: NextRouter,
    query?: IRequestQuery,
  ) => {
    try {
      const localQuery: { [key: string]: any } = {
        ...router.query,
        page,
        limit,
      };
      const searchTerm = search.toLowerCase();
      if (searchTerm) {
        query = { ...query, deployer: searchTerm };
      }
      const smartContractsListRes = await api.get({
        route: 'sc/list',
        query: query ?? localQuery,
      });
      if (!smartContractsListRes.error || smartContractsListRes.error === '') {
        const data = {
          ...smartContractsListRes,
          data: { smartContracts: smartContractsListRes.data.sc },
        };
        return data;
      } else {
        throw new Error(smartContractsListRes.error);
      }
    } catch (error) {
      console.error('Error fetching smart contracts list:', error);
      throw error;
    }
  };

  const tableProps: ITable = {
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: smartContractsListRowSections,
    request: (page, limit) => requestSmartContractsList(page, limit, router),
    dataName: 'smartContracts',
    showLimit: false,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <CardsTitleWrapper>
        <h3>Browse all deployed contracts</h3>
      </CardsTitleWrapper>

      <InputContractContainer>
        <input
          type="text"
          placeholder="Search for Deployed"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search for Smart Contracts"
          id="smart-contract-search"
        />
        <Search />
      </InputContractContainer>
      <Table key={refreshKey} {...tableProps} />
    </>
  );
};

export default BrowseAllDeployedContracts;
