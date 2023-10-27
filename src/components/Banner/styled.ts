import { Container } from '@/styles/common';
import { GrFormClose } from 'react-icons/gr';
import styled from 'styled-components';

export const BannerContainer = styled(Container)<{ status: boolean }>`
  width: 100%;
  justify-content: center;
  min-height: 4rem;
  padding: 1.5rem 2.5rem 1.5rem 1.7rem;
  color: ${({ theme, status }) =>
    status ? theme.true.black : theme.true.white};
  background-color: ${({ theme, status }) =>
    status ? theme.status.warning : theme.card.bannerError};
  path {
    stroke: ${({ theme, status }) =>
      status ? theme.true.black : theme.true.white};
  }
  position: relative;
  z-index: 1;
`;

export const ButtonClose = styled(GrFormClose).attrs(props => ({
  size: 20,
}))`
  cursor: pointer;
  position: absolute;
  right: 1rem;
`;
