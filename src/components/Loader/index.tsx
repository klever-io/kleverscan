import { PropsWithChildren } from 'react';
import { InlineLoaderWrapper } from './styles';

const InlineLoader: React.FC<
  PropsWithChildren<{ height?: number; color?: string }>
> = ({ height = 13, color = '#515395' }) => (
  <InlineLoaderWrapper height={height} color={color}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </InlineLoaderWrapper>
);

export { InlineLoader };
