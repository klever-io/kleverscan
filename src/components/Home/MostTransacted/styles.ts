import { TableGradientBorder } from '@/components/Table/styles';
import styled from 'styled-components';

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* gap: 16px; */
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.black};
`;

export const Table = styled.table`
  width: 100%;
  padding: 16px;
  border-radius: 16px;

  ${TableGradientBorder}
`;

export const Row = styled.tr`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.black10};

  &:last-child {
    border-bottom: none;
  }
`;

export const HeaderItem = styled.th<{
  hotContracts?: boolean;
}>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.black};
  text-align: left;

  padding: ${props => (!props.hotContracts ? '4px 16px' : '4px 1px')};
  width: 100%;

  &:first-child {
    padding: 4px;
    width: 60px;
  }

  &:last-child {
    width: 50%;
  }
`;

export const Cell = styled.td<{
  hotContracts?: boolean;
  justifyContent?: string;
}>`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: ${props =>
    props.hotContracts === true ? props.justifyContent : 'flex-start'};

  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.black};
  text-align: left;

  padding: 16px;
  width: 100%;

  &:first-child {
    width: 60px;
  }

  &:last-child {
    width: 50%;
  }
`;

export const MostTransactedLink = styled.a`
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${({ theme }) => theme.black};

  text-decoration: underline;

  cursor: pointer;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  a {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Monrope';
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.violet};
  }
`;

export const HeaderItemHotContractsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  div:first-child {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  div:last-child {
    display: flex;
    flex-direction: row;
  }
`;
