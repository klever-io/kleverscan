import { useTheme } from 'contexts/theme';
import { toast } from 'react-toastify';
import { Container, IconContainer, MoonIcon, SunIcon } from './styles';

const OptionsContainer: React.FC = () => {
  const theme = useTheme();

  const handleLanguage = () => {
    toast.info('Not implemented yet');
  };

  return (
    <Container>
      {/* <LanguageContainer onClick={handleLanguage}>EN</LanguageContainer> */}
      <IconContainer onClick={() => theme.toggleDarkTheme()}>
        {theme.isDarkTheme ? <MoonIcon /> : <SunIcon />}
      </IconContainer>
    </Container>
  );
};

export default OptionsContainer;
