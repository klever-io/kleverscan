import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  > div {
    min-width: 13rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;

    flex-direction: column;
  }
`;

export const TxsFiltersWrapper = styled.div`
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;

  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  div {
    display: flex;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    div:nth-child(1) {
      width: 100%;
      flex-direction: column;
    }
  }
`;

export const ContainerFilter = styled.div`
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const RightFiltersContent = styled.div`
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;
export const FilterDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  > span {
    color: ${props => props.theme.darkText};
    font-weight: 600;
    font-size: 0.9rem;
  }
  > div {
    min-width: 14rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
  }
`;
