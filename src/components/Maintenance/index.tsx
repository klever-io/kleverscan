import { useRouter } from 'next/router';
import React from 'react';
import {
  Background,
  Button,
  ButtonContainer,
  Content,
} from '../../views/notFound';
import { Container, Message } from './styles';

const Maintenance: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Container>
        <Content>
          <Message>
            <span>Down for Maintenance</span>
          </Message>
          <ButtonContainer>
            <Button hasBackground onClick={handleBack}>
              <span>Back to homepage</span>
            </Button>
          </ButtonContainer>
        </Content>
      </Container>
      <Background />
    </>
  );
};

export default Maintenance;
