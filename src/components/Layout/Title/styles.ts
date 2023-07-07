import { ArrowLeft } from '@/assets/icons';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  color: ${props => props.theme.black};

  div {
    cursor: pointer;
  }
`;

export const StyledArrow = styled(ArrowLeft)`
  height: auto;
  width: auto;

  path {
    fill: ${props => props.theme.black};
  }
`;
