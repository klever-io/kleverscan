import { BsPersonSquare } from 'react-icons/bs';
import { RiCopperCoinLine } from 'react-icons/ri';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  margin: auto;
  width: 90%;
  max-width: 1200px;
  padding: 2rem 0;
`;

export const Header = styled.div`
  width: 100%;
  padding: 1rem;
  padding-bottom: 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.card.border};
`;

export const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;

  color: ${props => props.theme.white};
`;

export const ChooseContainer = styled.div`
  width: 100%;
  min-height: 20rem;

  display: flex;
  justify-content: space-around;

  padding: 1rem;
  border-radius: 1rem;

  margin: 1rem 0;

  background-color: ${props => props.theme.form.background};
`;

const BaseIconStyle = css`
  width: 100%;
  height: 3rem;

  transition: 0.2s ease-in-out;
`;

export const TokenIcon = styled(RiCopperCoinLine)`
  ${BaseIconStyle}
`;
export const NFTIcon = styled(BsPersonSquare)`
  ${BaseIconStyle}
`;

export const ChooseItemText = styled.span`
  transition: 0.2s ease-in-out;

  font-size: 1.2rem;
`;

export const ChooseItem = styled.button`
  width: 30%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;

  border: none;
  border-radius: 1rem;

  background-color: ${props => props.theme.card.border};

  transition: 0.2s ease;

  &:hover {
    background-color: '#AA33B5';

    ${ChooseItemText} {
      color: ${props => props.theme.white};
    }
    svg {
      color: ${props => props.theme.white};
    }
  }
`;

export const InputContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  padding-top: 3rem;

  position: relative;

  border-radius: 1rem;

  background-color: ${props => props.theme.form.background};
`;

export const ExtraOptionContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: ${props => props.theme.white};
`;
