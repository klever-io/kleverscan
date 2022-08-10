import { DataCard, DataCardValue, IconContainer } from '@/views/home';
import React from 'react';
import { FaWrench } from 'react-icons/fa';
import { Container } from './styles';

const Maintenance: React.FC = () => {
  return (
    <Container>
      <DataCard>
        <IconContainer>
          <FaWrench />
        </IconContainer>
        <DataCardValue id="Maintenance">
          <span>
            We are preparing the launch of a new update in KleverChain Testnet
            2.0, including first kapp launch enabling staking.
          </span>
          <p>Until then, test transactions will be temporarily halted.</p>
        </DataCardValue>
      </DataCard>
    </Container>
  );
};

export default Maintenance;
