import { Container } from '@/styles/common';
import { GrFormClose } from 'react-icons/gr';
import styled from 'styled-components';

export const BannerContainer = styled(Container)<{ status: boolean }>`
  width: 100%;
  justify-content: center;
  min-height: 2rem;
  padding: 4px 32px 4px 16px;
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

export const BannerParagraph = styled.p`
  font-size: 0.875rem;
  line-height: 1rem;
`;

export const ButtonClose = styled(GrFormClose).attrs(props => ({
  size: 20,
}))`
  cursor: pointer;
  position: absolute;
  right: 1rem;
`;
