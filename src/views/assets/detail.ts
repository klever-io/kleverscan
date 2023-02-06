import { default as DefaultInput } from '@/components/InputGlobal';
import { transparentize } from 'polished';
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

export const Row = styled.div<{ isStakingRoyalties: boolean }>`
  width: 100%;
  padding: 1.5rem 2rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: ${props => (props.isStakingRoyalties ? 'column' : 'row')};
    align-items: start;
    span:nth-child(1) {
      padding-bottom: 15px;
      padding-left: 15px;
    }
  }
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

export const AssetHeaderContainer = styled.div`
  background-color: transparent !important;
  display: flex;
  flex-direction: column;
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

export const UriContainer = styled.div`
  overflow-x: auto;
  width: 95%;
`;

export const FrozenContainer = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  background-color: ${props => props.theme.accountCard.frozenBackground};
  border-radius: 0.75rem;
  flex-wrap: wrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    position: absolute;
    height: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }

  div {
    padding: 1.25rem 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 1rem;
    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.card.border};
      border-width: 100%;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    strong {
      min-width: 200px;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    span {
      min-width: 230px;
      color: ${props => props.theme.darkText};
    }
    p {
      font-weight: 400;
      font-size: 15px;
      min-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      flex-direction: column;
      align-items: self-start;
      width: auto;
      overflow-x: hidden;
      span {
        text-align: left;
      }
      p {
        text-align: left;
        width: auto;
      }
    }
  }
`;
export const ContentRow = styled.div`
  width: 100%;
  div {
    padding: 0px;
  }
`;
export const ContentScrollBar = styled.div`
  width: 100%;
  overflow-x: scroll;

  span {
    flex-direction: column;
    background-color: ${props => props.theme.accountCard.cardStaking};
    border: 1px solid ${props => props.theme.card.border};
    padding: 1rem;
    border-radius: 0.75rem;
    height: auto;
    p {
      font-size: 13px;
    }
  }
  &::-webkit-scrollbar {
    position: absolute;
    height: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row !important;
    flex-wrap: wrap;
    max-height: 500px;
    min-width: 20rem;
    justify-content: center;
    span {
      min-height: 100px;
      max-width: 140px;
    }
    span:nth-child(2) {
      margin-left: 0px;
    }

    p {
      font-size: 13px;
    }
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }
`;
