import { useExtension } from '@/contexts/extension';
import React, { useEffect, useState } from 'react';
import ModalContract, { IModalContract } from '../Contract/ModalContract';
import { Title } from '../InputGlobal/HomeInput/styles';
import { Carousel } from './Carousel';
import { CardItem, Container, IconSquarePlus, TitleContainer } from './styles';

interface IShortCutContract {
  title: string;
  type: string;
  openWiz?: () => void;
}

// TODO -> Check type for setWizard
const QuickAccess: React.FC<{
  setWizard: React.Dispatch<React.SetStateAction<any>>;
}> = ({ setWizard }) => {
  const [contractType, setContractType] = useState('');
  const [openModalTransactions, setOpenModalTransactions] = useState(false);
  const [titleModal, setTitleModal] = useState('');

  const { extensionInstalled, connectExtension } = useExtension();

  const quickAccessContract: IShortCutContract[] = [
    { title: 'Transfer', type: 'TransferContract' },
    {
      title: 'Create Token',
      type: 'CreateAssetContract',
      openWiz: () => setWizard('Token'),
    },
    {
      title: 'Create NFT',
      type: 'CreateAssetContract',
      openWiz: () => setWizard('NFT'),
    },
    { title: 'Create ITO', type: 'ConfigITOContract' },
    { title: 'Freeze', type: 'FreezeContract' },
    { title: 'Vote', type: 'VoteContract' },
    { title: 'Proposal', type: 'ProposalContract' },
    { title: 'Create Validator', type: 'CreateValidatorContract' },
  ];

  const modalOptions: IModalContract = {
    contractType,
    title: titleModal,
  };

  const handleClick = (contract: IShortCutContract, e: any) => {
    if (contract.openWiz) {
      contract.openWiz();
      return;
    }
    setContractType(contract.type);
    setOpenModalTransactions(true);
    setTitleModal(`${contract.title} Contract`);
  };

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  return (
    <Container>
      <TitleContainer>
        <Title>Quick access</Title>
        <small>Interact with the blockchain through Explorer</small>
      </TitleContainer>
      <Carousel>
        {quickAccessContract.map(contract => (
          <CardItem
            key={JSON.stringify(contract.title)}
            onClick={e => handleClick(contract, e)}
          >
            <IconSquarePlus />
            <p>{contract.title}</p>
          </CardItem>
        ))}
      </Carousel>
      {openModalTransactions && <ModalContract {...modalOptions} />}
    </Container>
  );
};

export default QuickAccess;
