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
  }

  @media (max-width: 555px) {
    padding: 0;

    text-align: center;

    p {
      display: block;
    }
  }
`;

export const Container = styled.div`
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
  padding: 1rem 1.5rem;

  min-width: 18.75rem;

  display: flex;

  flex-direction: column;

  background-color: ${props => props.theme.white};

  border-radius: 0 0.25rem 0.25rem 0;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;

  span {
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
