import Table, { ITable } from '@/components/Table';
import React from 'react';
import Title from '../Title';
import { Container, Header, Input, TableContainer } from './styles';

interface IDetail {
  title: string;
  headerIcon: any;
  cards: any | undefined;
  tableProps: ITable;
  route?: string;
}

const Detail: React.FC<IDetail> = ({
  title,
  headerIcon: Icon,
  cards,
  children,
  tableProps,
  route,
}) => {
  return (
    <Container>
      <Header>
        <Title title={title} Icon={Icon} route={route} />
        <Input />
      </Header>
      <TableContainer>
        {cards && <h3>List of {title.toLowerCase()}</h3>}
        {children}
      </TableContainer>
      <Table {...tableProps} />
    </Container>
  );
};

export default Detail;
