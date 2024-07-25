import { PropsWithChildren } from 'react';
import React from 'react';
import ProposalsCard from './ProposalsCard';
import { CardsWrapper } from './style';
import ValidatorsCard from './ValidatorsCard';

const ProposalValidatorSection: React.FC<PropsWithChildren> = () => {
  return (
    <CardsWrapper>
      <ProposalsCard />
      <ValidatorsCard />
    </CardsWrapper>
  );
};

export default ProposalValidatorSection;
