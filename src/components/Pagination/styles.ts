import styled, { css } from 'styled-components';

export const PaginationContainer = styled.div`
  margin-top: 1rem;

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;
`;

export const ArrowContainer = styled.div<{ active: boolean }>`
  height: 2rem;
  width: 2rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.white};

  border-radius: 50%;

  cursor: ${props => (props.active ? 'pointer' : 'not-allowed')};

  opacity: ${props => !props.active && 0.3};
`;

export const ItemContainer = styled.div<{ active: boolean }>`
  height: 2rem;
  width: 2rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.active ? props.theme.pagination.active : 'transparent'};

  border-radius: 50%;

  color: ${props => (props.active ? props.theme.white : props.theme.black)};

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    ${props =>
      !props.active
        ? css`
            background-color: ${props => props.theme.pagination.active};
            color: ${props => props.theme.white};
          `
        : css`
            cursor: not-allowed;
          `}
  }
`;
