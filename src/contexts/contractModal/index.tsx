import ModalContract, {
  IModalContract,
} from '@/components/Contract/ModalContract';
import { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ButtonModal } from './styles';

interface IContractModal {
  getInteractionsButtons: (
    params: IUseInteractionButton[],
    isLeftAligned?: boolean,
  ) => React.FC[];
}

export interface IUseInteractionButton {
  title: string;
  contractType: string;
  defaultValues?: any;
}

export const ContractModal = createContext({} as IContractModal);

export const ContractModalProvider: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<IModalContract>({
    title: '',
    contractType: 'TransferContract',
    setOpenModal,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInteractionsButtons = (
    params: IUseInteractionButton[],
    isLeftAligned?: boolean,
  ): React.FC[] => {
    const buttons: React.FC[] = [];

    for (const param of params) {
      const interactionButton: React.FC = ({ children }) => {
        const { title, contractType, defaultValues } = param;

        const modalOptions: IModalContract = {
          contractType,
          setOpenModal,
          defaultValues,
          title,
        };

        const handleClick = () => {
          setOpenModal(() => (contractType === '--' ? false : true));
          setModalOptions(() => modalOptions);
        };

        return (
          <ButtonModal
            isLocked={contractType === '--' && true}
            onClick={() => handleClick()}
          >
            {children}
            <span>{title}</span>
          </ButtonModal>
        );
      };
      buttons.push(interactionButton);
    }

    return buttons;
  };

  const values: IContractModal = { getInteractionsButtons };

  return (
    <ContractModal.Provider value={values}>
      <>
        {mounted &&
          openModal &&
          ReactDOM.createPortal(
            <ModalContract {...modalOptions} />,
            window.document.body,
          )}

        {children}
      </>
    </ContractModal.Provider>
  );
};

export const useContractModal = (): IContractModal => useContext(ContractModal);
