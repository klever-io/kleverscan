import { DefaultCardStyles } from '@/styles/common';
import { lighten } from 'polished';
import styled from 'styled-components';

export const Pack = styled.div`
  padding: 1rem;
  max-width: 20rem;
  width: 100%;
  ${DefaultCardStyles}

  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    margin: 1rem;
  }
  filter: ${props =>
    props.theme.dark ? 'brightness(1.1)' : 'brightness(97%)'};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};
`;

export const PackItem = styled.div`
  height: 6rem;
  width: 100%;
  padding: 1rem 0;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 0.3rem;
  gap: 0.3rem;

  p {
    text-align: center;
    &:first-child {
      font-size: 1rem;
      color: ${props => props.theme.violet};
    }
    &:not(:first-child) {
      font-size: 1rem;
    }
    color: ${props => props.theme.black};
  }
`;

export const BuyButton = styled.div`
  width: 100%;
  background-color: ${props => props.theme.violet};
  border-radius: 0.4rem;
  margin-top: 0.4rem;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  span {
    text-align: center;
    color: ${props => props.theme.white};
    font-weight: 400;
    font-size: 1rem;
    margin: 0;
    padding: 0.5rem 1rem;
  }
`;

export const LoaderWrapper = styled.div`
  margin-top: 0.4rem;
`;

export const NFTimg = styled.img<{ imgLoading: boolean }>`
  border-radius: 0.8rem;
  display: ${props => (props.imgLoading ? 'none' : 'block')};
`;
