import { DefaultCardStyles } from '@/styles/common';
import { transparentize } from 'polished';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styled from 'styled-components';

interface IAsset {
  selected?: boolean;
}

export const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
`;

export const SideList = styled.div`
  width: 30rem;
  padding: 1rem 1rem;
  padding-top: 0;

  @media (max-width: 768px) {
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  ::-webkit-scrollbar-track {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.3);
    background: transparent;
    cursor: pointer !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${props => transparentize(0.2, props.theme.violet)};
    border-radius: 10px;
    cursor: pointer !important;
  }
`;

export const AssetsList = styled.div`
  gap: 0.7rem;
  display: flex;
  flex-direction: column;
`;

export const AssetContainer = styled.div<IAsset>`
  cursor: pointer;
  ${DefaultCardStyles};
  background-color: ${props => {
    if (!props.selected && !props.theme.dark) {
      return props.theme.white;
    } else if (props.selected && props.theme.dark) {
      return props.theme.kappsDemo.darker;
    } else if (props.selected && !props.theme.dark) {
      return props.theme.lightGray;
    }
    return 'unset';
  }};

  width: 100%;
  span {
    text-align: center;
    color: ${props => props.theme.white};
    :nth-child(2) {
      font-size: 0.7rem;
    }
  }

  border-radius: 0.3rem;
  padding: 1rem 0.5rem;

  display: flex;
  align-items: center;
`;

export const ITOContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  user-select: none;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ITOContent = styled.div`
  width: 100%;
  min-width: 0;
  & > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const PackContainer = styled.div`
  ${DefaultCardStyles}

  width: 100%;
  padding: 1rem 1.8rem;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  span {
    color: white;
  }
`;

export const KeyLabel = styled.span`
  font-size: 1.5rem;
  user-select: text;
`;

export const ChooseAsset = styled.div`
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    user-select: none;
    color: ${props => props.theme.black};
    opacity: 0.3;
    font-size: large;
  }
`;

export const ItemsContainer = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-gap: 1rem;
`;

export const IDAsset = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  span {
    color: ${props => props.theme.black};
    user-select: text;
  }
`;

export const LoadingContainer = styled.div`
  height: 30rem;
  display: flex;
  align-items: center;
`;

export const EmptyList = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  span {
    user-select: none;
    color: ${props => props.theme.white};
  }
`;

export const HashContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.card.background};
  border-radius: 4px;
  color: ${props => props.theme.true.white};
`;

export const HashAndCopy = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.3rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  :hover {
    cursor: pointer;
  }
  a {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const LineInputSection = styled.div`
  height: 0.1rem;
  background-color: ${props => props.theme.white};
`;

export const Scroll = styled.div`
  gap: 0.7rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 0.5rem;
`;

export const Scrollable = styled.div`
  height: 22rem;
  overflow-y: scroll;
  color: ${props =>
    props.theme.dark ? props.theme.true.white : props.theme.black};

  @media (max-width: 768px) {
    height: initial;
    max-height: 40vh;
  }

  ::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  ::-webkit-scrollbar-track {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.3);
    background: transparent;
    cursor: pointer !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${props => transparentize(0.2, props.theme.violet)};
    border-radius: 10px;
    cursor: pointer !important;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ConfigITOButtonWrapper = styled.span`
  width: 100%;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    width: initial;
  }
`;

export const ITOSearchButton = styled.button`
  align-self: end;
  min-width: 35%;
  color: ${props => props.theme.true.white} !important;
  background: ${props => props.theme.violet};
  padding: 0.8rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

export const CreateITOButton = styled(ITOSearchButton)`
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: 215px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
`;

export const CustomLink = styled.a`
  align-self: end;
  color: ${props => props.theme.true.white} !important;
  background: ${props => props.theme.violet};
  padding: 0.625rem 2.94rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const ITOTitle = styled.div`
  color: ${props => props.theme.black};
  width: fit-content;
  border-radius: 4px;
  span {
    font-weight: bolder;
    font-size: 2rem;
    user-select: text;
  }
`;

export const CloseIcon = styled(IoMdCloseCircleOutline)`
  color: #7e7fbf;
  cursor: pointer;
  margin-right: 1rem;
`;
