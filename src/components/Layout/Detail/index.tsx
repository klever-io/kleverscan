import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import Table, { ITable } from '@/components/Table';
import { useRouter } from 'next/router';
import React from 'react';
import Title from '../Title';
import { Container, Header, Input, TableContainer } from './styles';

interface IDetail {
  title: string;
  headerIcon: any;
  paginationCount: number;
  cards: any | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  tableProps: ITable;
}

const Detail: React.FC<IDetail> = ({
  title,
  headerIcon: Icon,
  paginationCount,
  cards,
  children,
  page,
  setPage,
  tableProps,
}) => {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <Title title={title} Icon={Icon} />

        <Input />
      </Header>
      <TableContainer>
        {cards && <h3>List of {title.toLowerCase()}</h3>}
        {children}
      </TableContainer>
      <Table {...tableProps} />

      <PaginationContainer>
        <Pagination
          scrollUp={true}
          count={paginationCount}
          page={page}
          onPaginate={page => {
            setPage(page);
          }}
        />
      </PaginationContainer>
    </Container>
  );
};

export default Detail;
