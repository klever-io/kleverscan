import styled from 'styled-components';

export const Container = styled.div`
  padding: 5rem 17rem;

  @media (max-width: 1500px) {
    padding: 5rem 7rem;
  }

  @media (max-width: 1200px) {
    padding: 5rem 3rem;
  }
`;

export const MapContainer = styled.div`
  margin-bottom: 1.5rem;

  background-color: ${props => props.theme.white};
  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.table.shadow};
`;

export const ChartContainer = styled.div`
  padding: 0.5rem;

  background-color: ${props => props.theme.white};
  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.table.shadow};
`;

export const ChartHeader = styled.div`
  margin-top: 0.5rem;

  padding: 1.5rem;

  width: 100%;

  display: flex;

  flex-direction: column;
  align-items: center;

  color: ${props => props.theme.navbar.mobile};

  h1 {
    font-size: 1.875rem;
    font-weight: 500;
  }

  span {
    font-size: 0.975rem;
    font-weight: 300;
  }
`;

export const ChartBody = styled.div`
  margin: 0.5rem;

  width: 100%;
  height: 20.31rem;
`;
