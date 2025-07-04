import styled from 'styled-components';

export const SmartContractDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SmartContractDataCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1028px;
  min-width: 328px;
  border-radius: 16px;
  border: 1px solid #848495;
  padding: 16px;
  gap: 16px;
  font-family: 'Manrope';
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
`;

export const SmartContractDataCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SmartContractDataCardHeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  span {
    color: #bababa;
  }
`;

export const SmartContractDataCardInfo = styled.div`
  display: flex;
  gap: 40%;
`;

export const SmartContractDataCardInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span:first-of-type {
    color: #bababa;
  }
`;
