import { transparentize } from 'polished';
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

export const Header = styled.section`
  padding-bottom: 1rem;

  display: flex;

  flex-direction: row;

  align-items: center;

  color: ${props => props.theme.table.text};

  border-bottom: 1px solid ${transparentize(0.5, 'red')};

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

export const Content = styled.section`
  border-radius: 0.25rem;

  background-color: ${props => props.theme.white};

  box-shadow: 0 2px 15px ${props => props.theme.table.shadow};
`;

export const TabContainer = styled.div`
  overflow-x: auto;

  position: relative;
  display: flex;

  flex-direction: row;

  border-bottom: 1px solid ${props => props.theme.content.divider};
`;

export const Indicator = styled.div`
  height: 3px;

  bottom: 0;

  position: absolute;

  background-color: ${props => props.theme.content.tab.active};

  transition: 0.2s ease;
`;

export const Tab = styled.div<{ active: boolean }>`
  padding: 1.25rem;

  display: flex;

  align-items: center;
  justify-content: center;

  color: ${props =>
    props.theme.content.tab[props.active ? 'active' : 'inactive']};

  font-weight: 500;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    color: ${props => props.theme.content.tab.active};
  }
`;

export const Info = styled.div`
  padding: 0.5rem;

  display: flex;

  flex-direction: row;

  color: ${props => props.theme.navbar.mobile};

  span {
    width: 12.5rem;

    font-weight: 400;
    font-size: 0.975rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin-left: 0.5rem;

    width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    cursor: pointer;
  }

  a {
    margin-left: 0.5rem;

    width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Divider = styled.div`
  margin: 0.5rem 0;

  height: 1px;
  width: 100%;

  background-color: ${props => props.theme.content.divider};
`;
