import { useContract } from '@/contexts/contract';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  ButtonContainer,
  ButtonsRow,
  Container,
  Content,
  DetailsRow,
} from './styles';

const ConfirmPayload: React.FC = () => {
  const { setOpenModal: setOpen, payload, formSend } = useContract();

  const handleConfirm = async () => {
    await formSend();
    setOpen(false);
  };

  const closeModal = () => setOpen(false);

  const handleClose = () => {
    closeModal();
  };

  const isDisabled = () => {
    return payload?.txCount || payload?.txsHashes !== undefined;
  };

  const handleGoBack = () => {
    closeModal();
  };

  return (
    <Container onMouseDown={handleClose}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <h1>Transaction Payload:</h1>
        <DetailsRow>
          <SyntaxHighlighter
            customStyle={{ height: '30rem', backgroundColor: 'transparent' }}
            style={dracula}
            language="json"
            wrapLines={true}
            wrapLongLines={true}
          >
            {JSON.stringify(payload, null, 2)}
          </SyntaxHighlighter>
        </DetailsRow>
        <ButtonsRow>
          <ButtonContainer onClick={handleClose}> Close</ButtonContainer>
          {!isDisabled() && (
            <ButtonContainer
              onClick={() => handleConfirm()}
              disabled={isDisabled()}
            >
              {' '}
              Send
            </ButtonContainer>
          )}
        </ButtonsRow>
      </Content>
    </Container>
  );
};
export default ConfirmPayload;
