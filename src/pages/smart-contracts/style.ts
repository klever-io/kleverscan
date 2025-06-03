import { TableGradientBorder } from '@/components/Table/styles';
import { Cell } from '@/components/Home/MostTransacted/styles';
import styled from 'styled-components';

export const SearchInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0 20px 0;
  gap: 8px;

  span {
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #c6c7eb;
  }
`;

export const TitleSection = styled.div`
  width: 100%;
  height: 44px;
  border-radius: 200px;
  padding: 10px 12px;
  gap: 8px;
  background-color: #1f1f24;
`;

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
  color: #ffffff;

  span {
    font-size: 12px;
    line-height: 16px;
    color: #b7bdc6;
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
  scrollbar-width: none;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 216px;
  height: 184px;
  border-radius: 16px;
  padding: 16px;
  gap: 16px;
  background-color: #0b0b10;

  font-family: 'Manrope';
  color: #ffffff;
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

export const CellTableContractNameWrapper = styled(Cell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const CellTableContractName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

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

export const InputContractContainer = styled.div`
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border-radius: 200px;
  border: 1px solid #ffffff;
  gap: 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    &::placeholder {
      color: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }

  > svg {
    cursor: pointer;
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }
`;
