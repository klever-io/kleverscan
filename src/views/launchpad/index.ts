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
  user-select: none;
  gap: 80px;

  padding-top: 40px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-top: 80px;
    gap: 160px;
  }
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

export const TableTitle = styled.h2`
  color: ${({ theme }) => theme.black};

  font-size: 1.5rem;
  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 16px;

  a {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 1rem;

    color: ${({ theme }) => theme.violet};
    font-size: 0.875rem;
    line-height: 1rem;
  }
`;

export const TableContainer = styled.div``;

export const LaunchpadLink = styled.a`
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
  transition: 0.2s;

  &:hover {
    filter: brightness(1.2);
  }
`;

export const ParticipateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 30px;
  border-radius: 24px;

  background-color: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white} !important;

  font-size: 0.875rem;
  line-height: 1rem;
  font-weight: 600;
  text-decoration: none;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    filter: brightness(1.2);
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 14px 30px;
  }
`;
