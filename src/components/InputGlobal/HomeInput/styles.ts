import styled from 'styled-components';

export const Container = styled.div`
  padding: 4rem 0.5rem 2rem 0.5rem;
  width: 100%;
  position: relative;
  z-index: 2;
`;
export const Title = styled.h1`
  color: ${props => props.theme.black};
  font-size: 1.5rem;
  font-weight: 400;
`;
