import React from 'react';
import Skeleton from '../Skeleton';
import { Cell, Row, Table } from '../Home/MostTransacted/styles';

interface ISkeletonTableProps {
  items: number;
  columns: number;
}

const SkeletonTable: React.FC<ISkeletonTableProps> = ({ items, columns }) => {
  return (
    <>
      {Array.from({ length: items }).map((_, index) => (
        <Row key={index}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Cell key={colIndex}>
              <Skeleton />
            </Cell>
          ))}
        </Row>
      ))}
    </>
  );
};

export default SkeletonTable;
