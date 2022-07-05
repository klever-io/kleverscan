import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { Container, Header, Title } from '@/views/assets';

import { ArrowLeft } from '@/assets/icons';
import { Transactions as Icon } from '@/assets/title-icons';
import ContractSpecific from '@/components/ContractSpecific';

const CreateTransaction: React.FC<any> = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('walletAddress')) {
        router.push('/');
      }
    }
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Create Transaction</h1>
          <Icon />
        </Title>
      </Header>

      <ContractSpecific />
    </Container>
  );
};

export default CreateTransaction;
