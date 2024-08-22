import styled from 'styled-components';

export const GenericInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  grid-column: auto / span 2;
  padding-left: 1rem;
  p {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.darkText};
    background: ${({ theme }) => theme.table.background};
  }
`;
