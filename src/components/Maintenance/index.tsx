import React from 'react';
import { Container } from './styles';

import { FiXOctagon } from 'react-icons/fi';
import { FaWrench } from 'react-icons/fa';

import { DataCard, IconContainer, DataCardValue } from '@/views/home';

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
