import { DefaultCardStyles } from '@/styles/common';
import { CiSquarePlus } from 'react-icons/ci';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  color: white;
  padding: 0rem 0 0rem 0.5rem;
`;

export const TitleContainer = styled.div`
  padding-bottom: 1rem;
  small {
    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.darkText};
    width: auto;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 18px;
  }
`;

export const CardItem = styled.div`
  ${DefaultCardStyles}
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  padding: 9px 20px 16px;
  width: 10.5rem;
  height: 10.5rem;
  margin-bottom: 1rem;

  background: ${props => props.theme.dark && props.theme.blue};
  border-radius: 0.5rem;

  cursor: pointer;
  p {
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.darkText};
    font-weight: 680;
    font-size: 1rem;
    line-height: 19px;
  }

  svg {
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.violet};
  }
`;

export const IconSquarePlus = styled(CiSquarePlus).attrs(() => ({
  size: 35,
}))`
  position: absolute;
  right: 1.5rem;
  top: 1rem;
`;
