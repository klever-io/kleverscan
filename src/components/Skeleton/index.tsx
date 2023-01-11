import React from 'react';
import { Container, SkeletonLoader } from './styles';

interface ISkeleton {
  width?: number | string;
  height?: number | string;
}

const Skeleton: React.FC<ISkeleton> = props => {
  const width = props.width !== undefined ? props.width : 120;
  const height = props.height !== undefined ? props.height : 25;

  return (
    <Container style={{ width, height }} data-testid="skeleton">
      <SkeletonLoader />
    </Container>
  );
};

export default Skeleton;
