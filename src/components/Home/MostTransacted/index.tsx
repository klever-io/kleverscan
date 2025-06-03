import { PropsWithChildren } from 'react';
import { useHomeData } from '@/contexts/mainPage';
import {
  Cell,
  HeaderItem,
  MostTransactedLink,
  Row,
  SectionContainer,
  Table,
  TableContainer,
  Title,
  TitleContainer,
} from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import Link from 'next/link';
import { PurpleArrowRight } from '@/assets/icons';

const MostTransacted: React.FC<PropsWithChildren> = () => {
  const { mostTransactedTokens, mostTransactedNFTs, mostTransactedKDAFee } =
    useHomeData();

  const hotContracts = [
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
    {
      contractAddress: 'k:2a1e3f4g5h6i7j8k9l0m',
      owner: 'k:1a2b3c4d5e6f7g8h9i0j',
      transactions: 100,
    },
  ];

  const tables = [
    {
      title: 'Most Transacted Tokens',
      data: mostTransactedTokens,
      header: ['Rank', 'Token', 'Total Txn'],
    },
    {
      title: 'Most Transacted NFTs',
      data: mostTransactedNFTs,
      header: ['Rank', 'Token', 'Total Txn'],
    },
    {
      title: 'Most Transacted KDA Fee',
      data: mostTransactedKDAFee,
      header: ['Rank', 'Token', 'Total Txn'],
    },
    {
      title: 'Hot Contracts',
      data: hotContracts,
      header: ['#', 'Contract Adress', 'Owner', 'Transactions'],
    },
  ];

  return (
    <SectionContainer>
      {tables.map((table, index) => (
        <TableContainer key={index}>
          {table.title !== 'Hot Contracts' ? (
            <Title>{table.title}</Title>
          ) : (
            <TitleContainer>
              <Title>{table.title}</Title>
              <Link
                href={{
                  pathname: '/smart-contracts',
                }}
              >
                View Smart Contracts
                <PurpleArrowRight />
              </Link>
            </TitleContainer>
          )}
          <Table>
            <thead>
              <Row>
                {table.header.map((item, index: number) => (
                  <HeaderItem key={index}>{item}</HeaderItem>
                ))}
              </Row>
            </thead>
            <tbody>
              {table?.data?.map((item, index) => (
                <Row key={index}>
                  <Cell>{index + 1}</Cell>
                  {table.title !== 'Hot Contracts' ? (
                    <>
                      <Cell>
                        <Link href={`/asset/${item?.key}`} legacyBehavior>
                          <MostTransactedLink href={`/asset/${item?.key}`}>
                            <AssetLogo
                              logo={item?.logo}
                              ticker={item?.key}
                              name={item?.key}
                            />
                            {item?.key}
                          </MostTransactedLink>
                        </Link>
                      </Cell>
                      <Cell>{item?.doc_count?.toLocaleString()}</Cell>
                    </>
                  ) : (
                    <>
                      <Cell>{item?.contractAddress}</Cell>
                      <Cell>{item?.owner}</Cell>
                      <Cell>{item?.transactions?.toLocaleString()}</Cell>
                    </>
                  )}
                </Row>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      ))}
    </SectionContainer>
  );
};

export default MostTransacted;
