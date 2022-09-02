import styled from 'styled-components';

export const Container = styled.div``;

export const MapContainer = styled.div`
  margin-bottom: 1.5rem;

  background-color: ${props => props.theme.white};
  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.shadow};
`;

export const CardDetails = styled.div<{ variation?: boolean }>`
  width: 100%;
  position: absolute;
  bottom: 0;

  div {
    width: 100%;
    display: flex;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    span {
      &:last-child {
        color: ${props =>
          props.variation !== undefined &&
          props.variation &&
          props.theme.map.marker};
      }

      font-weight: 600;
    }
  }
`;

export const CardChartContainer = styled.div`
  position: relative;

  height: 6rem;
  width: 100%;

  svg {
    display: block;
    margin: auto;
    overflow: hidden;
    height: 7.5rem;
  }
`;

export const ChartContainer = styled.div`
  padding: 0.5rem;

  background-color: ${props => props.theme.white};
  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.shadow};
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
