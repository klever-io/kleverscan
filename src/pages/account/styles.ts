import styled, { css } from 'styled-components';

export const RowAlert = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 1rem;
  span {
    font-size: 14px;
    font-weight: 400;
    background-color: #f8496033;
    padding: 2px 4px;
    border-radius: 4px;
    color: ${({ theme }) => theme.black};
  }
  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        props.theme.dark ? props.theme.black10 : props.theme.lightGray};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;

export const RowAddress = styled.div<{ isMobileRow?: boolean }>`
  width: 100%;
  align-items: flex-start;
  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        props.theme.dark ? props.theme.black10 : props.theme.lightGray};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  > span {
    &:first-child {
      width: 10rem;
      flex-direction: column;
    }
  }

  span {
    width: fit-content;
    max-width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }
  > strong {
    min-width: 8rem;
    font-weight: 600;
    color: ${props => props.theme.darkText};
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    ${props =>
      props.isMobileRow &&
      css`
        flex-direction: row;
        align-items: center;
      `}
  }
`;
