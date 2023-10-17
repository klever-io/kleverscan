import { InlineLoaderWrapper } from './styles';

const InlineLoader: React.FC<{ height?: number }> = ({ height = 13 }) => (
  <InlineLoaderWrapper height={height}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </InlineLoaderWrapper>
);

export { InlineLoader };
