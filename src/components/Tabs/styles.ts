import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  margin-top: 2rem;
`;

export const TabContainer = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
  }
`;

export const TabContent = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;

  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: 2rem 1rem;
  }
`;

export const ItemContainer = styled.div<{ selected: boolean }>`
  display: flex;
  margin-bottom: ${props => (props.selected ? '0.5rem' : '')};

  position: relative;

  cursor: pointer;

  color: ${props => props.theme.black};

  span {
    padding: 0.5rem;
    opacity: ${props => (props.selected ? 1 : 0.2)};
    font-weight: 600;
    font-size: 1.1rem;

    white-space: nowrap;

    transition: 0.2s ease;
  }
`;

export const FilterContent = styled.div`
  gap: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  > div:last-child {
    min-width: 18rem;
  }
  div {
    display: flex;
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    > div:last-child {
      width: 100%;
    }
  }
`;

export const Indicator = styled.div<{ selected: boolean }>`
  width: 100%;
  height: 3px;

  bottom: 0;

  position: absolute;

  visibility: ${props => (props.selected ? 'visible' : 'hidden')};
  opacity: ${props => (props.selected ? 1 : 0)};

  background-color: ${props => props.theme.violet};
`;
