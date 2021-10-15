import styled from 'styled-components';

export const Container = styled.div`
  padding: 5rem 17rem;

  @media (max-width: 1200px) {
    padding: 5rem 7rem;
  }

  @media (max-width: 768px) {
    padding: 5rem 3rem;
  }
`;

export const Content = styled.div`
  margin-top: 0.25rem;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.table.shadow};
`;

export const Header = styled.div`
  padding: 1.25rem 0.75rem 0.5rem 0.75rem;

  display: flex;

  flex-direction: row;

  align-items: center;

  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  background-color: ${props => props.theme.gray};

  color: ${props => props.theme.table.text};

  h3 {
    font-size: 1.75rem;
    font-weight: 500;
  }

  span {
    margin-left: 0.5rem;

    font-weight: 400;
  }
`;

export const HeaderIcon = styled.div`
  padding: 0.5rem;
  margin-right: 1.25rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-image: ${props => props.theme.button.background};

  color: ${props => props.theme.white};

  border-radius: 0.5rem;

  svg {
    font-size: 1.5rem;
  }
`;

export const Body = styled.div`
  padding: 1.5rem 0.75rem 0.75rem 0.75rem;

  display: flex;

  flex-direction: row;
  flex-wrap: wrap;

  gap: 0.75rem;

  border-top: 1px solid ${props => props.theme.rose};
`;

export const SideContainer = styled.div`
  flex: 49%;
`;

export const AddressInfoContainer = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  span {
    margin: 1rem 0;

    color: ${props => props.theme.table.text};
    font-weight: 400;
  }

  p {
    color: ${props => props.theme.table.link};
  }
`;

export const Divider = styled.div`
  margin: 0.5rem -0.75rem;

  height: 1px;
  width: calc(100% + 0.75rem);

  background-color: ${props => props.theme.border};
`;

export const BalanceContainer = styled.div`
  margin-top: 1rem;

  span {
    color: ${props => props.theme.table.text};
    font-weight: 400;
  }
`;

export const BalanceHeader = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;

    flex-direction: column;
    align-items: flex-end;

    span {
      font-weight: 500;
      font-size: 1.5rem;
    }

    p {
      font-weight: 400;
      font-size: 0.875rem;
      color: ${props => props.theme.table.text};
    }
  }
`;

export const BalanceBody = styled.div`
  margin: 0.75rem 0;
  padding: 0.5rem 0.75rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: ${props => props.theme.background};

  border-radius: 0.5rem;

  color: ${props => props.theme.table.text};

  div {
    display: flex;

    flex-direction: row;

    gap: 0.5rem;
  }

  svg {
    color: ${props => props.theme.table.icon};
  }
`;

export const TransferContainer = styled.div`
  margin-top: 0.75rem;

  display: flex;

  flex-direction: row;

  color: ${props => props.theme.table.text};

  span {
    margin-right: 5rem;

    font-weight: 400;
  }

  div {
    display: flex;

    flex-direction: row;
    align-items: center;

    p {
      margin-right: 0.5rem;
    }

    svg {
      &:first-child {
        color: ${props => props.theme.table.red};
      }

      color: ${props => props.theme.table.green};
    }
  }
`;

export const PowerContainer = styled.div`
  margin: 1rem 0;

  width: 100%;

  display: flex;

  flex-direction: column;

  span {
    color: ${props => props.theme.table.text};
    font-weight: 400;
  }
`;

export const EnergyContainer = styled.div`
  margin: 1rem 0;

  display: flex;

  flex-direction: column;

  div {
    &:first-child {
      display: flex;

      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      p {
        color: ${props => props.theme.table.text};
        font-size: 1.25rem;
      }
    }
  }
`;

export const EnergyLoader = styled.div<{ percent: number }>`
  margin-top: 0.5rem;

  width: 100%;
  height: 0.35rem;

  background-color: ${props => props.theme.table.shadow};

  border-radius: 0.5rem;

  div {
    width: ${props => props.percent}%;
    height: 0.35rem;

    border-radius: 0.5rem;

    background: ${props => props.theme.table.energy};
  }
`;

export const EnergyChartContainer = styled.div`
  display: flex;

  flex-direction: row;
`;

export const ChartContainer = styled.div`
  margin-top: 1rem;

  display: flex;

  flex-direction: row;
  justify-content: space-between;

  gap: 0.75rem;
`;

export const ChartContent = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column !important;
`;

export const ChartHeader = styled.div`
  display: flex;

  width: 100%;

  flex-direction: row;
  justify-content: space-between;

  div {
    &:first-child {
      display: flex;

      align-items: center;

      gap: 0.75rem;
    }

    &:not(:first-child) {
      padding: 0.35rem;

      display: flex;

      align-items: center;
      justify-content: center;

      background-color: ${props => props.theme.table.shadow};

      border-radius: 0.5rem;

      cursor: pointer;

      svg {
        font-size: 1.05rem;
        color: ${props => props.theme.table.helpIcon};
      }
    }

    svg {
      font-size: 1.25rem;
      color: ${props => props.theme.table.text};
    }
  }
`;

export const ChartBody = styled.div`
  margin-top: 1rem;

  width: 100%;

  display: flex;

  flex-direction: row;

  justify-content: center;
  align-items: center;

  gap: 0.75rem;

  div {
    display: flex;

    flex-direction: column;

    strong {
      margin-top: 0.5rem;

      font-weight: 500;
      color: ${props => props.theme.table.text};
    }
  }
`;

export const HorizontalDivider = styled.div`
  margin: auto 0;

  height: 100%;
  width: 1px;

  background-color: ${props => props.theme.border};
`;

const circleSize = 7;
export const CircleChart = styled.div<{ active: boolean }>`
  height: ${circleSize}rem;
  width: ${circleSize}rem;

  position: relative;
  display: flex;

  align-items: center;
  justify-content: center;

  background: ${props =>
    props.active ? props.theme.button.background : props.theme.gray};

  border-radius: 100%;

  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);

  div {
    margin-left: 0.25rem;

    height: calc(${circleSize}rem - 0.5rem);
    width: calc(${circleSize}rem - 0.5rem);

    background-color: ${props => props.theme.white};

    border-radius: 100%;

    span {
      margin: 0 auto;

      font-size: 1.75rem;
    }
  }
`;
