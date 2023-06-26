import { Accounts as Icon } from '@/assets/title-icons';
import { HashComponent } from '@/components/Contract';
import Title from '@/components/Layout/Title';
import { Loader } from '@/components/Loader/styles';
import Tooltip from '@/components/Tooltip';
import { useExtension } from '@/contexts/extension';
import { useTheme } from '@/contexts/theme';
import { Header } from '@/styles/common';
import theme from '@/styles/theme';
import { Service } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import {
  ButtonContainer,
  Container,
  Content,
  ContentBody,
  ContentContainer,
  ContentContainerHeader,
  ContentTitle,
  DragContainer,
  InputFile,
  LeftContentContainer,
  LoaderContainer,
  ReloadIcon,
  RightContentContainer,
  TextAreaJson,
  TitleH3,
} from '@/views/multisign/index';
import { placeholder } from '@/views/multisign/placeholder';
import { ITransaction, web } from '@klever/sdk';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  brownPaper,
  dracula,
} from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { toast } from 'react-toastify';
import api from 'services/api';

const Multisign: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingDecoded, setLoadingDecoded] = useState(false);
  const [isBroadcasted, setIsBroadcasted] = useState(false) as any;
  const [contractFile, setContractFile] = useState('') as any;
  const [isDragging, setDragging] = useState(false);
  const [draggingOverlayCount, setDragginOverlayCount] = useState(0);
  const [decoded, setDecoded] = useState('');
  const [animate, setAnimate] = useState(false);
  const { isDarkTheme } = useTheme();
  const { extensionInstalled, connectExtension } = useExtension();

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const customStyle = {
    background: isDarkTheme ? theme.text.twilight : theme.true.white,
  };

  const addNewSignatures = (signedTx: ITransaction): ITransaction => {
    const JSONContractFile = JSON.parse(contractFile);
    if (JSONContractFile?.Signature?.[0]) {
      JSONContractFile?.Signature.push(signedTx?.Signature[0]);
      return JSONContractFile;
    }
    return signedTx;
  };

  const readFile = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = /[^.]+$/.exec(file.name)![0];

      if (fileExtension !== 'json') {
        toast.error('Invalid file format.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        let result = e.target?.result;
        if (typeof result !== 'string') {
          result = '';
        }
        setLoading(true);
        const validation = validateJson(result);
        if (!validation) {
          toast.error('Json with wrong data.');
          setLoading(false);
        } else {
          setContractFile(JSON.stringify(JSON.parse(result), null, 2));
          handleDecodeRequest(result);
          setLoading(false);
        }
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

  const validateJson = (jsonFile: string) => {
    if (typeof jsonFile !== 'string') {
      return false;
    }
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonFile);
    } catch (error) {
      toast.error('Cannot parse Json.');
    }
    const sender = parsedJson?.RawData?.Sender;
    const contract = parsedJson?.RawData?.Contract;
    if (!sender || !contract || contract.length === 0 || contract[0] === null) {
      return false;
    }
    return true;
  };

  const handleSign = async () => {
    try {
      const signedTx = await web.signTransaction(JSON.parse(contractFile));
      const allSignedContractFile = addNewSignatures(signedTx);
      setContractFile(JSON.stringify(allSignedContractFile));
      toast.success('Signature successfully added to contract!');
    } catch (error) {
      toast.error('Error while signing, please try again.');
    }
  };

  const handleDecode = () => {
    try {
      JSON.parse(JSON.stringify(contractFile));
      return true;
    } catch (e) {
      toast.error('Cannot decode, wrong input Json format.');

      return false;
    }
  };

  const handleDecodeRequest = async (value: string) => {
    try {
      setLoadingDecoded(true);
      const res = await api.post({
        route: 'transaction/decode',
        body: JSON.parse(value),
        service: Service.NODE,
      });
      if (!res.error) {
        setContractFile(value);
        setDecoded(res.data.tx);
        setLoadingDecoded(false);
        toast.success('Decode successful!');
      }
    } catch (e) {
      setLoadingDecoded(false);
      setDecoded('');
      toast.error('Error while decoding, please try again.', {
        toastId: 'forbid duplicating',
      });
    }
  };

  const handleChange = async ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (value === '') {
      setContractFile(value);
      setDecoded('');
    } else {
      const canDecode = handleDecode();
      setContractFile(value);
      if (canDecode) {
        await handleDecodeRequest(value);
      } else {
        setDecoded('');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = 'file';
      const preJson = JSON.parse(contractFile);
      const json = JSON.stringify(preJson);
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Error while downloading, check the content of your json.');
    }
  };

  const handleBroadcast = async () => {
    const { Signature } = JSON.parse(contractFile);
    if (Signature.length === 0) {
      toast.error('The contract must have at least one signature.');
    } else {
      try {
        const res = await web.broadcastTransactions([JSON.parse(contractFile)]);
        setIsBroadcasted(res?.data?.txsHashes[0]);
      } catch (e) {
        toast.error('Error on Broadcast');
      }
    }
  };

  const renderButtons = () => {
    return (
      <ButtonContainer>
        <button onClick={() => handleSign()}>Sign</button>
        <button onClick={() => handleBroadcast()}>Broadcast</button>
        <button onClick={() => handleDownload()}>Download</button>
      </ButtonContainer>
    );
  };

  const renderTextArea = () => {
    if (contractFile && decoded) {
      try {
        return JSON.stringify(JSON.parse(contractFile), null, 2);
      } catch (e) {
        setDecoded('');
        return contractFile;
      }
    }
    if (!contractFile && !decoded) {
      return '';
    }
    if (contractFile && !decoded) {
      return contractFile;
    }
  };

  const reload = () => {
    setLoading(false);
    setLoadingDecoded(false);
    setIsBroadcasted(false);
    setContractFile('');
    setDragging(false);
    setDragginOverlayCount(0);
    setDecoded('');
  };

  const handleClick = () => {
    setAnimate(true);
    reload();
    setTimeout(() => {
      setAnimate(false);
    }, 400);
  };

  return (
    <DragContainer
      onDragOver={preventEvent}
      onDrop={(event: any) => processFile(event, true)}
      onChange={(event: any) => processFile(event, false)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <Container>
        <Header>
          <Title title="Multisign Interface" Icon={Icon} />
        </Header>
        {isBroadcasted && (
          <HashComponent hash={isBroadcasted} setHash={setIsBroadcasted} />
        )}
        <Content loading={loading}>
          {!loading && (
            <>
              <ContentBody>
                <ContentContainer>
                  <LeftContentContainer>
                    <ContentTitle>
                      <h3>Insert file to multisign</h3>
                      <h3
                        style={{ fontWeight: '200', fontSize: 'medium' }}
                      >{`( Json file )`}</h3>
                      <Tooltip
                        msg="Reset data"
                        customStyles={{ delayShow: 800 }}
                        Component={() => (
                          <ReloadIcon onClick={handleClick} animate={animate} />
                        )}
                      ></Tooltip>
                    </ContentTitle>
                    <>
                      <InputFile isDragging={isDragging}>
                        {
                          <>
                            {typeof window !== 'undefined' &&
                            window.matchMedia('(max-device-width: 768px)')
                              .matches ? (
                              <>
                                <input id="input" type="file" accept=".json" />
                                <label htmlFor="input">Select file</label>
                              </>
                            ) : (
                              <>
                                <input id="input" type="file" accept=".json" />
                                <span>
                                  Drag and drop your file here,{' '}
                                  <label htmlFor="input">select file</label>
                                </span>
                              </>
                            )}
                          </>
                        }
                      </InputFile>

                      <TitleH3>Or write content down here</TitleH3>
                    </>
                    <TextAreaJson
                      value={renderTextArea()}
                      onChange={(e: any) => {
                        handleChange(e);
                      }}
                      placeholder={placeholder}
                      spellCheck="false"
                    ></TextAreaJson>
                  </LeftContentContainer>

                  <RightContentContainer>
                    <ContentContainerHeader>
                      {renderButtons()}
                      <h3>Decoded</h3>
                    </ContentContainerHeader>
                    {!loadingDecoded ? (
                      <SyntaxHighlighter
                        style={isDarkTheme ? dracula : brownPaper}
                        customStyle={{ ...customStyle }}
                        language="json"
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {decoded ? JSON.stringify(decoded, null, 2) : ''}
                      </SyntaxHighlighter>
                    ) : (
                      <LoaderContainer>
                        <Loader height={100} width={100} />
                      </LoaderContainer>
                    )}
                  </RightContentContainer>
                </ContentContainer>
              </ContentBody>
            </>
          )}
          {loading && <Loader height={200} width={200} />}
        </Content>
      </Container>
    </DragContainer>
  );
};

export default Multisign;
