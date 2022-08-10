import { default as DefaultInput } from '@/components/Inputt';
import filterWidths from '@/components/Table/filters';
import { ITableType } from '@/components/Table/styles';
import widths from '@/components/Table/widths';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};
  @media (max-width: 1600px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem 1rem;
  }
`;

export const Header = styled.section`
  margin-bottom: 1rem;

  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

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
    ${props =>
      props.filter &&
      props.filter.value !== 'all' &&
      filterWidths[props.filter.name]}

    a {
      color: ${props => props.theme.black};
      font-weight: 600;
    }

    small {
      color: ${props => props.theme.table.text};
    }

    strong {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.table.text};
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

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.filter.border};
`;

const LogoCSS = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
`;

export const Logo = styled.img`
  ${LogoCSS}
`;

export const LetterLogo = styled.div`
  ${LogoCSS}
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-transform: uppercase;
`;
