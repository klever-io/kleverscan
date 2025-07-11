import { PropsWithChildren } from 'react';
import { MultiSigList } from '../../styles';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import Filter from '@/components/Filter';

export interface IMultisignList {
  hashs: string[];
  selectedHash: string;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
}

export const MultiSignList: React.FC<PropsWithChildren<IMultisignList>> = ({
  hashs,
  selectedHash,
  setSelectedHash,
}) => {
  const items = [
    {
      title: 'Transactions hash',
      data: hashs || 'None',
      onClick: (selected: string) => setSelectedHash(selected),
      current: selectedHash,
      loading: false,
      maxWidth: true,
    },
  ];

  return (
    <MultiSigList>
      <FilterContainer>
        {items.map(filter => (
          <Filter key={JSON.stringify(filter)} {...filter} />
        ))}
      </FilterContainer>
    </MultiSigList>
  );
};
