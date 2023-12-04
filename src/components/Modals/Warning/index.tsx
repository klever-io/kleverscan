import { WarningIcon } from '@/assets/calendar';
import { useContract } from '@/contexts/contract';
import { useModal } from '@/contexts/contract/modals';
import {
  ButtonContainer,
  ButtonsRow,
  Container,
  Content,
  MessageContent,
} from '../styles';

interface IModal {
  message: string;
}

const WarningModal: React.FC<IModal> = ({ message }) => {
  const { formSend, ignoreCheckAmount, resetFormsData } = useContract();

  const { setWarningOpen, warningOpen } = useModal();

  const handleConfirm = async () => {
    ignoreCheckAmount.current = true;
    await formSend();
    setWarningOpen(false);
  };

  const closeModal = () => setWarningOpen(false);

  const handleClose = () => {
    resetFormsData();
    closeModal();
  };

  return (
    <Container onMouseDown={handleClose} open={warningOpen}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <MessageContent>
          <WarningIcon />
          {message}
        </MessageContent>
        <ButtonsRow>
          <ButtonContainer onClick={handleClose}> Go Back</ButtonContainer>
          <ButtonContainer onClick={handleConfirm}>
            {' '}
            Continue Anyway
          </ButtonContainer>
        </ButtonsRow>
      </Content>
    </Container>
  );
};
export default WarningModal;
