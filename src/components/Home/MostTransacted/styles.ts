import { TableGradientBorder } from '@/components/TableV2/styles';
import styled from 'styled-components';

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
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

export const HeaderItem = styled.th`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.black};
  text-align: left;

  padding: 4px 16px;
  width: 100%;

  &:first-child {
    padding: 4px;
    width: 60px;
  }

  &:last-child {
    width: 50%;
  }
`;

export const Cell = styled.td`
  display: flex;
  gap: 8px;
  align-items: center;

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
