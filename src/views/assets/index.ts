import { CardContent, CardHeaderItem, Container } from '@/styles/common';
import styled, { css } from 'styled-components';

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    cursor: pointer;

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const ContainerAssetId = styled.section`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  width: 100%;
  div {
    max-height: 24px;
    min-width: fit-content;
  }

  a {
    overflow: hidden;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-between;
  }
`;

export const ContainerAssetName = styled(ContainerAssetId)`
  justify-content: flex-end;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

export const AssetPageContainer = styled(Container)`
  max-width: 1440px;
  margin: 0 auto;
`;

export const AssetCardContent = styled(CardContent)`
  background: none;
  overflow-x: hidden;

  border-radius: unset;

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
