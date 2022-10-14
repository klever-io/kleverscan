import { default as DefaultInput } from '@/components/Inputt';
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
    div {
      width: 100%;
      flex-direction: column;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  > div:last-child {
    min-width: 15rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;

    flex-direction: column;
  }
`;

export const FilterByDate = styled.div`
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin-top: 1.4rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
    margin-left: 0;
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
