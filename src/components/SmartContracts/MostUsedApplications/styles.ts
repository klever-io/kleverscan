import styled from 'styled-components';

export const CardsTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 10px;
  gap: 10px;

  font-family: 'Manrope';
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: ${props => props.theme.black};

  span {
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.gray600};
  }
`;

export const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const CardsContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.gray200};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.gray400};
    border-radius: 3px;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 216px;
  min-height: 184px;
  flex: 1;
  border-radius: 16px;
  border: ${({ theme }) => !theme.dark && '1px solid' + theme.violet};
  padding: 16px;
  gap: 16px;
  background-color: ${({ theme }) =>
    !theme.dark ? theme.true.white : theme.darkCard};

  font-family: 'Manrope';
  color: ${props => props.theme.black};

  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    min-width: 180px;
    height: 160px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h4 {
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
  }
`;

export const CardContractInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  span {
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
  }
`;

export const CardContractName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  span {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
  }

  small {
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme.dark ? theme.black10 : theme.background};
`;

export const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 172px;
  gap: 8px;
  color: ${props => props.theme.black};
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;

  span:last-child {
    font-size: 12px;
    color: ${({ theme }) => theme.gray600};
  }
`;
