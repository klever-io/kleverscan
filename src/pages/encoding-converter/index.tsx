import { PropsWithChildren } from 'react';
import {
  FormEncodingConverter,
  FormPEMFileConverter,
  IPropsEncodingConverter,
} from '@/components/Form/EncodingConverter';
import Title from '@/components/Layout/Title';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
} from '@/styles/common';
import {
  addressToPublicKey,
  base64ToUtf8,
  hexToUtf8,
  publicKeyToAddress,
  utf8ToBase64,
  utf8ToHex,
} from '@/utils/formatFunctions';
import { Content } from '@/views/verify-signature/detail';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const EncodingConverter: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('encodingConverter');
  const cardHeaders = [
    'Base64 / UTF8',
    'Hex / UTF8',
    ` ${t('PublicKey')} / ${t('Address')}`,
    `${t('PEM File')}  / ${t('Address')} - ${t('PrivateKey')} `,
  ];
  const [selectedCard, setSelectedCard] = useState<string>(cardHeaders[0]);

  const SelectedComponent: React.FC<PropsWithChildren> = () => {
    const placeHolderUTF8 = `${t('PlaceHolderEncoded', {
      text: `${t('Text')}`,
      converter: `${t('UTF8')}`,
    })}`;
    switch (selectedCard) {
      case 'Base64 / UTF8':
        const base64Utf8Props: IPropsEncodingConverter = {
          titleTextArea: {
            encoding: 'UTF8',
            decoding: 'Base64',
          },
          placeHolder: {
            encoding: placeHolderUTF8,
            decoding: `${t('PlaceHolderEncoded', {
              text: `${t('Data')}`,
              converter: `${t('Base64')}`,
            })}`,
          },
          decoding: base64ToUtf8,
          encoded: utf8ToBase64,
        };
        return <FormEncodingConverter {...base64Utf8Props} />;
      case 'Hex / UTF8':
        const hexUtf8Props: IPropsEncodingConverter = {
          titleTextArea: {
            encoding: 'UTF8',
            decoding: 'Hex',
          },
          placeHolder: {
            encoding: placeHolderUTF8,
            decoding: `${t('PlaceHolderEncoded', {
              text: `${t('Values')}`,
              converter: `${t('hexadecimal')}`,
            })}`,
          },
          decoding: hexToUtf8,
          encoded: utf8ToHex,
        };
        return <FormEncodingConverter {...hexUtf8Props} />;
      case `${t('PEM File')}  / ${t('Address')} - ${t('PrivateKey')} `:
        return <FormPEMFileConverter />;
      case ` ${t('PublicKey')} / ${t('Address')}`:
        const publicKeyAddressPorps: IPropsEncodingConverter = {
          titleTextArea: {
            encoding: `${t('PublicKey')}`,
            decoding: `${t('Address')}`,
          },
          placeHolder: {
            encoding: `${t('PlaceHolderValues', {
              data: `${t('Values')}`,
              key: `${t('PublicKey')}`,
              type: `${t('PronomePossessivo.feminino')}`,
            })}`,
            decoding: `${t('PlaceHolderValues', {
              data: `${t('Values')}`,
              key: `${t('Address')}`,
              type: `${t('PronomePossessivo.masculino')}`,
            })}`,
          },
          encoded: publicKeyToAddress,
          decoding: addressToPublicKey,
        };
        return <FormEncodingConverter {...publicKeyAddressPorps} />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title title={t('Encoding Converter')} />
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

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['encodingConverter', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default EncodingConverter;
