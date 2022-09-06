import { useTheme } from 'contexts/theme';
import Language from './Language';
import { Container, IconContainer, MoonIcon, SunIcon } from './styles';

const OptionsContainer: React.FC = () => {
  const theme = useTheme();

  return (
    <Container>
      <Language />
      <IconContainer onClick={() => theme.toggleDarkTheme()}>
        {theme.isDarkTheme ? <MoonIcon /> : <SunIcon />}
      </IconContainer>
    </Container>
  );
};

export default OptionsContainer;
