import styled from 'styled-components';

export const RankingContainer = styled.div`
  height: 2.25rem;
  width: 2.25rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.background};

  border-radius: 50%;

  p {
    margin-left: 0.25rem;

    color: ${props => props.theme.black};
    font-weight: 600;
  }
`;
