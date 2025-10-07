import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SmartContractsList } from '@/types/smart-contract';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { IRowSection } from '@/types';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { CardsTitleWrapper, InputContractContainer } from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';
import { Cell } from '@/components/Home/MostTransacted/styles';
import { formatDate } from '@/utils/formatFunctions';
import Link from 'next/link';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { NextRouter, useRouter } from 'next/router';
import useSmartContractsList from '@/components/SmartContracts/useSmartContractsList';

interface IRequestQuery {
  deployer?: string;
  orderBy?: 'desc' | 'asc';
  sortBy?: 'timestamp' | 'totalTransactions';
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
            <Link
              href={`/smart-contract/${contractAddress}`}
              key={contractAddress}
            >
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
          <span>{totalTransactions}</span>
        </CenteredRow>
      ),
      span: 1,
    },

    {
      element: props => (
        <CenteredRow>
          <Link href={`/account/${deployer}`} key={contractAddress}>
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
            <Mono>{parseAddress(deployTxHash, 25)}</Mono>
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
  const router = useRouter();
  const { request, Filters } = useSmartContractsList();

  const tableProps: ITable = {
    type: 'smartContracts',
    header: smartContractsTableHeaders,
    rowSections: smartContractsListRowSections,
    request: (page, limit) => request(page, limit, router),
    dataName: 'smartContracts',
    showLimit: true,
    Filters,
  };

  return (
    <>
      <CardsTitleWrapper>
        <h3>Browse All Deployed Contracts</h3>
      </CardsTitleWrapper>
      <Table {...tableProps} />
    </>
  );
};

export default BrowseAllDeployedContracts;
