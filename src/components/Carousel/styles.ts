import styled from 'styled-components';

import {
  ArrowLeft as DefaultArrowLeft,
  ArrowRight as DefaultArrowRight,
} from '@/assets/carousel';

export const Container = styled.div`
  display: flex;

  position: relative;

  flex-direction: row;
`;

export const Content = styled.div`
  display: flex;

  overflow-x: auto;
  scroll-behavior: smooth !important;

  gap: 0.75rem;

  border-radius: 1rem;

  &&::-webkit-scrollbar {
    display: none;
  }
`;

export const ArrowRight = styled(DefaultArrowRight)`
  position: absolute;

  right: -1.5rem;
  bottom: 40%;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }
`;

export const ArrowLeft = styled(DefaultArrowLeft)`
  position: absolute;

  left: -1.5rem;
  bottom: 40%;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }
`;
