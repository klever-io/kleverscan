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
import { parseAddress } from '@/utils/parseValues';

const MostTransacted: React.FC<PropsWithChildren> = () => {
  const {
    mostTransactedTokens,
    mostTransactedNFTs,
    mostTransactedKDAFee,
    hotContracts,
  } = useHomeData();

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
      header: ['Rank', 'Contract Adress', 'Owner', 'Transactions'],
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
                <span>View Smart Contracts</span>
                <PurpleArrowRight />
              </Link>
            </TitleContainer>
          )}
          <Table>
            <thead>
              <Row>
                {table.header.map((item, index: number) =>
                  table.title !== 'Hot Contracts' ? (
                    <HeaderItem key={index}>{item}</HeaderItem>
                  ) : (
                    <HeaderItem hotContracts={true} key={index}>
                      {item}
                    </HeaderItem>
                  ),
                )}
              </Row>
            </thead>
            <tbody>
              {table?.data?.map((item, index) =>
                table.title !== 'Hot Contracts' ? (
                  <Row key={index}>
                    <Cell>{index + 1}</Cell>
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
                  </Row>
                ) : (
                  <Row key={index}>
                    <Cell hotContracts>{index + 1}</Cell>
                    <Cell hotContracts>{parseAddress(item?.address, 16)}</Cell>
                    <Cell hotContracts justifyContent={'flex-end'}>
                      {parseAddress(item?.ownerAddress, 16)}
                    </Cell>
                    <Cell hotContracts justifyContent={'flex-end'}>
                      {item?.count}
                    </Cell>
                  </Row>
                ),
              )}
            </tbody>
          </Table>
        </TableContainer>
      ))}
    </SectionContainer>
  );
};

export default MostTransacted;
