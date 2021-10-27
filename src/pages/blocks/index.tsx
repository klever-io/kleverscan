import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { fromUnixTime } from 'date-fns';

import List, { IList } from '../../components/Layout/List';

import { IBlock, IPagination, IResponse } from '../../types';

import api from '../../services/api';
import { getAge } from '../../utils';
import { navbarItems } from '../../configs/navbar';

interface IBlockPage {
  blocks: IBlock[];
  pagination: IPagination;
}

interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
  pagination: IPagination;
}

const Blocks: React.FC<IBlockPage> = ({
  blocks: initialBlocks,
  pagination,
}) => {
  const title = 'Blocks';
  const Icon = navbarItems.find(item => item.name === 'Blocks')?.Icon;
  const maxItems = pagination.totalRecords;
  const headers = ['Nonce', 'Age', 'Transactions'];

  const [blocks, setBlocks] = useState<IBlock[]>(initialBlocks);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    const newBlocks: IBlockResponse = await api.get({
      route: 'block/list',
      query: { page },
    });
    if (!newBlocks.error) {
      setBlocks([...blocks, ...newBlocks.data.blocks]);

      const next = newBlocks.pagination.next;
      if (next !== 0) {
        setPage(next);
      }
    }
  };

  const listProps: IList = {
    title,
    Icon,
    maxItems,
    listSize: blocks.length,
    headers,
    loadMore,
  };

  const renderItems = () =>
    blocks.map((block, index) => {
      return (
        <tr key={String(index)}>
          <td>
            <Link href={`/blocks/${block.nonce}`}>
              <a>{block.nonce}</a>
            </Link>
          </td>
          <td>{getAge(fromUnixTime(block.timestamp))} ago</td>
          <td>{block.txCount}</td>
          {/* <td>{block.producerID}</td> */}
        </tr>
      );
    });

  return <List {...listProps}>{renderItems()}</List>;
};

export const getServerSideProps: GetServerSideProps<IBlockPage> = async () => {
  const props: IBlockPage = {
    blocks: [],
    pagination: {} as IPagination,
  };

  const block: IBlockResponse = await api.get({
    route: 'block/list',
  });
  if (!block.error) {
    props.blocks = block.data.blocks;
    props.pagination = block.pagination;
  }

  return { props };
};

export default Blocks;
