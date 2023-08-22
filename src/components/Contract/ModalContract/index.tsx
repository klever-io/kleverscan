import AdvancedOptions from '@/components/Form/AdvancedOptions';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useDidUpdateEffect } from '@/utils/hooks';
import { QueueItemContainer } from '@/views/create-transaction';
import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Container, Content, TitleContent } from './styles';

export interface IModalContract {
  title: string;
  contractType: string;
  defaultValues?: any;
}

const ModalContract: React.FC<IModalContract> = ({
  title,
  contractType,
  defaultValues,
}) => {
  const { extensionInstalled, connectExtension } = useExtension();
  const {
    queue,
    selectedId,
    setSelectedContractAndQuery,
    clearQuery,
    setIsModal,
    resetForms,
  } = useMulticontract();

  const { setOpenModal } = useContractModal();

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const closeModal = () => {
    clearQuery();
    setOpenModal(false);
  };

  useEffect(() => {
    setSelectedContractAndQuery(contractType);
    setIsModal(true);
    resetForms(defaultValues);

    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'unset';
      setIsModal(false);
    };
  }, []);

  return (
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
    </Container>
  );
};

export default ModalContract;
