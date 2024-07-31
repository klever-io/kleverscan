import { PropsWithChildren } from 'react';
import { useTheme } from '@/contexts/theme';
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

const OptionsContainer: React.FC<PropsWithChildren<IOptionsContainer>> = ({
  isConnected = null,
}) => {
  const theme = useTheme();

  return (
    <Container isConnected={isConnected}>
      {/* <Language /> */}
      <IconContainer onClick={() => theme.toggleDarkTheme()}>
        <SelectedMode />
        <SunIcon />
        <MoonIcon />
      </IconContainer>
    </Container>
  );
};

export default OptionsContainer;
