import { ITableType } from '@/components/Table/styles';
import widths from '@/components/Table/widths';
import { Container } from '@/styles/common';
import styled from 'styled-components';

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

export const Row = styled.div<ITableType>`
  padding: 1rem 1.5rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  div {
    margin-right: 0.3125rem;
  }

  span {
    &:nth-child(1) {
      margin: -10px 33px -10px -10px;
    }
  }

  span,
  a {
    /* flex: 1; */
    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 0.95rem;
    color: ${props => props.theme.black};

    ${props => widths[props.type]};

    a {
      color: ${props => props.theme.black};
      font-weight: 600;
    }

    small {
      color: ${props => props.theme.darkText};
    }

    strong {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    p {
      font-weight: 600;
      color: ${props => props.theme.black};
    }
  }
  .address {
    cursor: pointer;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ContainerAssetId = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  width: 100%;
  div {
    max-height: 24px;
    min-width: fit-content;
  }

  a {
    overflow: hidden;
  }
`;

export const ContainerAssetName = styled(ContainerAssetId)`
  justify-content: flex-end;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

export const AssetPageContainer = styled(Container)`
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 98px;
  }
`;
