import React from 'react';
import { Container, SkeletonLoader } from './styles';

interface ISkeleton {
  width?: number | string;
  height?: number | string;
}

const Skeleton: React.FC<ISkeleton> = ({ width, height }) => {
  return (
    <Container width={width} height={height} data-testid="skeleton">
      <SkeletonLoader />
    </Container>
  );
};

export default Skeleton;
