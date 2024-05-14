import AdvancedOptions from '@/components/Form/AdvancedOptions';
import WarningModal from '@/components/Modals/Warning';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { warningMessage } from '@/pages/create-transaction';
import { QueueItemContainer } from '@/views/create-transaction';
import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Container, Content, TitleContent } from './styles';

export interface IModalContract {
  title: string;
  contractType: string;
  defaultValues?: any;
  closeQuickAccessModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContract: React.FC<IModalContract> = ({
  title,
  contractType,
  defaultValues,
  closeQuickAccessModal,
}) => {
  const { extensionInstalled, connectExtension } = useExtension();
  const {
    queue,
    selectedId,
    setSelectedContractAndQuery,
    setIsModal,
    resetForms,
    setSelectedContractType,
  } = useMulticontract();

  const { setOpenModal } = useContractModal();

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const closeModal = () => {
    setOpenModal(false);
    closeQuickAccessModal && closeQuickAccessModal(false);
  };

  useEffect(() => {
    setSelectedContractType(contractType);
    setSelectedContractAndQuery(contractType);
    setIsModal(true);
    resetForms(defaultValues, contractType);

    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'unset';
      setIsModal(false);
    };
  }, []);

  return (
    <>
      <Container onMouseDown={closeModal}>
        <Content onMouseDown={e => e.stopPropagation()}>
          <TitleContent>
            <h1>{title}</h1>
            <AiOutlineClose onClick={closeModal} cursor={'pointer'} />
          </TitleContent>
          {queue.map(item => {
            return (
              <QueueItemContainer
                key={JSON.stringify(item.ref)}
                visible={item.elementId === selectedId}
              >
                {item.ref}
              </QueueItemContainer>
            );
          })}
          <AdvancedOptions />
        </Content>
        <WarningModal message={warningMessage} />
      </Container>
    </>
  );
};

export default ModalContract;
