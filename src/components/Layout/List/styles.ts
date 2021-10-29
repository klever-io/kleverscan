import { darken } from 'polished';
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

export const HeaderContainer = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  span {
    color: ${props => props.theme.navbar.mobile};
    font-size: 1.5rem;
    font-weight: 500;
  }

  div {
    &:first-child {
      display: flex;

      flex-direction: row;
      align-items: center;
    }
  }

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

export const HeaderIcon = styled.div`
  padding: 0.5rem;
  margin-right: 0.5rem;

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

export const InputContainer = styled.div`
  display: flex;

  flex-direction: column;
`;

export const PaginationInfo = styled.div`
  margin: 0.75rem 0;

  font-weight: 400;
  color: ${props => props.theme.navbar.mobile} !important;
`;

export const TableContainer = styled.div`
  overflow-x: auto;

  border-radius: 0.5rem;

  box-shadow: 0 2px 15px ${props => props.theme.table.shadow};

  table {
    width: 100%;

    border-radius: 0.5rem;
    border-spacing: 0;

    thead {
      background-color: ${props => props.theme.gray};
    }

    tbody {
      overflow-x: auto;

      tr {
        transition: 0.2s ease;

        &:first-child {
          td {
            border-color: ${props => props.theme.rose};
          }
        }

        &:hover {
          background-color: ${props => darken(0.025, props.theme.white)};
        }
      }
    }

    td {
      padding: 0.975rem 0.75rem;
      border-top: 1px solid ${props => props.theme.border};

      font-weight: 400;

      span {
        display: block;

        max-width: 10rem;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        a {
          background-image: ${props => props.theme.text.largeBackground};
          background-clip: text;
          -webkit-background-clip: text;

          color: transparent;

          cursor: pointer;

          &:hover {
            text-decoration: underline;
            text-decoration-color: ${props => props.theme.rose};
          }
        }
      }

      a {
        background-image: ${props => props.theme.text.background};
        background-clip: text;
        -webkit-background-clip: text;

        color: transparent;

        cursor: pointer;

        &:hover {
          text-decoration: underline;
          text-decoration-color: ${props => props.theme.rose};
        }
      }
    }

    th {
      padding: 0.975rem 0.75rem;

      text-align: left;

      font-weight: 500;
      color: ${props => props.theme.text.black};
    }
  }
`;

export const EmptyRow = styled.tr`
  td {
    color: ${props => props.theme.input.placeholder};
    text-align: center;
  }
`;

export const LoadMoreButton = styled.div<{ maxPage: boolean }>`
  margin-top: 2.5rem;
  padding: 1rem 0;

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: ${props => (props.maxPage ? 'not-allowed' : 'pointer')};

  background-color: ${props => props.theme.gray};

  border-radius: 0.25rem;

  color: ${props => props.theme.navbar.mobile};
  font-size: 0.875rem;
  text-transform: uppercase;

  transition: 0.2s ease;

  &:hover {
    background-color: ${props => darken(0.05, props.theme.gray)};
  }
`;
