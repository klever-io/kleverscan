import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import { Container, Header } from '@/styles/common';
import React from 'react';
import Filter, { IFilter } from '../Filter';
import Title from '../Layout/Title';
import { FilterContainer } from '../TransactionsFilters/styles';
import { TableContainer } from './styles';

interface IDetail {
  title: string;
  headerIcon: any;
  cards: any | undefined;
  tableProps?: ITable;
  route?: string;
  filters?: IFilter[];
  customContent?: React.ReactNode;
  customHeader?: React.ReactNode;
}

const Detail: React.FC<PropsWithChildren<IDetail>> = ({
  title,
  headerIcon: Icon,
  cards,
  children,
  tableProps,
  route,
  filters,
  customContent,
  customHeader,
}) => {
  return (
    <Container>
      <Header filterOn={!!filters}>
        <Title title={title} Icon={Icon} route={route} />
      </Header>
      {customHeader && <FilterContainer>{customHeader}</FilterContainer>}
      {filters && (
        <FilterContainer>
          {filters.map(filter => (
            <Filter key={filter.title} {...filter} />
          ))}
        </FilterContainer>
      )}
      {(cards || children) && (
        <TableContainer>
          {cards && <h3>List of {title.toLowerCase()}</h3>}
          {children}
        </TableContainer>
      )}
      {customContent ? customContent : tableProps && <Table {...tableProps} />}
    </Container>
  );
};

export default Detail;
