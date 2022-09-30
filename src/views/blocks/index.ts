import { default as DefaultInput } from '@/components/Inputt';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem 5rem 1rem;
  }
`;

export const Header = styled.section`
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const CardContainer = styled.section`
  margin: 1.5rem 0;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const Card = styled.div`
  width: 100%;
  padding: 1.5rem;
  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  background-color: ${props => props.theme.white};

  border-radius: 1rem;

  gap: 1rem;

  color: ${props => props.theme.black};

  span {
    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  div {
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span:nth-child(2) {
      text-align: right;
    }
    p:nth-child(2) {
      text-align: right;
    }

    strong {
      font-weight: 600;
    }

    p {
      opacity: 0.7;

      font-size: 0.85rem;
      font-weight: 400;
      color: ${props => props.theme.darkText};
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
`;

export const EffectsContainer = styled.div<{ autoUpdate: boolean }>`
  ${props => (props.autoUpdate ? tableEffects : '')}
`;

const tableEffects = css`
  div > div:first-child {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes fadeInOpacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  div > div:not(:first-child) {
    opacity: 1;
    animation-name: down;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes down {
      0% {
        transform: translateY(-50%);
      }

      100% {
        transform: translateY(0%);
      }
    }
  }
`;

export const TableContainer = styled.section<{ autoUpdate: boolean }>`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  color: ${props => props.theme.black};
`;

export const UpdateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  color: ${props => props.theme.black};
`;
