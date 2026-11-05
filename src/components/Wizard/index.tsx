import { PropsWithChildren, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import CreateAssetWizard from './createAsset';
import { CloseModal, WizardContainer, WizardModal } from './createAsset/styles';

const Wizard: React.FC<PropsWithChildren<any>> = ({ isOpen, closeModal }) => {
  const [txHash, setTxHash] = useState('');

  const createWizProps = {
    isOpen,
    txHash,
    setTxHash,
  };

  return (
    <WizardModal openModal={isOpen}>
      <WizardContainer>
        <div>
          <CreateAssetWizard {...createWizProps} />
        </div>
        <CloseModal
          onClick={() => {
            closeModal(null);
          }}
        >
          <AiOutlineClose size={'1.66rem'} />
        </CloseModal>
      </WizardContainer>
    </WizardModal>
  );
};

export default Wizard;
