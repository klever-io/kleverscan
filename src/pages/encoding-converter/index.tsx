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
import { useState } from 'react';

const EncodingConverter: React.FC = () => {
  const cardHeaders = [
    'Base64 / UTF8',
    'Hex / UTF8',
    'PublicKey / Address',
    'PEM File / Address - PrivateKey',
  ];
  const [selectedCard, setSelectedCard] = useState<string>(cardHeaders[0]);

  const SelectedComponent: React.FC = () => {
    const placeHolderUTF8 = 'Enter your UTF-8 encoded text here...';
    switch (selectedCard) {
      case 'Base64 / UTF8':
        const base64Utf8Props: IPropsEncodingConverter = {
          titleTextArea: {
            encoding: 'UTF8',
            decoding: 'Base64',
          },
          placeHolder: {
            encoding: placeHolderUTF8,
            decoding: 'Enter your Base64-encoded data here...',
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
            decoding: 'Enter your hexadecimal values here...',
          },
          decoding: hexToUtf8,
          encoded: utf8ToHex,
        };
        return <FormEncodingConverter {...hexUtf8Props} />;
      case 'PEM File / Address - PrivateKey':
        return <FormPEMFileConverter />;
      case 'PublicKey / Address':
        const publicKeyAddressPorps: IPropsEncodingConverter = {
          titleTextArea: {
            encoding: 'PublicKey',
            decoding: 'Address',
          },
          placeHolder: {
            encoding: 'Enter your publicKey values here...',
            decoding: 'Enter your address values here...',
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
        <Title title="Encoding Converter" />
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

export default EncodingConverter;
