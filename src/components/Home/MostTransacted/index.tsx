import { PropsWithChildren } from 'react';
import { useHomeData } from '@/contexts/mainPage';
import {
  Cell,
  HeaderItem,
  MostTransactedDoubleRow,
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
import { getNetwork } from '@/utils/networkFunctions';
import SkeletonTable from '@/components/SkeletonTable';
const network = getNetwork();

const MostTransacted: React.FC<PropsWithChildren> = () => {
  const {
    mostTransactedTokens,
    mostTransactedNFTs,
    mostTransactedKDAFee,
    hotContracts,
    loadingMostTransacted,
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
    ...(network !== 'Mainnet'
      ? [
          {
            title: 'Hot Contracts',
            data: hotContracts,
            header: ['Rank', 'Contract', 'Owner', 'Transactions'],
          },
        ]
      : []),
  ];

  return (
    <SectionContainer network={network}>
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
                {table.header.map((item, index: number) => (
                  <HeaderItem key={index}>{item}</HeaderItem>
                ))}
              </Row>
            </thead>
            <tbody>
              {loadingMostTransacted ? (
                <SkeletonTable items={10} columns={table.header.length} />
              ) : (
                table?.data?.map((item, index) =>
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
                      <Cell>{index + 1}</Cell>
                      <Cell>
                        <MostTransactedDoubleRow>
                          <span>{item?.name || '- -'}</span>
                          <MostTransactedLink
                            href={`/smart-contract/${item?.address}`}
                          >
                            <span>{parseAddress(item?.address, 16)}</span>
                          </MostTransactedLink>
                        </MostTransactedDoubleRow>
                      </Cell>
                      <Cell>{parseAddress(item?.ownerAddress, 16)}</Cell>
                      <Cell>{item?.count}</Cell>
                    </Row>
                  ),
                )
              )}
            </tbody>
          </Table>
        </TableContainer>
      ))}
    </SectionContainer>
  );
};

export default MostTransacted;
