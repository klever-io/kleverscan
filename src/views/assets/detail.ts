import { default as DefaultInput } from '@/components/InputGlobal';
import { EmptyRow } from '@/components/Table/styles';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

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

export const CardContainer = styled.div`
  margin-top: 2rem;

  display: flex;

  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  overflow: auto;
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

export const SectionTitle = styled.h2`
  font-weight: 600;
  font-size: 1.25rem;
  color: ${props => props.theme.black};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

export const Row = styled.div<{ span?: number }>`
  width: 100%;
  padding: 0.75rem 1rem;
  gap: 4px;

  position: relative;

  display: flex;
  flex-direction: column;

  color: ${props => props.theme.black};

  grid-column: auto / span 1;

  > span {
    &:first-child {
      text-transform: capitalize;

      min-width: 11rem;
      max-width: 11rem;
    }
    overflow: hidden;

    strong {
      font-weight: 500;
      font-size: 0.95rem;
      color: ${props => props.theme.black};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.black};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.black};
      font-weight: 400;
    }
  }

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    line-height: 1.5rem;
    word-break: break-all;
  }

  &:after {
    content: '';
    position: absolute;
    border-bottom: 1px solid ${props => props.theme.faq.border};
    bottom: 0px;

    left: 0;
    height: 1px;
    width: 500%;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    ${props =>
      props.span &&
      css`
        grid-column: auto / span ${props.span};
      `}
    padding: 1.5rem 2rem;
  }
`;

export const AssetEmptyRow = styled(EmptyRow)`
  grid-column: 1 / -1;
`;

export const FPRRow = styled(Row)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 1px solid ${props => props.theme.gray800};
  border-right: 1px solid ${props => props.theme.gray800};
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-items: center;
  }

  &:after {
    width: 100%;
  }
`;

export const ExpandableRow = styled(Row)<{ expandVar: boolean }>`
  ${props =>
    props.expandVar &&
    `
flex-direction: column !important;
align-items: start !important;
`}
`;

export const WhiteListRow = styled(Row)<{ expandVar: boolean }>`
  ${props =>
    props.expandVar &&
    `
flex-direction: column !important;
align-items: start !important;
`}
`;

export const ExpandWrapper = styled.div<{ expandVar: boolean }>`
  display: flex;
  flex-direction: row !important;
  align-items: center;

  span {
    overflow: hidden;

    text-overflow: ellipsis;
    white-space: normal !important;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 0.5rem;
  }

  ${props =>
    !props.expandVar &&
    `
flex-direction: column;
`}
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

export const UriContainer = styled.div`
  overflow-x: auto;
  width: 95%;
`;

export const FrozenContainer = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  border: 1px solid ${props => props.theme.black};
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
    padding: 1.1rem 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 1rem;
    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.black};
      border-width: 100%;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    strong {
      min-width: 15rem;
      font-weight: 600;
      color: ${props => props.theme.black};
    }

    span {
      color: ${props => props.theme.black};
    }
    p {
      font-weight: 400;
      font-size: 15px;
      min-width: 50px;
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

export const FPRFrozenContainer = styled(FrozenContainer)`
  margin: 0.5rem;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: 26rem;
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
  > span {
    flex-direction: column;
    min-width: 15rem !important;
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
  > span:nth-child(2) {
    margin-left: 0px;
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
    max-height: 450px;
    justify-content: center;
    > span {
      min-width: 18.5rem !important;
      min-height: 100px;
      max-width: 140px;
    }
    span:nth-child(2) {
      margin-left: 0px !important;
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

export const AddressDiv = styled.span`
  margin-left: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EllipsisSpan = styled.span`
  max-width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 95%;
    @media (min-width: ${props => props.theme.breakpoints.mobile}) {
      width: 100%;
    }
  }
`;

export const StakingHistoryBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  grid-column: auto / span 2;
  border: 1px solid ${props => props.theme.gray800};
  color: ${props => props.theme.black};

  strong {
    font-weight: 600;
    font-size: larger;
    color: ${props => props.theme.black};
    margin-right: 0.2rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    padding: 1.5rem;
    max-height: 68px;
    gap: 0;
  }
`;

export const StakingHistoryHeader = styled(StakingHistoryBase)`
  position: sticky;
  top: 0;
  z-index: 1;

  padding: 1rem;
  border-radius: 10px 10px 0 0;
  background-color: ${props => props.theme.background};
`;

export const StakingHistoryFooter = styled(StakingHistoryBase)`
  position: sticky;
  bottom: 0;

  border-radius: 0 0 10px 10px;
  background-color: ${props => props.theme.background};

  strong {
    font-size: medium;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const StakingHistoryScrollFooter = styled(StakingHistoryFooter)`
  border-radius: unset;
  padding: 1rem;
`;

export const TitleWrapper = styled.div`
  display: flex;

  span:nth-child(2) {
    margin-left: 1.5rem;
    margin-right: 1.5rem;

    padding: 0.5rem;
    background-color: rgb(98, 99, 162);
    border-radius: 5px;
  }
`;

export const StakingHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: ${props => props.theme.black};
  p,
  strong {
    font-weight: 600;
    font-size: larger;
  }
`;

export const StakingHeaderSpan = styled.span`
  padding-left: 0 !important;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding-left: 0 !important;
  }
`;

export const NoDepositsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    min-width: 26rem;
  }

  p {
    text-align: center;
  }
`;
export const FallbackFPRRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: stretch;
  flex-direction: column;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    width: initial;
  }
`;

export const HistoryWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: stretch;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const EpochDepositsWrapper = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    justify-content: flex-start;
    overflow: auto;
  }
`;

export const EpochWrapper = styled.div`
  display: flex;
  flex-direction: column;
  span {
    &:first-child {
      @media (min-width: ${props => props.theme.breakpoints.mobile}) {
        min-width: 11rem;
      }
    }
    &:nth-child(2) {
      margin-left: 1rem;
    }
    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.theme.black};

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.black};
    }
  }
`;

export const EpochGeneralData = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-content: center;
  gap: 2rem;
  min-height: 182px;
  height: 100%;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.black};
  text-align: center;
  margin: 0.5rem;
  color: ${props => props.theme.black};
`;

export const ShowDetailsButton = styled.button`
  font-weight: 600;
  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.footer.border};
  :hover {
    text-decoration: underline;
  }
`;
