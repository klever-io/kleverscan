import { useTranslation } from 'next-i18next';
import Input from '..';
import { Container, Title } from './styles';

export const HomeInput: React.FC = () => {
  const { t } = useTranslation('home');
  return (
    <Container>
      <Title>{t('KleverChain Search')}</Title>
      <Input />
    </Container>
  );
};
