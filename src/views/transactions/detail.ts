import { default as DefaultInput } from '@/components/InputGlobal';
import {
  CenteredRow as DefaultCenteredRow,
  Row as DefaultRow,
} from '@/styles/common';
import styled, { css, DefaultTheme, StyledComponent } from 'styled-components';

interface IExpandCenteredRow {
  openJson?: boolean;
}

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

export const Row = styled(DefaultRow)`
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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Panel = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  padding: 1rem 1rem 1rem 10rem;
  transition: max-height 0.2s ease-out;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem 1rem 1rem 1rem;
  }
`;

export const CenteredRow = styled(DefaultCenteredRow)`
  overflow: hidden;
  flex-direction: row;

  flex-wrap: nowrap;

  span {
    line-height: 2rem;
  }
`;

export const ExpandCenteredRow: StyledComponent<
  'div',
  DefaultTheme,
  { openJson?: boolean | undefined },
  never
> = styled(DefaultCenteredRow)<{ openJson?: boolean }>`
  align-items: flex-start !important;
  justify-content: space-between;
  ${props =>
    props.openJson &&
    css`
      align-items: normal;

      span {
        align-self: normal;
        white-space: normal;
        word-break: break-all;
      }
    `};
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
  background: ${props =>
    props.theme.dark
      ? props.theme.card.border
      : props.theme.modalBackground.background};
  padding: 0.2rem;
  border-left: 0;
  border-right: 0;
  border-bottom: 5rem;
  border-color: ${props =>
    props.theme.dark ? props.theme.card.border : props.theme.white};
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
  span {
    min-width: 10rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    span:nth-child(1) {
      margin-top: 1rem;
    }
    span {
      min-width: initial;
    }
  }
`;

export const HeaderSpan = styled.span`
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: 10rem;
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

export const FrozenContainer = styled.div`
  margin-top: 0.5rem;
  width: 100%;

  display: flex;

  flex-direction: column;

  background-color: ${props => props.theme.accountCard.frozenBackground};

  border-radius: 0.75rem;

  > div {
    padding: 1.25rem 2rem;

    display: flex;

    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.card.border};

      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    strong {
      width: 10rem;
      margin-right: 5px;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    > span {
      color: ${props => props.theme.darkText};
    }
  }
`;

export const KdaFeeSpan = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span:nth-child(2) {
    margin-top: 0.2rem;
  }
`;

export const ExpandRow = styled(DefaultRow)<{ expandVar: boolean }>`
  ${props =>
    props.expandVar &&
    ` 
flex-direction: column !important;
align-items: start !important;
`}
`;

export const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const EllipsisSpan = styled.span`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* width: 95%; */
    @media (min-width: ${props => props.theme.breakpoints.mobile}) {
      width: 100%;
    }
  }
`;

export const StatusIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  strong {
    min-width: 9rem;
  }
`;

export const PropertiesWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
  div {
    div {
      margin-bottom: 0.5rem;
    }
  }
`;

export const RoyaltiesChangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CenteredDiv = styled.div`
  display: flex;
  font-weight: 600;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
`;

export const NonceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3rem, 1fr));
  width: 100%;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(8, 2fr);
    width: initial;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: initial;
    grid-template-columns: repeat(11, 2fr);
  }
`;

export const NonceSpan = styled.span`
  background-color: ${props => props.theme.navbar.text};
  width: 2.7rem;
  height: 3.2rem;
  display: grid;
  place-items: center;
  margin: 0.6rem;
  border-radius: 4px;
  color: ${props => props.theme.true.white};
`;
