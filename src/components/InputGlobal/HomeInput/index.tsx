import { PropsWithChildren } from 'react';
import { useTranslation } from 'next-i18next';
import Input from '..';
import { Container } from './styles';

export const HomeInput: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('home');
  return (
    <Container>
      <Input />
    </Container>
  );
};
