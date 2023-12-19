import styled, { css } from 'styled-components';

export const PaginationContainer = styled.div`
  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;
  max-width: 40rem;
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  gap: 0.5rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: fit-content;
  }
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

export const ItemContainer = styled.div<{
  active: boolean;
  onClick: () => void;
}>`
  height: 2rem;
  width: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: smaller;
  }

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.active ? props.theme.purple : 'transparent'};

  border-radius: 50%;

  color: ${props =>
    props.active ? props.theme.true.white : props.theme.black};

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    ${props =>
      !props.active
        ? css`
            background-color: ${props => props.theme.purple};
            color: ${props => props.theme.white};
          `
        : css`
            cursor: not-allowed;
          `}
  }
`;
