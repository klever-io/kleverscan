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
`;

export const ItemContainer = styled.div<{ selected: boolean }>`
  position: relative;

  cursor: pointer;

  span {
    opacity: ${props => (props.selected ? 1 : 0.2)};

    font-weight: 600;
    font-size: 1.1rem;

    transition: 0.2s ease;
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
