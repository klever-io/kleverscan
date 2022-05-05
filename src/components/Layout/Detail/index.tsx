import React from 'react';

import { useRouter } from 'next/router';

import { Container, Header, Input, TableContainer, Title } from './styles';

import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';

import { ArrowLeft } from '@/assets/icons';

interface IDetail {
  title: string;
  headerIcon: any;
  paginationCount: number;
  cards: any | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Detail: React.FC<IDetail> = ({
  title,
  headerIcon: Icon,
  paginationCount,
  cards,
  children,
  page,
  setPage,
}) => {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>{title}</h1>
          <Icon />
        </Title>

        <Input />
      </Header>

      <TableContainer>
        {cards && <h3>List of {title.toLowerCase()}</h3>}
        {children}
      </TableContainer>

      <PaginationContainer>
        <Pagination
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
