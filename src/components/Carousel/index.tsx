import React, { useRef } from 'react';

import { ArrowLeft, ArrowRight, Container, Content } from './styles';

const Carousel: React.FC = ({ children }) => {
  const carouselRef = useRef<any>(null);

  const handleLeft = () => {
    carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth / 2;
  };

  const handleRight = () => {
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
