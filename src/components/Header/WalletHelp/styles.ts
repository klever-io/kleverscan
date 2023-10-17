import { transparentize } from 'polished';
import styled from 'styled-components';
export const Container = styled.div<{ $opened?: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;

  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 41rem;
  height: 100%;
  z-index: 6;
  background-color: ${props => props.theme.white};
  transform: translateX(${props => (props.$opened ? 0 : '100%')});
  transition: 0.5s ease, opacity 0.5s ease;
  visibility: ${props => (props.$opened ? 'visible' : 'hidden')};
  opacity: ${props => (props.$opened ? 1 : 0)};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    overflow-y: hidden;
    height: 100%;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
`;

export const BodyModal = styled.div`
  padding-inline-start: 1.5rem;
  padding-inline-end: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 10rem;
  flex: 1 1 0%;
  height: 100%;
  overflow: auto;
  color: ${props => props.theme.black};
  p {
    font-size: inherit;
    font-weight: inherit;
    padding: 10px 0px;
  }
  a {
    color: rgb(170, 51, 181);
  }
`;

export const HeaderModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-inline-start: 1.5rem;
  padding-inline-end: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  border-bottom: 1px solid ${props => props.theme.card.border};
  span {
    font-style: normal;
    font-weight: 800;
    line-height: 51px;
    color: ${props => props.theme.black};
  }
`;

export const Title = styled.h1`
  font-style: normal;
  font-weight: 800;
  font-size: 30px;
  line-height: 51px;
  padding-bottom: 2rem;
  padding-top: 1rem;
  color: ${props => props.theme.black};
`;

export const InformationDiv = styled.div`
  display: flex;
  color: rgb(170, 51, 181);
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 21px;
  border-radius: 16px;
  padding: 15px 20px 15px 15px;
  background-color: ${props =>
    transparentize(props.theme.dark ? 0.86 : 0.9, 'purple')};
`;

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 2/1;
`;
