import { DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';

export const PackContainer = styled.div`
  ${DefaultCardStyles}
  width: 100%;
  padding: 1rem 1.8rem;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  span {
    color: white;
  }
`;

export const KeyLabel = styled.span`
  font-size: 1.5rem;
  user-select: text;
`;

export const ChooseAsset = styled.div`
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    user-select: none;
    color: ${props => props.theme.black};
    opacity: 0.3;
    font-size: large;
  }
`;

export const ItemsContainer = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-gap: 1rem;
`;
export const ITOTitle = styled.div`
  color: ${props => props.theme.black};
  width: fit-content;
  border-radius: 4px;
  span {
    font-weight: bolder;
    font-size: 2rem;
    user-select: text;
  }
`;
