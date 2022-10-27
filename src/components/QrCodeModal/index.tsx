import { QRCodeSVG } from 'qrcode.react';
import {
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalXButton,
} from './styles';

interface IQrCodeModal {
  value: string;
  show: boolean;
  setShowModal: React.SetStateAction<any>;
  onClose: React.SetStateAction<any>;
}

const QrCodeModal: React.FC<IQrCodeModal> = ({
  value,
  show,
  setShowModal,
  onClose,
}) => {
  return show ? (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalXButton onClick={setShowModal}>x</ModalXButton>
        </ModalHeader>
        <ModalBody>
          <div>
            <QRCodeSVG value={value}></QRCodeSVG>
          </div>
        </ModalBody>
        <ModalHeader>
          <ModalXButton></ModalXButton>
        </ModalHeader>
      </ModalContainer>
    </ModalBackdrop>
  ) : (
    <></>
  );
};

export default QrCodeModal;
