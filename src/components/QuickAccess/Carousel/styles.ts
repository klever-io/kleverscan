import styled from 'styled-components';
export const CarouselItem = styled.div``;

export const SliderContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  mask-image: linear-gradient(to right, black 90%, transparent);
  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
    height: 0.35rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 0.75rem;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.violet};
    }
  }
`;
