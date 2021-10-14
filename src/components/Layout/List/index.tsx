import React from 'react';

import { IconType } from 'react-icons';

import {
  Container,
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
}

const List: React.FC<IList> = ({
  title,
  Icon,
  maxItems,
  listSize,
  headers,
  loadMore,
  children,
}) => {
  const paginationInfo = `Showing ${listSize} of ${maxItems}`;

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

  return (
    <Container>
      <Header />
      <PaginationInfo>{paginationInfo}</PaginationInfo>
      <TableContainer>
        <table>
          <thead>
            <tr>{getTableTitles()}</tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </TableContainer>
      <LoadMoreButton onClick={loadMore}>
        <span>see more</span>
      </LoadMoreButton>
    </Container>
  );
};

export default List;
