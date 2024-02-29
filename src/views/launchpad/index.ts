import styled from 'styled-components';

interface IAsset {
  selected?: boolean;
}

export const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
`;

export const ITOContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  user-select: none;
`;

export const TableContainer = styled.div`
  padding: 2%;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 70px;
  }
`;

export const ParticipateButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 14px 30px;
  border-radius: 24px;

  background-color: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white} !important;

  font-weight: 700;
  text-decoration: none;

  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.purple};
  }
`;
