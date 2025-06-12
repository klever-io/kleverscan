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
