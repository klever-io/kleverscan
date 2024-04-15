import { Currency, PaperPlus, Token, Transfer } from '@/assets/transaction';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { FaRegSnowflake, FaRocket, FaVoteYea } from 'react-icons/fa';
import SquarePlus from '../../../../public/SquarePlus.svg';
import ModalContract, { IModalContract } from '../../Contract/ModalContract';
import {
  CardItem,
  Container,
  Content,
  PlusIcon,
  Title,
  TitleContainer,
} from './styles';

interface IShortCutContract {
  title: string;
  type: string;
  icon?: JSX.Element;
  openWiz?: () => void;
}

// TODO -> Check type for setWizard
const QuickAccess: React.FC<{
  setWizard: React.Dispatch<React.SetStateAction<any>>;
}> = ({ setWizard }) => {
  const { t } = useTranslation('home');
  const [contractType, setContractType] = useState('');
  const [openModalTransactions, setOpenModalTransactions] = useState(false);
  const [titleModal, setTitleModal] = useState('');

  const quickAccessContract: IShortCutContract[] = [
    {
      title: 'Transfer',
      type: 'TransferContract',
      icon: <Transfer />,
    },
    {
      title: 'Create Token',
      type: 'CreateAssetContract',
      openWiz: () => setWizard('Token'),
      icon: <Currency />,
    },
    {
      title: 'Create NFT',
      type: 'CreateAssetContract',
      openWiz: () => setWizard('NFT'),
      icon: <Token />,
    },
    {
      title: 'Create ITO',
      type: 'ConfigITOContract',
      openWiz: () => setWizard('ITO'),
      icon: <FaRocket size={22} />,
    },
    {
      title: 'Freeze',
      type: 'FreezeContract',
      icon: <FaRegSnowflake size={22} />,
    },
    { title: 'Vote', type: 'VoteContract', icon: <FaVoteYea size={22} /> },
    { title: 'Proposal', type: 'ProposalContract', icon: <PaperPlus /> },
    {
      title: 'Create Validator',
      type: 'CreateValidatorContract',
      icon: <SquarePlus />,
    },
  ];

  const modalOptions: IModalContract = {
    contractType,
    title: titleModal,
    closeQuickAccessModal: setOpenModalTransactions,
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

  return (
    <Container>
      <TitleContainer>
        <small>{t('QuickAccess Description')}</small>
        <Title>What do you want to do?</Title>
      </TitleContainer>
      <Content>
        {quickAccessContract.map(contract => (
          <CardItem
            key={JSON.stringify(contract.title)}
            onClick={e => handleClick(contract, e)}
          >
            <PlusIcon>{contract.icon}</PlusIcon>
            <p>{contract.title}</p>
          </CardItem>
        ))}
      </Content>
      {openModalTransactions && <ModalContract {...modalOptions} />}
    </Container>
  );
};

export default QuickAccess;
