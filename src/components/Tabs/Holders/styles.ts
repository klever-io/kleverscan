import { FilterContainer } from '@/components/TransactionsFilters/styles';
import styled from 'styled-components';

export const RankingContainer = styled.div`
  height: 2.25rem;
  width: 2.25rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.background};

  border-radius: 50%;
`;

export const RankingText = styled.span`
  margin-left: 0.25rem;

  width: fit-content !important;

  color: ${props => props.theme.black};
  font-weight: 600;
`;

export const AddressContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterContainerHolders = styled(FilterContainer)`
  margin-bottom: 1rem;
`;

export const AmountWithShare = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const PercentageText = styled.span`
  color: ${props => props.theme.darkText};
  font-size: 0.85rem;
  white-space: nowrap;
`;
