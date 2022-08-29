import { lighten } from 'polished';
import { BsPersonSquare } from 'react-icons/bs';
import { IoMdCloseCircle } from 'react-icons/io';
import { RiCopperCoinLine } from 'react-icons/ri';
import styled, { css } from 'styled-components';

interface IContainer {
  loading?: boolean;
}

const defaultStyles = css`
  width: 100%;

  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.input.border.dark};
  border-radius: 0.5rem;

  color: ${({ theme }) => theme.input.border.dark};

  background-color: transparent;

  box-shadow: unset;

  font-weight: 500;

  transition: all 0.1s ease-in-out;
`;

export const CloseIcon = styled(IoMdCloseCircle).attrs(props => ({
  color: props.theme.form.hash,
  size: 24,
}))`
  min-width: 24px;
  cursor: pointer;
`;

export const Container = styled.div<IContainer>`
  margin: auto;
  width: 90%;
  max-width: 1200px;
  padding: 2rem 0;
  opacity: ${props => (props.loading ? 0.4 : 1)};

  @media screen and (max-width: 1025px) {
    width: 100%;
  }
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
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};

  justify-content: flex-start;
  align-items: center;

  gap: 1rem;

  padding-right: 2rem;

  a {
    padding-left: 2rem;
    color: ${props => props.theme.form.hash};
    font-weight: 600;

    text-decoration: none;

    &:hover {
      color: ${props => props.theme.form.hoverHash};
    }

    &:visited {
      color: ${props => props.theme.form.hash};
      &:hover {
        color: ${props => props.theme.form.hoverHash};
      }
    }

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  svg:last-of-type {
    margin-left: auto;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  background-color: ${props => props.theme.white};
  padding: 1.37rem;
  border-radius: 1rem;
  margin-top: 1rem;
  width: 100%;

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};
`;

interface ISelect {
  size?: number;
}

export const SelectContent = styled.div<ISelect>`
  display: flex;
  flex-direction: column;
  width: calc(50% - 0.5rem);

  max-width: ${props => (props.size ? `${props.size}%` : 'unset')};
  &:not(:first-child) {
    margin-left: 1rem;
  }
`;

export const AssetTriggerContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 3rem;
`;

export const FieldLabel = styled.label`
  user-select: none;
  font-size: smaller;
  font-weight: 600;
  display: flex;
  color: ${({ theme }) => theme.input.border.dark};
  margin-bottom: 0.3rem;
`;

export const BalanceLabel = styled.label`
  user-select: none;
  font-size: smaller;
  font-weight: 600;
  display: flex;
  color: ${({ theme }) => theme.input.border.dark};
  margin-bottom: 0.3rem;
`;

export const AssetIDInput = styled.input`
  height: 3rem;

  ${defaultStyles}
`;

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CardContainer = styled.div`
  margin-top: -0.7rem;
  width: 100%;
  max-width: 1200px;
  margin-bottom: -2rem;
  padding: 2rem 0;

  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;

  div {
    span {
      color: ${props => props.theme.form.sectionTitle};
    }
  }

  @media screen and (max-width: 1025px) {
    width: 100%;
  }
`;
