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
import {
  CardsTitleWrapper,
  CellTableContractName,
  CellTableContractNameWrapper,
  InputContractContainer,
} from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';
import { Cell } from '@/components/Home/MostTransacted/styles';
import { formatDate } from '@/utils/formatFunctions';

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
        <CellTableContractNameWrapper>
          <CellTableContractName>
            {name || '- -'}
            <small
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {parseAddress(contractAddress, 25)}
              <Copy data={contractAddress} info="contractAddress" />
            </small>
          </CellTableContractName>
        </CellTableContractNameWrapper>
      ),
      span: 1,
    },

    {
      element: props => <Cell>{totalTransactions || '- -'}</Cell>,
      span: 1,
    },

    {
      element: props => (
        <Cell>
          <small style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {parseAddress(deployer, 25)}
            <Copy data={deployer} info="deployer" />
          </small>
        </Cell>
      ),
      span: 1,
    },

    {
      element: props => (
        <Cell
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <small style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {parseAddress(deployTxHash, 25)}
            <Copy data={deployTxHash} info="deployTxHash" />
          </small>
          {formatDate(timestamp)}
        </Cell>
      ),
      span: 1,
    },
  ];
};

const BrowseAllDeployedContracts: React.FC<PropsWithChildren> = () => {
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const requestSmartContractsList = async (page: number, limit: number) => {
    try {
      const localQuery = { page, limit };
      const smartContractsListRes = await api.get({
        route: 'sc/list',
        query: localQuery,
      });
      if (!smartContractsListRes.error || smartContractsListRes.error === '') {
        let smartContracts = smartContractsListRes.data.sc;

        const searchTerm = search.toLowerCase();
        smartContracts = smartContracts.filter(
          (sc: SmartContractsList) =>
            sc.contractAddress?.toLowerCase().includes(searchTerm) ||
            sc.deployTxHash?.toLowerCase().includes(searchTerm) ||
            sc.deployer?.toLowerCase().includes(searchTerm) ||
            sc.name?.toLowerCase().includes(searchTerm),
        );

        const data = {
          ...smartContractsListRes,
          data: { smartContracts },
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
    request: (page, limit) => requestSmartContractsList(page, limit),
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
          placeholder="Search for contract"
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
