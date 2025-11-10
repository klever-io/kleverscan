import { TableRowElementProps } from '@/types';
import { transparentize, lighten } from 'polished';
import styled, { css } from 'styled-components';

export const SpanBold = styled.span`
  font-weight: 700 !important;
`;

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  margin-top: 40px;
`;

export const SpacedContainer = styled(Container)`
  gap: 32px;
`;

export const Header = styled.section<{ filterOn?: boolean }>`
  display: flex;

  flex-direction: ${props => (props.filterOn ? 'column' : 'row')};
  justify-content: space-between;
  align-items: ${props => (props.filterOn ? 'flex-start' : 'center')};

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

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const CardContainer = styled.section`
  margin: 1.5rem 0;
  width: 100%;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const DefaultCardStyles = css`
  background-color: ${props =>
    props.theme.dark ? props.theme.table.background : props.theme.white};
`;

export const DefaultCardStyleWithBorder = css`
  ${DefaultCardStyles}

  border: 1px solid ${props =>
    props.theme.dark ? props.theme.black20 : props.theme.black10};
  border-radius: 24px;
`;

export const Card = styled.div`
  ${DefaultCardStyleWithBorder}

  width: 100%;
  padding: 1.5rem;
  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  gap: 1rem;

  color: ${props => props.theme.black};

  span {
    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  div {
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span:nth-child(2) {
      text-align: right;
    }
    p:nth-child(2) {
      text-align: right;
    }

    strong {
      font-weight: 600;
    }

    p {
      opacity: 0.7;

      font-size: 0.85rem;
      font-weight: 400;
      color: ${props => props.theme.darkText};
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
`;

export const tableEffects = css`
  div > div:first-child {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes fadeInOpacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  div > div:not(:first-child) {
    opacity: 1;
    animation-name: down;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes down {
      0% {
        transform: translateY(-50%);
      }

      100% {
        transform: translateY(0%);
      }
    }
  }
`;

export const RowAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  span {
    font-size: 14px;
    font-weight: 400;
    background-color: #f8496033;
    padding: 2px 4px;
    border-radius: 4px;
    color: ${({ theme }) => theme.black};
  }
  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        props.theme.dark ? props.theme.black10 : props.theme.lightGray};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;

export const Row = styled.div<{ isMobileRow?: boolean }>`
  width: 100%;

  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        props.theme.dark ? props.theme.black10 : props.theme.lightGray};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  > span {
    &:first-child {
      width: 10rem;
      flex-direction: column;
    }
  }

  span {
    width: fit-content;
    max-width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
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
  > strong {
    min-width: 8rem;
    font-weight: 600;
    color: ${props => props.theme.darkText};
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    ${props =>
      props.isMobileRow &&
      css`
        flex-direction: row;
        align-items: center;
      `}
  }
`;

export const RowContent = styled.div`
  width: 100%;
  min-width: 30%;
`;

export const DoubleRow = styled.div<TableRowElementProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 10px;

  width: 100%;

  ${props =>
    props.$smaller &&
    css`
      gap: 4px;
    `}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 4px;
  }
`;

export const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  gap: 0.5rem;

  width: 100%;

  overflow: visible;

  strong {
    font-weight: 600;
  }

  a {
    color: ${props => props.theme.black};

    font-weight: 600;

    padding-bottom: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-weight: 600;
  }

  svg {
    cursor: pointer;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    span,
    a,
    p {
      min-width: fit-content;
    }
  }
`;

export const Mono = styled.span`
  font-family: 'Fira Mono', monospace;
`;

export const FrozenContainer = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  border: 1px solid ${props => props.theme.black20};
  border-radius: 0.75rem;

  div {
    overflow: hidden;
    padding: 1.25rem 2rem;

    display: flex;

    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.black20};
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    strong {
      width: 10rem;
      margin-right: 5px;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    span {
      color: ${props => props.theme.darkText};
      padding-right: 1rem;
      min-width: 10rem;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;

  flex-direction: row;
  overflow-x: auto;
`;

export const CardTabContainer = styled.div`
  display: flex;

  flex-direction: column;
`;

export const CardContent = styled.div`
  ${DefaultCardStyles};
  width: 100%;

  border-radius: 0.75rem;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  border-bottom: none;
  border-right: none;
  box-shadow: none;
  padding: 1rem;

  border-radius: 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};
    white-space: nowrap;

    opacity: ${props => (props.selected ? 1 : 0.33)};

    ${props =>
      props.selected &&
      css`
        border-bottom: 2px solid ${props => props.theme.violet};
      `}
  }
`;

export const DefaultScrollBar = css`
  &::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  &::-webkit-scrollbar-track {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.1);
    background: transparent;
    cursor: pointer !important;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => transparentize(0.2, props.theme.violet)};
    border-radius: 10px;
    cursor: pointer !important;
  }
`;

export const FlexSpan = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
`;

interface IStatus {
  status: string;
}

export const Status = styled.div<IStatus>`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 0.9rem;

  svg {
    min-width: 24px;
  }

  span {
    color: ${props =>
      props.status === 'ApprovedProposal'
        ? props.theme.table['success']
        : props.theme.table[
            props.status as keyof typeof props.theme.table
          ]} !important;
    font-weight: bold;
  }

  p {
    color: ${props =>
      props.theme.table[
        props.status as keyof typeof props.theme.table
      ]} !important;
    text-transform: capitalize;
  }

  ${props =>
    props.status === 'inactive' &&
    `
      color: ${props.theme.table.icon} !important;
      
    `}
`;
export const CustomLink = styled.a<{
  tabAsset?: boolean;
  fullWidth?: boolean;
  secondary?: boolean;
}>`
  align-self: end;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;

  height: 34px !important;

  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: ${props => (props.tabAsset ? '500' : '600')}!important;

  min-width: 8rem;
  max-width: 15rem;

  background: ${props => (props.tabAsset ? '' : props.theme.violet)};
  color: ${props =>
    props.tabAsset ? props.theme.black : props.theme.true.white} !important;
  border: 1px solid ${props => transparentize(0.75, props.theme.black)};
  border-radius: 24px;

  cursor: pointer;

  transition: all 0.1s ease;

  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
      min-width: 0;
      max-width: 100%;
    `}

  ${props =>
    props.secondary &&
    css`
      background: transparent;
      color: ${props.theme.violet} !important;
      border: 1px solid ${props.theme.violet};

      &:hover {
        background: ${props.theme.violet};
        color: ${props.theme.true.white} !important;
      }
    `}

  &:hover {
    background: ${props => props.theme.violet};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

export const ButtonVote = styled.button<{
  disabled?: boolean;
  buttonStyle?: 'primary' | 'secondary';
}>`
  color: ${props => props.theme.black};
  background-color: transparent;
  border: 1px solid
    ${props => (!props.disabled ? props.theme.violet : props.theme.darkGray)};

  font-size: 0.875rem;
  line-height: 1.25rem;

  align-self: end;

  min-width: 8rem;
  width: 100%;
  max-width: 15rem;

  padding: 4px 16px;
  border-radius: 24px;

  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  transition: all 0.1s ease;

  > span {
    color: ${props => props.theme.black} !important;
  }

  &:active {
    transform: ${props => (!props.disabled ? 'translateY(0.1rem)' : 'none')};
  }

  &:hover {
    background-color: ${props =>
      props.disabled ? props.theme.darkGray : props.theme.violet};
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  }

  ${props =>
    props.buttonStyle === 'primary' &&
    css`
      background-color: ${props.theme.violet};
      border: 1px solid ${props.theme.violet};

      &:hover {
        background-color: ${lighten(0.1, props.theme.violet)};
      }
    `}

  opacity: ${props => (props.disabled ? '0.3' : '1')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 100%;
  }
`;

export const SponsoredContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0 20px 0;
  gap: 8px;

  span {
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #c6c7eb;
  }
`;

export const SponsoredTitleSection = styled.div`
  width: 100%;
  height: 44px;
  border-radius: 200px;
  padding: 10px 12px;
  gap: 8px;
  background-color: #1f1f24;
`;

export const Badge = styled.span<{
  active: boolean;
}>`
  display: flex;
  align-items: center;
  border-radius: 24px;
  border: 1px solid ${props => (props.active ? '#7D3FF1' : '#C81B3B')};
  background-color: ${props => (props.active ? '#7D3FF166' : '#C81B3B66')};
  padding: 4px 8px;
  gap: 4px;

  font-family: 'Manrope';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.darkText};
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const InvokeMethodBagde = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #4ebc87;
  background-color: ${({ theme }) =>
    theme.dark ? '#296b4b80' : transparentize(0.8, theme.table['success'])};
  padding: 4px 8px;

  font-family: 'Manrope';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  color: #4ebc87;
`;

export const CommonContainer = styled.div`
  margin-top: 60px;
`;

export const NftImageContainer = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NftImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

export const NftImageError = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffebee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #d32f2f;
`;

export const NftImageEmpty = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ViewToggleContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
`;

export const ViewToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid
    ${({ theme, active }) => (!active ? theme.violet : 'transparent')};
  background: ${({ theme, active }) => (active ? theme.violet : 'transparent')};
  color: ${({ theme, active }) => (active ? 'white' : theme.black)};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding: 16px;

  button {
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.black};
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.gray};
      border-color: ${({ theme }) => theme.violet};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 14px;
    color: ${({ theme }) => theme.gray800};
  }
`;

export const NftSearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const NftInputContainer = styled.div`
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border-radius: 200px;
  border: 1px solid ${({ theme }) => theme.darkText};

  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    width: 100%;
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.gray800};

    &::placeholder {
      color: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }

  > svg {
    cursor: pointer;
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }
`;

export const NoNftsFound = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;
