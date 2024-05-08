import { Validators as Icon } from '@/assets/cards';
import FormVerifySignature from '@/components/Form/FormVerifySignature';
import Title from '@/components/Layout/Title';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
} from '@/styles/common';
import { Content } from '@/views/verify-signature/detail';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const VerifySignature: React.FC = () => {
  const { t } = useTranslation('verify');
  const cardHeaders = [`${t('Verify')} ${t('Signature')}`];
  const [selectedCard, setSelectedCard] = useState<string>(cardHeaders[0]);

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case `${t('Verify')} ${t('Signature')}`:
        return <FormVerifySignature />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title title={t('Verify')} Icon={Icon} />
      </Header>
      <Content>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => setSelectedCard(header)}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>
        <CardContent>
          <SelectedComponent />
        </CardContent>
      </Content>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['verify'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default VerifySignature;
