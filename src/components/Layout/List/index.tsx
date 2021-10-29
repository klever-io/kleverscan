import React from 'react';

import { IconType } from 'react-icons';

import {
  Container,
  EmptyRow,
  HeaderContainer,
  HeaderIcon,
  InputContainer,
  LoadMoreButton,
  PaginationInfo,
  TableContainer,
} from './styles';

import Input from '../../Input';

import { BsQuestionCircleFill } from 'react-icons/bs';

export interface IList {
  title: string;
  Icon: IconType | undefined;
  maxItems: number;
  listSize: number;
  loadMore?(): void;
  headers: string[];
  maxPage?: boolean;
}

const List: React.FC<IList> = ({
  title,
  Icon,
  maxItems,
  listSize,
  headers,
  loadMore,
  maxPage,
  children,
}) => {
  const paginationInfo = `Showing ${listSize} of ${maxItems || 0}`;

  const Header: React.FC = () => {
    return (
      <HeaderContainer>
        <div>
          <HeaderIcon>{Icon ? <Icon /> : <BsQuestionCircleFill />}</HeaderIcon>
          <span>{title}</span>
        </div>
        <InputContainer>
          <Input />
        </InputContainer>
      </HeaderContainer>
    );
  };

  const getTableTitles = () =>
    headers.map((header, index) => <th key={String(index)}>{header}</th>);

  const EmptyBody: React.FC = () => {
    return (
      <EmptyRow>
        <td
          colSpan={headers.length}
        >{`Unable to load list of ${title.toLowerCase()}`}</td>
      </EmptyRow>
    );
  };

  return (
    <Container>
      <Header />
      <PaginationInfo>{paginationInfo}</PaginationInfo>
      <TableContainer>
        <table>
          <thead>
            <tr>{getTableTitles()}</tr>
          </thead>
          <tbody>{maxItems > 0 ? children : <EmptyBody />}</tbody>
        </table>
      </TableContainer>
      {maxItems > 10 && (
        <LoadMoreButton onClick={loadMore} maxPage={maxPage || false}>
          <span>see more</span>
        </LoadMoreButton>
      )}
    </Container>
  );
};

export default List;
