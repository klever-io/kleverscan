import { useTheme } from '@/contexts/theme';
import Language from './Language';
import {
  Container,
  IconContainer,
  MoonIcon,
  SelectedMode,
  SunIcon,
} from './styles';

interface IOptionsContainer {
  isConnected?: boolean;
}

const OptionsContainer: React.FC<IOptionsContainer> = ({
  isConnected = null,
}) => {
  const theme = useTheme();

  return (
    <Container isConnected={isConnected}>
      <Language />
      <IconContainer onClick={() => theme.toggleDarkTheme()}>
        <SelectedMode />
        <SunIcon />
        <MoonIcon />
      </IconContainer>
    </Container>
  );
};

export default OptionsContainer;
