import ModalContract, {
  IModalContract,
} from '@/components/Contract/ModalContract';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useMulticontract } from '../contract/multicontract';
import { ButtonModal } from './styles';

interface IContractModal {
  getInteractionsButtons: (
    params: IUseInteractionButton[],
    isLeftAligned?: boolean,
  ) => React.FC[];
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IUseInteractionButton {
  title: string;
  contractType: string;
  defaultValues?: any;
}

export const ContractModal = createContext({} as IContractModal);

export const ContractModalProvider: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const { setSelectedContractType } = useMulticontract();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<IModalContract>({
    title: '',
    contractType: 'TransferContract',
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkInitialUrl = () => {
    if (
      router.query &&
      router.query.contract &&
      router.pathname !== '/create-transaction'
    ) {
      setOpenModal(true);
    }
  };

  useEffect(() => {
    checkInitialUrl();
  }, [router.isReady]);

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
          defaultValues,
          title,
        };

        const handleClick = () => {
          setOpenModal(() => (contractType === '--' ? false : true));
          setModalOptions(() => modalOptions);
          setSelectedContractType(contractType);
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

  const values: IContractModal = { getInteractionsButtons, setOpenModal };

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
