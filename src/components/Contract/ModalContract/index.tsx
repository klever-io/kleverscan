import { useExtension } from '@/contexts/extension';
import { setQueryAndRouter } from '@/utils';
import { useDidUpdateEffect } from '@/utils/hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Contract from '..';
import { Container, Content, TitleContent } from './styles';

export interface IModalContract {
  title: string;
  contractType: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  defaultValues?: any;
}

const ModalContract: React.FC<IModalContract> = ({
  title,
  contractType,
  setOpenModal,
  defaultValues,
}) => {
  const { extensionInstalled, connectExtension } = useExtension();
  const router = useRouter();

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const closeModal = () => {
    setOpenModal(false);
    setQueryAndRouter({}, router);
  };

  const contractProps = {
    modalContractType: { value: contractType },
    defaultValues,
  };

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <Container onMouseDown={closeModal}>
      <Content onMouseDown={e => e.stopPropagation()}>
        <TitleContent>
          <h1>{title}</h1>
          <AiOutlineClose onClick={closeModal} cursor={'pointer'} />
        </TitleContent>
        <Contract {...contractProps} />
      </Content>
    </Container>
  );
};

export default ModalContract;
