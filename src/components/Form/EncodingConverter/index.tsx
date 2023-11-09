import { useDidUpdateEffect } from '@/utils/hooks';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { VerifySignatureContainer } from '../FormVerifySignature/styles';
import PasswordModal from './PasswordModal';
import {
  Button,
  ContainerButtons,
  ContainerItem,
  ContentButton,
  EncodingTextArea,
  FormEncodingContainer,
  Input,
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

const FormEncodingConverter: React.FC<IPropsEncodingConverter> = ({
  titleTextArea,
  encoded,
  decoding,
  placeHolder,
}) => {
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

const FormPEMFileConverter: React.FC = () => {
  const [pemFile, setPemFile] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [draggingOverlayCount, setDragginOverlayCount] = useState(0);
  const { t } = useTranslation('encodingConverter');
  const checkIsEncrypted = () => {
    if (pemFile.includes('ENCRYPTED')) {
      return true;
    }
    return false;
  };

  const decodePrivateKey = (longPrivateKey: string, file: string): string => {
    let pk: string;

    if (checkIsEncrypted()) {
      pk = window.kleverWeb.decodePEM(file, password);
    } else {
      const decodedToBase64 = Buffer.from(longPrivateKey, 'base64');
      const decodedToHex = Buffer.from(decodedToBase64.toString(), 'hex');
      const privateKey = Array.from(decodedToHex.slice(0, 32));

      pk = privateKey.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    return pk;
  };

  const finalValidation = async (wallet: string, pk: string) => {
    if (wallet === '') {
      toast.error('Invalid Wallet Address.');
      resetData();
      return;
    }

    if (pk === '') {
      toast.error('Invalid Private Key.');
      resetData();
      return;
    }

    if (!wallet.includes('klv')) {
      toast.error('Invalid Wallet Address.');
      resetData();
      return;
    }
    let signature;
    try {
      signature = await window.kleverWeb.signTx(
        JSON.stringify({
          tx: {} as any,
          privateKey: pk,
        }),
      );
    } catch (error) {
      toast.error('Invalid Private Key and Password combination.');
      resetData();
      return;
    }

    if (signature.signature === '') {
      toast.error('Invalid Private Key and Password combination.');
      resetData();
      return;
    }

    setPemFile(pk);
  };
  const setUserConfigs = () => {
    const user = validatePemFile();
    if (user) {
      const decodedPk = decodePrivateKey(user.privateKey, pemFile);
      finalValidation(user.walletAddress, decodedPk);
    }
  };

  const parserPemFile = (file: string) => {
    const splitter = '-----';
    const maxSplitSize = 5;

    if (!file.includes(splitter)) {
      return '';
    }

    const contents = file.split(splitter);
    if (contents.length !== maxSplitSize) {
      return '';
    }

    return contents;
  };
  const validatePemFile = () => {
    const contents = parserPemFile(pemFile);
    if (contents === '') {
      resetData();
      toast.error('PEM File Encrypted.');
      return false;
    }

    const validatedPrivateKey = getPrivateKey(contents);
    if (validatedPrivateKey === '') {
      toast.error('Invalid Private Key.');
      resetData();
      return false;
    }

    const validatedWalletAddress = getWalletAddress(contents);
    if (validatedWalletAddress === '') {
      toast.error('Invalid Wallet Address.');
      resetData();
      return false;
    }
    return {
      walletAddress: validatedWalletAddress,
      privateKey: validatedPrivateKey,
    };
  };

  const getPrivateKey = (contents: string | string[]) => {
    const privateKeyPosition = 2;

    if (contents === '') {
      return '';
    }

    return contents[privateKeyPosition];
  };

  const getWalletAddress = (contents: string | string[]) => {
    const splitter = 'for ';
    const walletAddressPosition = 1;

    if (contents === '') {
      return '';
    }

    const parsed = contents[walletAddressPosition];
    const walletAddress = parsed.split(splitter)[walletAddressPosition];

    return walletAddress;
  };

  const readFile = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = /[^.]+$/.exec(file.name)?.[0];

      if (fileExtension !== 'pem') {
        toast.error('Invalid file format.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        let result = e.target?.result;
        if (typeof result !== 'string') {
          result = '';
        }
        setPemFile(result);
      };

      reader.readAsText(file);
    }
  };

  const preventEvent = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const processFile = (event: any, isDrop: boolean) => {
    preventEvent(event);
    const files = isDrop ? event.dataTransfer.files : event.target.files;
    readFile(files);
    event.target.value = ''; // allows to send same file again if user typed incorrect password
  };

  const resetData = () => {
    setPemFile('');
    setPassword('');
    setOpen(false);
  };

  useDidUpdateEffect(() => {
    const encrypt = checkIsEncrypted();
    if (pemFile && !encrypt) {
    } else if (pemFile && encrypt) {
      setPemFile('PEM File Encrypted.');
    }
  }, [pemFile]);

  const removePEMHeaders = (): string => {
    if (pemFile) {
      const objPemFile = validatePemFile();
      if (objPemFile) {
        const walletAddress = objPemFile.walletAddress;
        const privateKey = objPemFile.privateKey;
        const privateKeyPem = Buffer.from(privateKey, 'base64')
          .toString('utf-8')
          .slice(0, 64);
        return `
Address: ${walletAddress}
PrivateKey: ${privateKeyPem}
        `;
      }
    }
    return '';
  };

  const handleDragEnter = (event: any) => {
    preventEvent(event);

    let count = draggingOverlayCount;
    count++;

    setDragginOverlayCount(count);
    setDragging(true);
  };

  const handleDragLeave = (event: any) => {
    preventEvent(event);

    let count = draggingOverlayCount;
    count--;

    setDragginOverlayCount(count);

    if (count === 0) {
      setDragging(false);
    }
  };

  return (
    <VerifySignatureContainer>
      <FormEncodingContainer>
        <ContainerItem>
          <span>{t('PEM File')}</span>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={preventEvent}
            onDrop={(event: any) => processFile(event, true)}
            onChange={(event: any) => processFile(event, false)}
          >
            <Input isDragging={isDragging}>
              {
                <>
                  <input id="input" type="file" accept=".pem" />
                  <span>
                    {t('PEM File Placeholder')},{' '}
                    <label htmlFor="input">{t('Select File')}</label>
                  </span>
                </>
              }
            </Input>
          </div>
          {open && (
            <PasswordModal
              password={password}
              setPassword={setPassword}
              handleConfirm={setUserConfigs}
              closeModal={resetData}
              handleBack={resetData}
            ></PasswordModal>
          )}
        </ContainerItem>
        <ContainerButtons>
          <ContentButton>
            <Button type="button" />
            <BsArrowRight />
          </ContentButton>
        </ContainerButtons>
        <ContainerItem>
          <span>{`${t('Address')}/${t('PrivateKey')}`}</span>
          <EncodingTextArea
            name="data"
            value={removePEMHeaders() || ''}
            readOnly
          />
        </ContainerItem>
      </FormEncodingContainer>
    </VerifySignatureContainer>
  );
};

export { FormEncodingConverter, FormPEMFileConverter };
