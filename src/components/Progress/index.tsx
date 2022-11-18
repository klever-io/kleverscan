import { useTheme } from '@/contexts/theme';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
  ProgressPercentage,
} from '@/views/validators';

const Progress: React.FC<{ percent: number }> = ({ percent }) => {
  const { theme } = useTheme();
  return (
    <ProgressContainer>
      <ProgressContent>
        <ProgressIndicator percent={percent} />
      </ProgressContent>
      <ProgressPercentage textColor={theme.black}>
        {percent?.toFixed(2)}%
      </ProgressPercentage>
    </ProgressContainer>
  );
};

export default Progress;
