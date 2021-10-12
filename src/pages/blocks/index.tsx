import React, { useState } from 'react';

import { GetStaticProps } from 'next';

import List, { IList } from '../../components/Layout/List';

import { IHyperblock, IPagination, IResponse } from '../../types';

import api from '../../services/api';

import { FaLaravel } from 'react-icons/fa';
import { fromUnixTime } from 'date-fns';
import { getAge } from '../../utils';

interface IHyperblockPage {
  hyperblocks: IHyperblock[];
  pagination: IPagination;
}

interface IHyperblockResponse extends IResponse {
  data: {
    hyperblocks: IHyperblock[];
  };
  pagination: IPagination;
}

const Blocks: React.FC<IHyperblockPage> = ({
  hyperblocks: initialHyperblocks,
  pagination,
}) => {
  const title = 'Blocks';
  const Icon = FaLaravel;
  const maxItems = pagination.totalRecords;
  const headers = ['Height', 'Age', 'Transactions', 'Produced By'];

  const [hyperblocks, setHyperblocks] =
    useState<IHyperblock[]>(initialHyperblocks);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    const newHyperblocks: IHyperblockResponse = await api.get({
      route: 'hyperblock/list',
      query: { page },
    });
    if (!newHyperblocks.error) {
      setHyperblocks([...hyperblocks, ...newHyperblocks.data.hyperblocks]);

      const next = newHyperblocks.pagination.next;
      if (next !== 0) {
        setPage(next);
      }
    }
  };

  const listProps: IList = {
    title,
    Icon,
    maxItems,
    listSize: hyperblocks.length,
    headers,
    loadMore,
  };

  const renderItems = () =>
    hyperblocks.map((hyperblock, index) => {
      return (
        <tr key={String(index)}>
          <td>{hyperblock.size}</td>
          <td>{getAge(fromUnixTime(hyperblock.timeStamp))} ago</td>
          <td>{hyperblock.sizeTxs}</td>
          <td>{hyperblock.producerID}</td>
        </tr>
      );
    });

  return <List {...listProps}>{renderItems()}</List>;
};

export const getStaticProps: GetStaticProps<IHyperblockPage> = async () => {
  const props: IHyperblockPage = {
    hyperblocks: [],
    pagination: {} as IPagination,
  };

  const hyperblocks: IHyperblockResponse = await api.get({
    route: 'hyperblock/list',
  });
  if (!hyperblocks.error) {
    props.hyperblocks = hyperblocks.data.hyperblocks;
    props.pagination = hyperblocks.pagination;
  }

  return { props };
};

export default Blocks;
