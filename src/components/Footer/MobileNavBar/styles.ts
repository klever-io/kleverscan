import Image from 'next/legacy/image';
import styled, { css } from 'styled-components';

export const Container = styled.footer`
  position: fixed;
  width: 100%;
  height: 5rem;
  bottom: 0;
  background: #0b0b1e;

  z-index: 5;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;
export const ItemsContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.white};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const ItemsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  width: 20%;
  height: 100%;

  p {
    font-weight: 500;
    font-size: 0.8rem;
    line-height: 16px;
    text-align: center;
  }
`;

export const IconContainer = styled.div<{
  $itemSelected: boolean;
  blockIcon: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  color: ${({ $itemSelected, theme }) =>
    $itemSelected ? theme.black : theme.navbar.text};
`;

export const StyledImage = styled(Image)<{
  $itemSelected: boolean;
}>`
  ${props =>
    !props.theme.dark &&
    css`
      filter: ${$itemSelected => ($itemSelected ? 'brightness(0)' : 'none')};
    `}
  ${props =>
    props.theme.dark &&
    css`
      filter: ${$itemSelected =>
        $itemSelected ? 'brightness(0) invert(1)' : 'none'};
    `}
`;
