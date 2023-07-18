import Home from '@/components/Home';
import LegacyHome from '@/components/LegacyHome/Home';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../../next-i18next.config';

const ExportedHome: React.FC = () =>
  process.env.DEFAULT_API_HOST?.includes('devnet') ? <Home /> : <LegacyHome />;

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'blocks', 'transactions'],
    nextI18NextConfig,
  );

  return { props };
};

export default ExportedHome;
