import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { VerifySignatureContainer } from '../FormVerifySignature/styles';
import {
  Button,
  ContainerButtons,
  ContainerItem,
  ContentButton,
  EncodingTextArea,
  FormEncodingContainer,
} from './styles';

interface IFormInputs {
  encoding: string;
  decoding: string;
}

export interface IPropsEncodingConverter {
  titleTextArea: {
    encoding: string;
    decoding: string;
  };
  placeHolder: {
    encoding: string;
    decoding: string;
  };
  encoded: (encoded: string) => string;
  decoding: (decoding: string) => string;
}

const FormEncodingConverter: React.FC<
  PropsWithChildren<IPropsEncodingConverter>
> = ({ titleTextArea, encoded, decoding, placeHolder }) => {
  const [formValues, setFormValues] = useState<IFormInputs>({
    encoding: '',
    decoding: '',
  });
  const { t } = useTranslation('encodingConverter');
  const [selectedTextArea, setSelectedTextArea] = useState('');

  const handleChangeValues = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setFormValues(current => {
      return {
        ...current,
        [fieldName]: fieldValue,
      };
    });
  };

  const resetForm = () => {
    setFormValues({
      decoding: '',
      encoding: '',
    });
  };

  const onClickDecoding = () => {
    const decodedString = decoding(formValues.decoding);
    setFormValues(current => {
      return {
        ...current,
        encoding: decodedString,
      };
    });
    setSelectedTextArea('Decoding');
  };

  const onClickEncode = () => {
    const encodedString = encoded(formValues.encoding);
    setFormValues(current => {
      return {
        ...current,
        decoding: encodedString,
      };
    });
    setSelectedTextArea('Encoding');
  };
  const handleClick = (name: string) => {
    setSelectedTextArea(name);
  };

  return (
    <VerifySignatureContainer>
      <FormEncodingContainer>
        <ContainerItem>
          <span>{titleTextArea.decoding}</span>
          <EncodingTextArea
            placeholder={placeHolder.decoding}
            name="decoding"
            value={formValues.decoding}
            onChange={handleChangeValues}
            onClick={() => handleClick('Decoding')}
          />
        </ContainerItem>
        <ContainerButtons>
          <ContentButton
            onClick={onClickEncode}
            selected={selectedTextArea === 'Encoding'}
          >
            <BsArrowLeft />
            <Button type="button" value={t('Encode')} />
          </ContentButton>
          <ContentButton
            onClick={onClickDecoding}
            selected={selectedTextArea === 'Decoding'}
          >
            <Button type="button" value={t('Decode')} />
            <BsArrowRight />
          </ContentButton>
          <ContentButton onClick={resetForm}>
            <Button type="button" value={t('Reset')} />
          </ContentButton>
        </ContainerButtons>

        <ContainerItem>
          <span>{titleTextArea.encoding}</span>
          <EncodingTextArea
            placeholder={placeHolder.encoding}
            name="encoding"
            value={formValues.encoding}
            onChange={handleChangeValues}
            onClick={() => handleClick('Encoding')}
          />
        </ContainerItem>
      </FormEncodingContainer>
    </VerifySignatureContainer>
  );
};

export { FormEncodingConverter };
