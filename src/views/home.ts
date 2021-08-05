import styled from 'styled-components';

export const BackgroundVideo = styled.div`
  position: absolute;

  width: 100%;

  background: ${props => props.theme.navbar.background};

  z-index: -1;

  video {
    width: 100%;

    opacity: 0.6;
  }
`;
