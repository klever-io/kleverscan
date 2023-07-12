import { DefaultCardStyles, DefaultScrollBar } from '@/styles/common';
import styled, { css } from 'styled-components';

export const CannyContainer = styled.div`
  ${DefaultCardStyles}
  max-height: 70vh;
  overflow: auto;

  padding: 1rem;

  ${DefaultScrollBar}
`;

export const CannyRenderer = styled.div`
  #canny-iframe {
    ${props =>
      props.theme.dark &&
      css`
        filter: invert(1) hue-rotate(180deg) saturate(0.8) grayscale(0.1);
      `};
  }
`;
