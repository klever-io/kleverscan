import { transparentize } from 'polished';
import styled from 'styled-components';

import { navbarHeight } from '../configs/navbar';
import { Theme } from '../styles/styles';

export const BackgroundVideo = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  max-height: 35rem;

  overflow: hidden;

  background: ${props => props.theme.navbar.background};

  z-index: -1;

  video {
    min-width: 100%;

    opacity: 0.6;
  }
`;

export const InputContainer = styled.section`
  margin-top: ${navbarHeight}rem;
  margin-bottom: 17rem;

  padding: 1rem 17.5rem;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: ${props => props.theme.white};

  span {
    font-size: 2rem;
    font-weight: 400;

    margin-bottom: 0.75rem;

    white-space: nowrap;
  }

  p {
    display: unset;

    font-size: 1.875rem;
  }

  @media (max-width: 555px) {
    padding: 0;

    text-align: center;

    p {
      display: block;
    }
  }
`;

export const Container = styled.section`
  position: relative;
`;

export const CardContainer = styled.div`
  top: -7rem;
  width: 100%;

  padding: 0 17rem;

  position: absolute;
  display: flex;

  flex-direction: row;

  @media (max-width: 1200px) {
    padding: 0 7rem;
  }

  @media (max-width: 768px) {
    padding: 0 3rem;
  }

  @media (max-width: 425px) {
    top: -13rem;

    flex-direction: column;
  }
`;

export const StatsContainer = styled.div`
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  border-radius: 0.25rem 0 0 0.25rem;

  background-color: ${props => props.theme.white};

  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;

  span {
    background-image: ${props => props.theme.text.background};
    background-clip: text;
    -webkit-background-clip: text;

    color: transparent;
    font-weight: 400;
    font-size: 0.9rem;
  }

  @media (max-width: 425px) {
    justify-content: center;
  }
`;

const borderProp = (theme: Theme) => `1px solid ${theme.border}`;

const Row = styled.div`
  flex: 50%;

  padding: 1rem;

  p {
    font-weight: 400;
    font-size: 1.5rem;
    color: ${props => props.theme.navbar.background};

    animation: 1s ease 0s 1 normal none running fadein;
  }

  @media (max-width: 425px) {
    flex: 100%;

    div {
      display: flex;

      flex-direction: column;
      align-items: center;
    }
  }
`;

export const TopRow = styled(Row)`
  border-right: ${props => borderProp(props.theme)};

  @media (max-width: 425px) {
    border-bottom: ${props => borderProp(props.theme)};
  }
`;

export const BottomRow = styled(Row)`
  border-top: ${props => borderProp(props.theme)};
  border-right: ${props => borderProp(props.theme)};
`;

export const PriceHistoryContainer = styled.div`
  padding: 1rem 1rem;

  min-width: 18.75rem;

  display: flex;

  flex-direction: column;

  background-color: ${props => props.theme.white};

  border-radius: 0 0.25rem 0.25rem 0;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;

  span {
    padding-bottom: 0.5rem;

    color: ${props => props.theme.input.placeholder};
    font-weight: 400;
    font-size: 0.775rem;
    letter-spacing: 3px;
    text-align: center;
  }

  @media (max-width: 768px) {
    min-width: 13rem;
  }
`;

export const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;
`;

export const ChartContainer = styled.div`
  padding: 5rem 17.5rem 0 17.5rem;

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  gap: 2rem;

  border-radius: 0.25rem;

  @media (max-width: 1200px) {
    padding-left: 7rem;
    padding-right: 7rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    padding-left: 3rem;
    padding-right: 3rem;
  }
`;

export const ChartContent = styled.div`
  padding: 1rem 1.5rem 2rem 1.5rem;

  width: 100%;
  height: 20.31rem;

  background-color: ${props => props.theme.white};

  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;

  span {
    color: ${props => props.theme.input.placeholder};
    font-weight: 400;
  }
`;

export const TimeChart = styled(ChartContent)`
  text-align: center;
  padding: 1rem 0 4.1rem;

  @media (max-width: 425px) {
    &:first-child {
      margin-top: 10rem;
    }
  }
`;

export const Divider = styled.div`
  margin: 1rem 0;

  width: 100%;
  height: 1px;

  background-color: ${props => props.theme.border};
`;

export const ListContainer = styled.section`
  margin-top: 1.25rem;
  padding-bottom: 3rem;

  background-color: ${props => props.theme.background};
  width: 100%;
`;

export const ListHeader = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    color: ${props => props.theme.navbar.mobile};
    font-size: 1.25rem;
    font-weight: 500;
  }

  div {
    &:first-child {
      display: flex;

      flex-direction: row;
      align-items: center;
    }
  }
`;

export const ListHeaderIcon = styled.div`
  padding: 0.5rem;
  margin-right: 0.5rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-image: ${props => props.theme.button.background};

  color: ${props => props.theme.white};

  border-radius: 0.5rem;

  svg {
    font-size: 1.5rem;
  }
`;

export const ListContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 12.5rem;

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${transparentize(0.75, '#000')};
    }
  }
`;

export const ListItem = styled.div`
  padding: 0.5rem 0;

  display: flex;

  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  animation: 1s ease 0s 1 normal none running fadein;

  div {
    display: flex;
    flex-direction: column;
    width: 30%;
  }

  span {
    max-width: 10rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    color: black;
    font-weight: 400;
  }

  p {
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.input.placeholder};
  }

  a {
    background-image: ${props => props.theme.text.background};
    background-clip: text;
    -webkit-background-clip: text;

    color: transparent;

    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.rose};
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

export const ChartContentError = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
