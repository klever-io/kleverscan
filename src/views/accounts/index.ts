import styled from 'styled-components';

export const TableContainer = styled.section`
  display: flex;

  color: ${props => props.theme.black};

  flex-direction: column;

  gap: 1.5rem;
`;

export const SingleNFTTableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
