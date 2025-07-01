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
          <AssetLogo
            logo={'/assets/klv-logo.png?w=1920'}
            ticker={'KLV'}
            name={name}
          />
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
      element: props => <Cell>{totalTransactions}</Cell>,
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
  const [contractNameValue, setContractNameValue] = useState<string>('');
  const [filteredSmartContracts, setFilteredSmartContracts] = useState<
    SmartContractsList[]
  >([]);

  const requestSmartContractsList = async (
    page: number,
    limit: number,
    filter: string,
  ) => {
    const localQuery = { page, limit };
    const smartContractsListRes = await api.get({
      route: 'sc/list',
      query: localQuery,
    });
    if (!smartContractsListRes.error) {
      return {
        ...smartContractsListRes,
        data: { smartContracts: smartContractsListRes.data.sc },
      };
    }
  };

  const tableProps: ITable = {
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: smartContractsListRowSections,
    request: (page, limit) =>
      requestSmartContractsList(page, limit, contractNameValue),
    dataName: 'smartContracts',
    showLimit: false,
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
          value={contractNameValue}
          onChange={e => setContractNameValue(e.target.value)}
        />
        <Search />
      </InputContractContainer>
      <Table {...tableProps} />
    </>
  );
};

export default BrowseAllDeployedContracts;
