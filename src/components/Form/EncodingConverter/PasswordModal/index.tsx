import {
  ButtonsRow,
  Container,
  ContainerButton,
  Content,
  Input,
} from './styles';

interface IPasswordModalProps {
  password: string;
  setPassword: (e: any) => void;
  closeModal: () => void;
  handleConfirm: (e: any) => void;
  handleBack?: () => void;
  BackButtonLabel?: string;
  singleButton?: boolean;
}
export interface IButton {
  onClick?(arg?: any): void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({ onClick, type, children, disabled }) => {
  return (
    <ContainerButton onClick={onClick} type={type} disabled={disabled}>
      {children}
    </ContainerButton>
  );
};

const PasswordModal: React.FC<IPasswordModalProps> = ({
  password,
  setPassword,
  closeModal,
  handleConfirm,
  handleBack,
  BackButtonLabel = 'Back',
}) => {
  const handleClose = () => {
    closeModal();
  };

  const handleGoBack = () => {
    closeModal();
  };

  return (
    <Container onMouseDown={handleClose}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <h4>Your Pem file is encrypted, insert your password please.</h4>
        <Input
          title="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <ButtonsRow>
          {
            <Button onClick={handleBack ? handleBack : handleGoBack}>
              {BackButtonLabel}
            </Button>
          }
          {
            <Button onClick={(pemFile: string) => handleConfirm(pemFile)}>
              Confirm
            </Button>
          }
        </ButtonsRow>
      </Content>
    </Container>
  );
};
export default PasswordModal;
