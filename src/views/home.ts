import styled from 'styled-components';

import { navbarHeight } from '../configs/navbar';

export const BackgroundVideo = styled.div`
  position: absolute;

  top: 0;
  width: 100%;

  background: ${props => props.theme.navbar.background};

  z-index: -1;

  video {
    width: 100%;

    opacity: 0.6;
  }
`;

export const InputContainer = styled.section`
  margin-top: ${navbarHeight}rem;

  padding: 1rem 17.5rem;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: ${props => props.theme.white};

  span {
    font-size: 2rem;
    font-weight: 400;

    margin-bottom: 0.75rem;
  }
`;
