import { Cell } from '@/components/Home/MostTransacted/styles';
import styled from 'styled-components';

export const CardsTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 20px;
  gap: 10px;

  font-family: 'Manrope';
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: ${props => props.theme.black};

  span {
    font-size: 12px;
    line-height: 16px;
    color: #b7bdc6;
  }
`;

export const InputContractContainer = styled.div`
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border-radius: 200px;
  border: 1px solid #ffffff;
  margin-bottom: 20px;
  gap: 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    width: 100%;
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.gray800};

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
