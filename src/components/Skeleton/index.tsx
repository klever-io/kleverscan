import { PropsWithChildren } from 'react';
import React from 'react';
import { Container, SkeletonLoader } from './styles';

interface ISkeleton {
  width?: number | string;
  height?: number | string;
  customStyles?: React.CSSProperties;
  containerCustomStyles?: React.CSSProperties;
}

const Skeleton: React.FC<PropsWithChildren<ISkeleton>> = ({
  width,
  height,
  customStyles,
  containerCustomStyles,
}) => {
  return (
    <Container
      width={width}
      height={height}
      data-testid="skeleton"
      style={containerCustomStyles}
    >
      <SkeletonLoader style={customStyles} />
    </Container>
  );
};

export default Skeleton;
