import { useTheme } from '@/contexts/theme';
import Language from './Language';
import { Container, IconContainer, MoonIcon, SunIcon } from './styles';

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
        {theme.isDarkTheme ? <MoonIcon /> : <SunIcon />}
      </IconContainer>
    </Container>
  );
};

export default OptionsContainer;
