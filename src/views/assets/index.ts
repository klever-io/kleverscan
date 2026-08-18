import {
  CardContent,
  CardHeaderItem,
  Container,
  PAGE_TOP_SPACING,
} from '@/styles/common';
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
  margin: ${PAGE_TOP_SPACING} auto 0;
`;

export const AssetsListContainer = styled(Container)`
  /* The title sits above the tab row, aligned with other page titles. */
  margin-top: ${PAGE_TOP_SPACING};

  > div {
    margin-top: 1rem;
  }

  /* Same gap under the tab row as the asset detail page has under its
     Transactions/Holders row (24px, measured in the browser). */
  [data-testid^='tab-content'] {
    margin-top: 1.5rem;
  }
`;

export const AssetCardContent = styled(CardContent)`
  background: none;
  overflow-x: hidden;

  border-radius: unset;

  display: grid;

  background: ${({ theme }) => theme.white};
  border-radius: 8px;

  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
