import styled from 'styled-components';

import { IButton } from '.';

export const Container = styled.button<IButton>`
  padding: 1rem 1.25rem;

  background-image: ${props => props.theme.button.background};

  border-radius: ${props => (props.mainPage ? 0.5 : 0.25)}rem;

  font-size: 0.8rem;
  text-transform: uppercase;
`;
