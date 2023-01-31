import { default as DefaultInput } from '@/components/InputGlobal';
import Link from 'next/link';
import styled from 'styled-components';

export const Container = styled.div``;

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    cursor: pointer;

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const Header = styled.section`
  margin: 1.5rem 0;

  display: flex;
  flex-wrap: wrap;

  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  div {
    display: flex;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    div:nth-child(1) {
      width: 100%;
      flex-direction: column;
    }
  }
`;

export const FilterByDate = styled.div`
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin-top: 1.4rem;
  margin-left: 0.75rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};
`;

export const CenteredRow = styled.span`
  overflow: visible !important;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 0.5rem;
    width: 100%;
    p {
      font-weight: 600;
      color: ${props => props.theme.black};
    }
  }
`;

export const TooltipText = styled.span`
  visibility: hidden;
  opacity: 0;
  width: fit-content !important;
  color: ${props => props.theme.white} !important;
  background-color: ${props => props.theme.black};

  padding: 5px 2px;
  border-radius: 6px;

  position: fixed;
  z-index: 1;
  transform: translateX(-12.5%);
  transition: 0.3s ease opacity;
  pointer-events: none;
`;

export const Tooltip = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

export const StyledLink = styled(Link)`
  &:hover {
    overflow: visible;
  }
`;

export const MultiContractContainer = styled.strong`
  position: relative;
  overflow: visible !important;
`;

export const MultiContractCounter = styled.span`
  background-color: ${props => props.theme.violet};
  position: relative;
  line-height: 20px;
  color: ${props => props.theme.true.white} !important;
  width: 20px !important;
  height: 20px !important;
  text-align: center;
  display: inline-block;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    transform: translate(5%, 28%);
    bottom: 5px;
    right: 1px;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 5px;
    right: 1px;
  }
  transform: translateY(-50%);
  font-size: smaller !important;
  border-radius: 50%;
`;
