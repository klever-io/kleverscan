import React, { useEffect, useState } from 'react';
import { useMobile } from '@/contexts/mobile';
import { Search } from '@/assets/icons';
import {
  Cell,
  HeaderItem,
  Row,
  Table,
} from '@/components/Home/MostTransacted/styles';
import Copy from '@/components/Copy';
import { smartContractsTableHeaders } from '@/utils/contracts';
import {
  CardsTitleWrapper,
  CellTableContractName,
  CellTableContractNameWrapper,
  InputContractContainer,
  SmartContractDataCard,
  SmartContractDataCardHeader,
  SmartContractDataCardHeaderItem,
  SmartContractDataCardInfo,
  SmartContractDataCardInfoColumn,
  SmartContractDataWrapper,
} from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';

const smartContractsData = [
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15000,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name2',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
];

interface SmartContract {
  contractName: string;
  contractAddress: string;
  rewards: string;
  balance: string;
  logo: string;
  ticker: string;
  totalTransactions: number;
  firstDeployed: number;
  lastDeployed: number;
}

const BrowseAllDeployedContracts = () => {
  const { isMobile, isTablet } = useMobile();
  const [contractNameValue, setContractNameValue] = useState<string>('');
  const [filteredData, setFilteredData] =
    useState<SmartContract[]>(smartContractsData);

  useEffect(() => {
    if (smartContractsData.length > 0) {
      const filtered = smartContractsData?.filter(item =>
        item?.contractName.includes(contractNameValue),
      );
      setFilteredData(filtered);
    }
  }, [contractNameValue, smartContractsData]);

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
        {/* <Input
                        type="text"
                        placeholder='Search for contract'
                        value=""
                        onChange={() => { }}
                        handleConfirmClick={() => { }}
                    /> */}
      </InputContractContainer>

      {/* <Table {...tableProps} /> */}

      <div style={{ marginTop: '20px' }}>
        {!isMobile && !isTablet ? (
          <Table>
            <thead>
              <Row>
                <HeaderItem key={0}>#</HeaderItem>
                {smartContractsTableHeaders.map((item, index) => (
                  <HeaderItem key={index}>{item}</HeaderItem>
                ))}
              </Row>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <Row key={index}>
                  <Cell>{index}</Cell>
                  <CellTableContractNameWrapper>
                    <AssetLogo
                      logo={item?.logo}
                      ticker={item?.ticker}
                      name={item?.contractName}
                    />
                    <CellTableContractName>
                      {item?.contractName}
                      <small>{parseAddress(item?.contractAddress, 25)}</small>
                    </CellTableContractName>
                  </CellTableContractNameWrapper>
                  <Cell>
                    {item?.rewards}
                    {item?.ticker}
                  </Cell>
                  <Cell>
                    {item?.balance}
                    {item?.ticker}
                  </Cell>
                  <Cell>
                    {item?.totalTransactions}
                    {item?.ticker}
                  </Cell>
                  <Cell>
                    {item?.firstDeployed}
                    {item?.ticker}
                  </Cell>
                  <Cell>
                    {item?.lastDeployed}
                    {item?.ticker}
                  </Cell>
                </Row>
              ))}
            </tbody>
          </Table>
        ) : (
          <SmartContractDataWrapper>
            {filteredData?.map((item, index) => (
              <SmartContractDataCard key={index}>
                <SmartContractDataCardHeader>
                  <SmartContractDataCardHeaderItem>
                    <AssetLogo
                      logo={item?.logo}
                      ticker={item?.ticker}
                      name={item?.contractName}
                    />
                    <span>{item?.contractName}</span>
                  </SmartContractDataCardHeaderItem>
                  <span>02/12/2024 15:27</span>
                </SmartContractDataCardHeader>
                <SmartContractDataCardHeader>
                  <small>{parseAddress(item?.contractAddress, 25)}</small>
                  <Copy data={item?.contractAddress} info="contractAddress" />
                </SmartContractDataCardHeader>
                <SmartContractDataCardInfo>
                  <SmartContractDataCardInfoColumn>
                    <span>Balance</span>
                    <span>
                      {item?.balance} {item?.ticker}
                    </span>
                  </SmartContractDataCardInfoColumn>
                  <SmartContractDataCardInfoColumn>
                    <span>Total Transactions</span>
                    <span>
                      {item?.totalTransactions} {item?.ticker}
                    </span>
                  </SmartContractDataCardInfoColumn>
                </SmartContractDataCardInfo>
                <SmartContractDataCardInfo>
                  <SmartContractDataCardInfoColumn>
                    <span>First Deployed</span>
                    <span>
                      {item?.firstDeployed} {item?.ticker}
                    </span>
                  </SmartContractDataCardInfoColumn>
                  <SmartContractDataCardInfoColumn>
                    <span>Last Deployed</span>
                    <span>
                      {item?.lastDeployed} {item?.ticker}
                    </span>
                  </SmartContractDataCardInfoColumn>
                </SmartContractDataCardInfo>
              </SmartContractDataCard>
            ))}
          </SmartContractDataWrapper>
        )}
      </div>
    </>
  );
};

export default BrowseAllDeployedContracts;
