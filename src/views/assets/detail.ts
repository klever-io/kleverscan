import { Certified } from '@/assets/icons';
import { default as DefaultInput } from '@/components/Inputt';
import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    svg {
      height: auto;
      width: auto;

      cursor: pointer;
    }
  }
`;

export const VerifiedContainer = styled(Certified)`
  position: relative;
  top: 0;
  left: 0;
  transform: translate(-130%, -60%);

  @media (min-width: 769px) and (max-width: 900px) {
    transform: translate(-150%, -60%);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    transform: translate(-150%, -60%);
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};
`;

export const AssetTitle = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1rem;

  div {
    padding: 0.5rem 1rem;

    display: flex;

    align-items: center;
    justify-content: center;

    background-color: ${props => props.theme.card.assetText};

    color: ${props => props.theme.true.white};
    font-weight: 400;
    font-size: 0.85rem;

    border-radius: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CardContainer = styled.div`
  margin-top: 2rem;

  display: flex;

  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;

  flex-direction: row;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  padding: 1rem;

  background-color: ${props =>
    props.selected ? props.theme.white : 'transparent'};

  border-radius: 0.75rem 0.75rem 0 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};

    opacity: ${props => (props.selected ? 1 : 0.33)};

    transition: 0.2s ease;
  }
`;

export const CardContent = styled.div`
  background-color: ${props => props.theme.white};

  border-radius: 0 0.75rem 0.75rem 0.75rem;
`;

export const Row = styled.div`
  width: 100%;

  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  span {
    &:first-child {
      width: 10rem;
    }
    &:nth-child(2) {
      margin-left: 1rem;
      margin-right: 0.5rem;
    }
    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }
`;

export const CenteredRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  strong {
    font-size: 1rem;
    font-weight: 600;
  }

  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-weight: 600;
    font-size: 0.85rem;
  }

  span {
    width: 33rem !important;
  }

  svg {
    cursor: pointer;
  }
`;

export const Logo = styled.img`
  width: 3.354rem;
  height: 3.354rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
`;

export const LetterLogo = styled.div`
  width: 3.354rem;
  height: 3.354rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  text-transform: uppercase;
`;

export const HoverAnchor = styled.a`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const AssetHeaderContainer = styled.div<{ isVerfied: boolean }>`
  background-color: transparent !important;
  display: flex;
  flex-direction: column;
  margin-top: ${props => (props.isVerfied ? '0' : '1rem')};
  color: ${props => props.theme.black} !important;
  &:hover {
    cursor: default;
  }

  p {
    margin-top: 0.25rem;
    color: ${props => props.theme.darkText} !important;
  }

  a {
    color: ${props => props.theme.black} !important;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;
