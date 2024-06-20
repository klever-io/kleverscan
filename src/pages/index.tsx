import { PropsWithChildren } from 'react';
import Home from '@/components/Home';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../../next-i18next.config';

const ExportedHome: React.FC<PropsWithChildren> = () => <Home />;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'blocks', 'transactions', 'home', 'wizards'],
    nextI18NextConfig,
    ['en'],
  );

  return { props };
};

export default ExportedHome;
