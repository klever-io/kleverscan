import { PropsWithChildren } from 'react';
import { Accounts as Icon } from '@/assets/title-icons';
import { Header } from '@/styles/common';
import { useState } from 'react';
import { HashComponent } from '../Contract';
import Title from '../Layout/Title';
import Multisign from './MultSign';
import { Container } from './styles';

const MultisignComponent: React.FC<PropsWithChildren> = () => {
  const [txHash, setTxHash] = useState<string | null>(null);

  return (
    <Container>
      <Header>
        <Title title="Multisign Interface" Icon={Icon} />
      </Header>
      {txHash && <HashComponent hash={txHash} setHash={setTxHash} />}

      <Multisign setTxHash={setTxHash} />
    </Container>
  );
};

export default MultisignComponent;
