import styled from 'styled-components';

import { default as DefaultInput } from '@/components/Inputt';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: 1600px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }
  @media (max-width: 768px) {
    padding: 3rem 3rem 5rem 3rem;
  }
`;

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

  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;

    flex-direction: column;
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.filter.border};
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
