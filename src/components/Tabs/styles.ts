import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  flex-direction: column;
`;

export const TabContainer = styled.div`
  margin: 2rem 0;

  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;
  @media (max-width: 768px) {
    display: grid;
  }
`;

export const TabContent = styled.div`
  display: flex;
  margin: 2rem 0;

  @media (max-width: 768px) {
    display: flex;
    margin: 2rem 1rem;
  }
`;

export const ItemContainer = styled.div<{ selected: boolean }>`
  position: relative;

  cursor: pointer;

  color: ${props => props.theme.black};

  span {
    padding: 0.5rem;
    opacity: ${props => (props.selected ? 1 : 0.2)};

    font-weight: 600;
    font-size: 1.1rem;

    transition: 0.2s ease;
  }
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const FilterContent = styled.div`
  gap: 1rem;
  width: 100%;
  display: flex;
  .select {
    select {
      text-align: center;
      width: 100%;
      height: 2.8rem;
      display: flex;
      background-color: ${props =>
        props.theme.dark
          ? props.theme.card.assetText
          : props.theme.dateFilter.outsideBackground};
      border: 1px solid ${props => props.theme.filter.border};
      border-radius: 0.5rem;
      cursor: pointer;
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: #aa33b5;
      select-items {
      }
    }
    .option {
      padding: 0.25rem 0.5rem;

      display: flex;

      border-radius: 0.5rem;

      transition: 0.2s ease;
      &:hover {
        background: pink;
      }
    }
  }
  @media (max-width: 768px) {
    display: grid;
  }
`;

export const Indicator = styled.div<{ selected: boolean }>`
  width: 100%;
  height: 3px;

  bottom: -0.5rem;

  position: absolute;

  visibility: ${props => (props.selected ? 'visible' : 'hidden')};
  opacity: ${props => (props.selected ? 1 : 0)};

  background-color: ${props => props.theme.tab.indicator};
`;
