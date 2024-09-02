import styled from 'styled-components';

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
