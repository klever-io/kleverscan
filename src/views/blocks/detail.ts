import { default as DefaultInput } from '@/components/InputGlobal';
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

  border-color: ${props => props.theme.filter.border};
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

    color: ${props => props.theme.white};
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

    opacity: ${props => (props.selected ? 1 : 0.2)};

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
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
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

export const CenteredRow = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }

  strong {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    font-weight: 600;
    font-size: 0.85rem;
  }

  svg {
    cursor: pointer;
  }

  a {
    color: ${props => props.theme.black};
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const CenteredRowSpan = styled.span`
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const CommonSpan = styled.span`
  min-width: 12rem;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  strong {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.card.darkText};
  }

  small {
    font-weight: 400;
    font-size: 0.95rem;
    color: ${props => props.theme.card.darkText};
  }

  a {
    color: ${props => props.theme.black};
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme.card.darkText};
    font-weight: 400;
  }
`;

export const RowBlockNavigation = styled(CommonSpan)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const TooltipContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: auto;
`;

export const ToolTipStyle = styled.div`
  cursor: pointer;
  display: grid;
  place-items: center;
  height: 1.75rem;
  width: 1.75rem;
  background-color: ${props => props.theme.circleBackground.light};
  border-radius: 10rem;
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.violet};
  }
  > span > div {
    max-height: 20px;
    min-width: fit-content;
  }
`;
