import styled, { css, keyframes } from 'styled-components';

export const FadeIn = keyframes`
  from {
    opacity: 0.1;
    transform: translateX(-25%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-25%) translateY(0);
  }
`;

export const UserInfoContainer = styled.div<{
  openUserInfos: boolean;
  isMobile: boolean;
}>`
  position: fixed;
  top: 4.4rem;
  right: 0rem;
  z-index: 7;
  width: ${props => (props.isMobile ? '95vw' : '25rem')};
  max-width: 25rem;
  max-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  visibility: ${props => (props.openUserInfos ? 'visible' : 'hidden')};
  opacity: ${props => (props.openUserInfos ? '1' : '0')};
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => (theme.dark ? '#12121b' : '#F8FAFC')};
  border-radius: 1rem 0 0 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: opacity 0.1s linear;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: unset;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.3rem;
  }
`;

export const HeaderInfo = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  color: ${props => props.theme.true.white};
  font-size: 1.2rem;
  font-weight: 400;

  div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  p {
    font-size: 1rem;
  }
`;

export const MyWalletContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  color: ${props => props.theme.true.white};
  border: 1px solid ${({ theme }) => (theme.dark ? '#181935' : '#4D4D4D')};
  border-radius: 8px;

  small {
    font-weight: 400;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    small {
      padding-top: 0.5rem;
    }
  }
`;

export const MyProjectsContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  color: ${props => props.theme.true.white};
  background-color: #13131d;
  border: 1px solid ${({ theme }) => (theme.dark ? '#181935' : '#4D4D4D')};
  border-radius: 8px;

  small {
    font-weight: 400;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    small {
      padding-top: 0.5rem;
    }
  }
`;

export const MyProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    small {
      padding-top: 0.5rem;
    }
  }
`;

export const QRCodeContent = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 1rem;

  div {
    --size: 80px;
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
    background-color: #fff;
    border-radius: 0.2rem;

    svg {
      width: 100%;
      height: 100%;
      margin: auto;
    }
  }
`;

export const MyWalletContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => (theme.dark ? '#181821' : '#1E1E1E')};
  border-radius: 0.5rem;
`;

export const AssetItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0 1rem;
  cursor: pointer;
`;

export const AssetContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const AssetName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.dark ? '#FFFFFF' : '#1E1E1E')};

  p:nth-child(2) {
    font-size: 0.625rem;
    font-weight: 700;
    color: ${({ theme }) => (theme.dark ? '#B7BDC6' : '#6F6F6F')};
  }
`;

export const AssetPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.dark ? '#FFFFFF' : '#1E1E1E')};
`;

export const MyWalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;

  div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const PrimaryAssetContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
`;

export const ReloadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 1.5rem;
`;

export const BalanceContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0 0 0 1.5rem;
  color: ${props => props.theme.violet};
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`;

export const ContainerAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const SpanDropdown = styled.div`
  display: flex;

  svg {
    cursor: pointer;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const IoReloadSharpWrapper = styled.div<{
  $loading: boolean;
}>`
  svg {
    margin-top: 0.3rem;
    margin-left: auto;
    color: ${props => props.theme.darkText};
    cursor: pointer;
    animation: ${props => (props.$loading ? rotate : 'none')} 1s linear infinite;
  }
`;

export const BodyContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  color: ${props => props.theme.lightGray};

  > div:nth-child(1) {
    border: none;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0.5rem;
  }
`;

export const SeeTokens = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: ${({ theme }) => (theme.dark ? '#FFFFFF' : '#1E1E1E')};
  font-size: 0.75rem;
  font-weight: 700;

  svg {
    path {
      stroke: ${props => (props.theme.dark ? '#FFFFFF' : '#1E1E1E')};
    }
  }
`;

export const Usage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #b7bdc6;
  font-size: 0.625rem;
  font-weight: 700;
`;

export const OwnedItem = styled.div<{
  secondary?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  position: static;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.5rem;
  color: ${props => props.theme.true.white};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

  svg {
    margin-left: auto;
    transition: transform 0.2s ease-in-out;

    ${props =>
      props.active &&
      css`
        transform: rotate(180deg);
      `}
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }
`;

export const AccordionContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  color: ${props => props.theme.true.white};
`;

export const TransactionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0.375rem;
  color: ${props => props.theme.true.white};
`;

export const TransactionContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.25rem;
  padding: 0.5rem;
  color: ${props => props.theme.true.white};
  background-color: #171723;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;

  p {
    font-size: 0.625rem;
    font-weight: 400;
  }

  h2 {
    font-size: 0.625rem;
    font-weight: 700;
    color: ${props => props.theme.gray700};
  }

  h3 {
    font-size: 0.875rem;
    font-weight: 400;
    color: ${props => props.theme.gray700};
  }

  h4 {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${props => props.theme.black};
  }
`;

export const TotalTransactions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.true.white};

  span {
    color: #4ebc87;
    font-size: 0.75rem;
    font-weight: 400;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #1e1e29;
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{
  percentage?: number;
}>`
  width: ${props => props.percentage}%;
  height: 100%;
  background-color: ${props => {
    const percentage = props.percentage;
    if (percentage <= 50) return '#4EBC87';
    if (percentage <= 75) return '#AF9500';
    if (percentage <= 90) return '#FF8008';
    return '#F84960';
  }};
  transition: width 0.3s ease;
`;

export const Pill = styled.div<{
  full?: boolean;
  bgColor?: string;
  borderColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.full ? '100%' : 'fit-content')};
  padding: 0.5rem 1rem;
  color: ${props => props.theme.true.white};
  background-color: ${props => props.bgColor};
  border: 1px solid ${props => props.borderColor || '#222345'};
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 700;
`;

export const ActionItem = styled.div<{
  secondary?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  position: static;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.5rem;
  color: ${({ theme }) => (theme.dark ? '#FFFFFF' : '#1E1E1E')};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  user-select: none;

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

  svg {
    &:nth-child(1) {
      path {
        fill: ${props =>
          props.theme.dark ? props.theme.true.white : props.theme.true.black};
      }
    }

    &:nth-child(3) {
      margin-left: auto;
      transition: transform 0.2s ease-in-out;

      ${props =>
        props.active &&
        css`
          transform: rotate(180deg);
        `}
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }
`;

export const SubSection = styled.div<{ active?: boolean }>`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => (theme.dark ? '#222345' : '#E1E1E1')};

  ${props =>
    props.active &&
    css`
      display: flex;
      flex-direction: column;
      gap: 4px;
    `}
`;
