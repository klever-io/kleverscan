import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  > div:last-child {
    min-width: 15rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;

    flex-direction: column;
  }
`;

export const TxsFiltersWrapper = styled.div`
  margin-bottom: 0.5rem;
`;
