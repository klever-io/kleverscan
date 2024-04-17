import { useRouter } from 'next/router';
import React from 'react';
import {
  Background,
  Button,
  ButtonContainer,
  Container,
  Content,
  Number,
} from '../views/notFound';

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Container>
        <Content>
          <h1>Page not found!</h1>
          <ButtonContainer>
            <Button hasBackground onClick={handleBack}>
              <span>Back to homepage</span>
            </Button>
            <a href="https://support.klever.org/" rel="nofollow">
              <Button hasBackground={false}>
                <span>Visit our help center</span>
              </Button>
            </a>
          </ButtonContainer>
        </Content>

        <Number>
          <span>404</span>
        </Number>
        <Background />
      </Container>
    </>
  );
};

export default NotFound;
