import { ArrowLeft } from '@/assets/icons';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  /* Pages with a title icon get a 40px row from the icon itself; without one
     the row shrank to the text height and the arrow sat higher than on every
     other page. */
  min-height: 40px;

  gap: 16px;

  color: ${props => props.theme.black};

  > div:first-of-type {
    cursor: pointer;
  }
`;

export const IconContainer = styled.div`
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const StyledArrow = styled(ArrowLeft)`
  height: auto;
  width: auto;

  path {
    fill: ${props => props.theme.black};
  }
`;
