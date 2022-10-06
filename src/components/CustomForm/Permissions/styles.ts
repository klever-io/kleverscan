import styled from 'styled-components';

export const ContractsList = styled.div`
  width: 200%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-columns: auto;
  row-gap: 1rem;

  margin-bottom: 1rem;
  margin-top: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    width: 120%;
  }
`;

export const CheckboxContract = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;

  span {
    color: ${({ theme }) => theme.darkText};
    font-weight: 600;
  }
`;

export const Checkbox = styled.input`
  height: 1rem;
  width: 1rem;
  background: none;
  -webkit-appearance: none;
  border-radius: 0.2rem;

  ::before {
    content: '';
    color: transparent;
    display: block;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: transparent;
    background-size: contain;
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.darkText};
  }

  :checked {
    background-color: ${({ theme }) => theme.darkText};
    ::before {
      box-shadow: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    }
  }
`;
