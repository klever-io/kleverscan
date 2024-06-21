import { PropsWithChildren } from 'react';
import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Container, Content } from './styles';

const Carousel: React.FC<PropsWithChildren> = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleLeft = () => {
    if (carouselRef.current !== null)
      carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth / 2;
  };

  const handleRight = () => {
    if (carouselRef.current !== null)
      carouselRef.current.scrollLeft += carouselRef.current.offsetWidth / 2;
  };

  return (
    <Container>
      <ArrowLeft onClick={handleLeft} />
      <Content ref={carouselRef}>{children}</Content>
      <ArrowRight onClick={handleRight} />
    </Container>
  );
};

export default Carousel;
