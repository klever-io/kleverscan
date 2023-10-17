import React from 'react';
import { CarouselItem, SliderContainer } from './styles';

interface CarouselSliderProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselSliderProps> = ({ children }) => {
  return (
    <div>
      <SliderContainer>
        {React.Children.map(children, (child, index) => (
          <CarouselItem key={index}>{child}</CarouselItem>
        ))}
      </SliderContainer>
    </div>
  );
};
