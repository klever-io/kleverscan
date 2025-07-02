import styled from 'styled-components';

export const CardsTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 10px;

  font-family: 'Manrope';
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.true.white};

  span {
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.gray600};
  }
`;

export const CardsContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: thin;

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
  padding: 16px;
  gap: 16px;
  background-color: ${({ theme }) => theme.darkCard};

  font-family: 'Manrope';
  color: ${({ theme }) => theme.true.white};

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
