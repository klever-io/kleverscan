import React from 'react';

import { Container } from './styles';

export interface IButton {
  mainPage?: boolean;
  onClick?(): void;
}

const Button: React.FC<IButton> = ({ mainPage, onClick, children }) => {
  const isMainPage: boolean = mainPage === undefined ? false : mainPage;

  return (
    <Container mainPage={isMainPage} onClick={onClick}>
      {children}
    </Container>
  );
};

export default Button;
