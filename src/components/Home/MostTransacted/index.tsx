import { useHomeData } from '@/contexts/mainPage';
import {
  Cell,
  HeaderItem,
  Row,
  SectionContainer,
  Table,
  TableContainer,
  Title,
} from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';

const MostTransacted: React.FC = () => {
  const { mostTransactedTokens, mostTransactedNFTs } = useHomeData();

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
  ];

  return (
    <SectionContainer>
      {tables.map((table, index) => (
        <TableContainer key={index}>
          <Title>{table.title}</Title>
          <Table>
            <thead>
              <Row>
                {table.header.map((item, index: number) => (
                  <HeaderItem key={index}>{item}</HeaderItem>
                ))}
              </Row>
            </thead>
            <tbody>
              {table.data.map((item, index) => (
                <Row key={index}>
                  <Cell>{index + 1}</Cell>
                  <Cell>
                    <AssetLogo
                      logo={item.logo}
                      ticker={item.key}
                      name={item.key}
                    />
                    {item.key}
                  </Cell>
                  <Cell>{item.doc_count}</Cell>
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
