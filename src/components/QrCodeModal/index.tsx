import { PropsWithChildren } from 'react';
import { Receive } from '@/assets/icons';
import { useScroll } from '@/utils/hooks';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';
import {
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalHeader,
} from './styles';

interface IQrCodeModal {
  value: string;
  isOverflow: boolean;
}

const QrCodeModal: React.FC<PropsWithChildren<IQrCodeModal>> = ({
  value,
  isOverflow,
}) => {
  const [showModal, setShowModal] = useState(false);
  useScroll(showModal, () => setShowModal(false));

  return (
    <>
      <Receive onClick={() => setShowModal(!showModal)} />
      {showModal && (
        <>
          <ModalBackdrop onClick={() => setShowModal(false)} />
          <ModalContainer isOverflow={isOverflow}>
            <ModalHeader>
              <strong>
                <div></div>
                <MdClear onClick={() => setShowModal(false)} />
              </strong>
            </ModalHeader>
            <ModalBody>
              <div>
                <QRCodeSVG value={value} />
              </div>
            </ModalBody>
          </ModalContainer>
        </>
      )}
    </>
  );
};

export default QrCodeModal;
