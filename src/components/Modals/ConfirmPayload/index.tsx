import { PropsWithChildren } from 'react';
import { buildTransaction } from '@/components/Contract/utils';
import ToggleInput from '@/components/Toggle';
import { useContract } from '@/contexts/contract';
import { useModal } from '@/contexts/contract/modals';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  ButtonContainer,
  ButtonsRow,
  Container,
  Content,
  ContentHeader,
} from '../styles';
import { DetailsRow, ErrorMessage, HiddenTextArea } from './styles';

const ConfirmPayload: React.FC<PropsWithChildren> = () => {
  const { payload, formSend, resetFormsData } = useContract();

  const { setShowPayloadOpen, showPayloadOpen } = useModal();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const syntaxHighlighterRef = useRef<HTMLPreElement>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(payload, null, '\t'),
  );

  useEffect(() => {
    if (payload) {
      setPayloadText(JSON.stringify(payload, null, '\t'));
    }
  }, [payload]);

  const handleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleValidate = async () => {
    try {
      JSON.parse(payloadText);
    } catch (e) {
      setIsValid(false);
      setError('Invalid JSON');
      return;
    }

    try {
      await buildTransaction(JSON.parse(payloadText));
    } catch (e) {
      setIsValid(false);
      setError(`Invalid Payload: ${String(e)}`);
      return;
    }

    setIsValid(true);
    setError('');
  };

  const handleConfirm = async () => {
    try {
      await formSend(JSON.parse(payloadText));
      setShowPayloadOpen(false);
    } catch (e) {
      setIsValid(false);
      setError(`Invalid Payload: ${String(e)}`);
      return;
    }
  };

  const handleButton = () => {
    if (!isValid) {
      handleValidate();
    }

    if (isValid) {
      handleConfirm();
    }
  };

  const closeModal = () => setShowPayloadOpen(false);

  const handleClose = () => {
    resetFormsData();
    closeModal();
  };

  const isDisabled = () => {
    return payload?.txCount || payload?.txsHashes !== undefined;
  };

  const handleKey = (e: any) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (textAreaRef.current) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        textAreaRef.current.value =
          textAreaRef.current.value.substring(0, start) +
          '\t' +
          textAreaRef.current.value.substring(end);

        setPayloadText(textAreaRef.current.value);

        if (typeof textAreaRef.current.selectionStart === 'number') {
          textAreaRef.current.selectionStart = start + 1;
        }
        if (typeof textAreaRef.current.selectionEnd === 'number') {
          textAreaRef.current.selectionEnd = end + 1;
        }
      }
    }
  };

  const PreWithRef = (preProps: any) => (
    <pre {...preProps} ref={syntaxHighlighterRef} />
  );

  return (
    <Container onMouseDown={handleClose} open={showPayloadOpen}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <ContentHeader>
          <h1>Transaction Payload:</h1>
          <ToggleInput
            inputProps={{ onChange: handleEdit }}
            active={isEditable}
            options={['View Payload', 'Edit Payload']}
          />
        </ContentHeader>
        <DetailsRow
          role="button"
          tabIndex={0}
          onKeyDown={() => textAreaRef.current?.focus()}
          onClick={() => textAreaRef.current?.focus()}
        >
          <SyntaxHighlighter
            customStyle={{
              backgroundColor: 'transparent',
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflow: 'hidden',
              tabSize: '1ch',
            }}
            style={dracula}
            language="json"
            PreTag={PreWithRef}
            wrapLongLines
          >
            {payloadText}
          </SyntaxHighlighter>

          {isEditable ? (
            <HiddenTextArea
              onKeyDown={handleKey}
              ref={textAreaRef}
              value={payloadText}
              onChange={e => {
                setIsValid(false);
                setError('');
                setPayloadText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              spellCheck={false}
            />
          ) : (
            <></>
          )}

          <ErrorMessage>{error}</ErrorMessage>
        </DetailsRow>

        <ButtonsRow>
          <ButtonContainer onClick={handleClose}> Close</ButtonContainer>
          {!isDisabled() && (
            <ButtonContainer
              onClick={() => handleButton()}
              disabled={isDisabled()}
            >
              {' '}
              {isValid ? 'Send' : 'Validate'}
            </ButtonContainer>
          )}
        </ButtonsRow>
      </Content>
    </Container>
  );
};
export default ConfirmPayload;
