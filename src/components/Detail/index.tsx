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
  tableProps: ITable;
  route?: string;
  filters?: IFilter[];
}

const Detail: React.FC<IDetail> = ({
  title,
  headerIcon: Icon,
  cards,
  children,
  tableProps,
  route,
  filters,
}) => {
  return (
    <Container>
      <Header filterOn={!!filters}>
        <Title title={title} Icon={Icon} route={route} />
        {filters && (
          <FilterContainer>
            {filters.map(filter => (
              <Filter key={filter.current} {...filter} />
            ))}
          </FilterContainer>
        )}
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
