import { PropsWithChildren } from 'react';
const GradientSVG: React.FC<PropsWithChildren> = () => {
  const idCSS = 'gradient';
  return (
    <svg style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <defs>
        <linearGradient id={idCSS} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="20%" stopColor="#AA33B5" />
          <stop offset="120%" stopColor="#BBA5E1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientSVG;
