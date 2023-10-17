const GradientSVG: React.FC = () => {
  const idCSS = 'gradient';
  const gradientTransform = `rotate(180)deg`;
  return (
    <svg style={{ height: '100%', width: '100%' }}>
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="36.29%" stopColor="#AA33B5" />
          <stop offset="98.56%" stopColor="#BBA5E1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientSVG;
