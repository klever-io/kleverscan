import { default as DefaultInput } from '@/components/Inputt';
import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.section`
  margin-bottom: 1rem;

  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
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

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};
`;

export const Section = styled.section`
  padding: 5rem 0rem 0 0rem;

  h1 {
    margin-bottom: 1rem;
    cursor: pointer;
    width: fit-content;
    &:hover {
      text-decoration: underline;
    }
  }

  &:last-child {
    padding-bottom: 10rem;
  }
`;
