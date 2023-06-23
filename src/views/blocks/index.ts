import styled from 'styled-components';

export const TableContainer = styled.section<{ autoUpdate: boolean }>`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  color: ${props => props.theme.black};
`;

export const UpdateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  color: ${props => props.theme.black};
`;
