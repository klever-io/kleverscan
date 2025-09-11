import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const ViewToggleContainer = styled.div`
  width: 20%;
  display: flex;
  gap: 8px;
  margin-top: 18px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }
`;

export const ViewToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid
    ${({ theme, active }) => (!active ? theme.violet : 'transparent')};
  background: ${({ theme, active }) => (active ? theme.violet : 'transparent')};
  color: ${({ theme, active }) => (active ? 'white' : theme.black)};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding: 16px;

  button {
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.black};
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.gray};
      border-color: ${({ theme }) => theme.violet};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 14px;
    color: ${({ theme }) => theme.gray800};
  }
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border-radius: 200px;
  border: 1px solid ${({ theme }) => theme.darkText};

  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    width: 100%;
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.gray800};

    &::placeholder {
      color: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }

  > svg {
    cursor: pointer;
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }
`;

export const NoNftsFound = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;
