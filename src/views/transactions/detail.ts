import { default as DefaultInput } from '@/components/InputGlobal';
import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  gap: 0.5rem;
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
    cursor: pointer;
  }

  svg {
    overflow: visible;
    position: relative;
    left: 0.2rem;
    top: 0.5rem;
  }

  h1 > p {
    display: inline-block;
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};

  input {
    min-width: 12rem;
  }

  @media (max-width: 1204px) {
    flex: 1;
  }
`;

export const CardContainer = styled.div`
  margin-top: 2rem;

  display: flex;

  flex-direction: column;

  color: ${props => props.theme.black};
`;

export const CardContent = styled.div`
  margin: 1.25rem 0;

  background-color: ${props => props.theme.white};

  border-radius: 0.75rem;
`;

export const Row = styled.div`
  width: 100%;

  padding: 1.2rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  > span:first-child {
    min-width: 10rem;
  }

  span {
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 100%;
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

      overflow: hidden;

      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }
  .accordion-disabled {
    display: flex;
    color: black;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.4s;
  }
  .accordionHeader {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .accordion-active {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.4s;
    .icon {
      transform: rotate(45deg);
    }
  }

  /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */

  /* Style the accordion panel. Note: hidden by default */
  .panel {
    gap: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 1rem 10rem;
    transition: max-height 0.2s ease-out;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CenteredRow = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 0.5rem;

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

export const ExpandCenteredRow = styled(CenteredRow)<{ openJson?: boolean }>`
  align-items: ${props => (props.openJson ? 'normal' : 'center')};
  justify-content: space-between;
`;

export const DivDataJson = styled.div`
  overflow: auto;
  position: relative;
  span {
    min-width: auto !important;
  }
`;
export const IconsWrapper = styled.div`
  display: flex;
  justify-content: center;

  svg {
    margin-top: 0.25rem;
  }
`;

export const ButtonExpand = styled.button`
  color: ${props => props.theme.true.white};
  margin-right: 0.3rem;
  text-align: center;
  width: 5.5rem;
  height: 2rem;
  padding: 0.4rem;
  border-radius: 0.3rem;
  background-color: ${props => props.theme.purple};
  border: 1px solid ${props => props.theme.purple};
`;

export const CardRaw = styled.div`
  margin: 1.25rem 1.25rem;
  font-weight: 400;
  font-size: 0.85rem;
  overflow: auto;
  flex-direction: row;
  align-items: center;
`;

export const Hr = styled.hr`
  padding: 0.08rem;
  background: #ebf1f7;
  padding: 0.2rem;
  border-radius: 4px;
`;

export const NestedContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    span:nth-child(1) {
      margin-top: 1rem;
    }
  }
`;

export const KappFeeSpan = styled.span`
  display: flex;
  align-items: center;
  span {
    margin-left: 1rem;
    color: #7b7db2;
    font-weight: 400;
  }
`;

export const KappFeeFailedTx = styled.p`
  text-decoration: line-through;
  color: red !important;
`;

export const URIsWrapper = styled.div`
  display: flex;
  flex-direction: column !important;
  align-items: flex-start !important;

  overflow: scroll;
`;

export const RoleWrapper = styled.section`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

export const RoleDiv = styled.div`
  display: flex !important;
  flex-direction: row !important;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-items: flex-start !important;
    flex-direction: column !important;
  }
`;

export const RoleStrong = styled.strong`
  min-width: 7rem;
  margin-right: 1.5rem !important;
`;

export const HoverAnchor = styled.a`
  :hover {
    text-decoration: underline;
  }
`;

export const StrongWidth = styled.strong`
  display: inline-block;
  min-width: 15rem !important;
`;
