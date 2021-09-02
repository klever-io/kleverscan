import React from 'react';

import { Container } from './styles';

interface ISkeleton {
  width?: number;
  height?: number;
}

const Skeleton: React.FC<ISkeleton> = props => {
  const width = props.width !== undefined ? props.width : 120;
  const height = props.height !== undefined ? props.height : 25;

  return (
    <div style={{ width, height }}>
      <Container />
    </div>
  );
};

export default Skeleton;
