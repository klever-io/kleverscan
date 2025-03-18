import { transparentize } from 'polished';
import { MdArrowDropDown } from 'react-icons/md';
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

  visibility: ${props => (props.openUserInfos ? 'visible' : 'hidden')};
  opacity: ${props => (props.openUserInfos ? '1' : '0')};

  transition: opacity 0.1s linear;

  /* background-color: ${props => props.theme.card.background}; */

  background-color: #12121b;

  display: flex;
  flex-direction: column;

  width: ${props => (props.isMobile ? '95vw' : '25rem')};
  max-width: 25rem;
  /* border: 1px solid ${props => props.theme.card.border}; */
  border-radius: 1rem 0 0 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

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

  /* padding-inline-start: 0.75rem;
  padding-inline-end: 0.75rem; */
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
  gap: 0.5rem;
  display: flex;
  flex-direction: column;

  border: 1px solid #181935;
  border-radius: 8px;

  padding: 0.5rem;

  color: ${props => props.theme.true.white};

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

  border: 1px solid #181935;
  background-color: #13131d;
  border-radius: 8px;

  padding: 0.5rem;

  color: ${props => props.theme.true.white};

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

    background-color: #fff;
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
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
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  background-color: #181821;
  border-radius: 0.5rem;
  padding: 1rem;
`;

export const AssetItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  cursor: pointer;
`;

export const AssetContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const AssetName = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  font-size: 0.875rem;
  p:nth-child(2) {
    color: ${props => props.theme.gray700};
    font-size: 0.625rem;
    font-weight: 700;
  }
`;

export const AssetPrice = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
  font-size: 0.875rem;
  p:nth-child(2) {
    color: ${props => props.theme.gray700};
    font-size: 0.75rem;
    font-weight: 400;
  }
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
  font-size: 1.5rem;
  gap: 0.5rem;
`;

export const ReloadContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  min-height: 1.5rem;
`;

export const BalanceContainer = styled.span`
  font-weight: 600;
  color: ${props => props.theme.violet};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0 0 0 1.5rem;
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

export const DropdownIcon = styled(MdArrowDropDown)<{
  $openOtherAssets: boolean;
}>`
  font-size: 2rem;
  transform: rotate(${props => (props.$openOtherAssets ? 0 : 180)}deg);
`;

export const OtherAssetsContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  max-width: 30rem;
  min-width: 10rem;
  max-height: 15rem;
  overflow: auto;
  position: absolute;
  top: ${props => (props.isMobile ? '15rem' : '13.5rem')};
  left: ${props => (props.isMobile ? '8.5rem' : '6.2rem')};
  padding: 0.75rem 0.75rem;
  box-shadow:
    0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2),
    0 0.6rem 1rem 0 rgba(0, 0, 0, 0.19);
  background-color: ${props => props.theme.card.assetText};
  border-radius: 0.5rem;
  transform: translateX(-25%);
  animation: ${FadeIn} 0.1s ease-in-out;
  z-index: 2;

  div {
    display: flex;
    white-space: nowrap;
    cursor: pointer;
    gap: 0.4rem;
    width: 100%;
    max-height: 5rem;
    min-height: 1.6rem;
    justify-content: flex-end;
    padding-right: 0.5rem;
    padding-left: 0.3rem;
    align-items: center;

    &:hover {
      border-radius: 0.375rem;
      background-color: ${props => props.theme.footer.border};
      color: ${props => props.theme.true.white};
      font-weight: 500;
    }
  }
  span,
  p {
    text-overflow: ellipsis;
    font-weight: 600;
    color: ${props => props.theme.lightGray};
    font-size: 0.9rem;
  }

  &::-webkit-scrollbar {
    position: absolute;
    height: 0.5rem;
    width: 0.4rem;
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
    cursor: pointer;
    margin-top: 0.3rem;
    margin-left: auto;
    color: ${props => props.theme.darkText};
    animation: ${props => (props.$loading ? rotate : 'none')} 1s linear infinite;
  }
`;

export const BodyContent = styled.div`
  position: relative;

  width: 100%;
  color: ${props => props.theme.lightGray};

  display: flex;
  flex-direction: column;
  gap: 4px;

  > div:nth-child(1) {
    border: none;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0.5rem;
  }
`;

export const SeeTokens = styled.div`
  color: ${props => props.theme.true.white};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 0;
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

  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.true.white};

  cursor: pointer;
  user-select: none;

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }

  svg {
    margin-left: auto;

    transition: transform 0.2s ease-in-out;
    ${props =>
      props.active &&
      css`
        transform: rotate(180deg);
      `}
  }
`;

export const AccordionContent = styled.div`
  color: ${props => props.theme.true.white};

  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;
`;

export const TransactionContainer = styled.div`
  color: ${props => props.theme.true.white};
  gap: 0.375rem;

  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const TransactionContent = styled.div`
  color: ${props => props.theme.true.white};

  background-color: #171723;

  border-radius: 0.5rem;

  padding: 0.5rem;

  gap: 0.25rem;

  display: flex;
  flex-direction: column;
  width: 100%;

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

export const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #1e1e29;
  border-radius: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{
  percentage?: number;
}>`
  height: 100%;
  width: ${props => props.percentage}%;
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
  background-color: ${props => props.bgColor};
  padding: 0.5rem 1rem;
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.borderColor || '#222345'};
  color: ${props => props.theme.true.white};
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 2rem;
  ${props =>
    props.full &&
    css`
      width: 100%;
    `}
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

  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.true.white};

  cursor: pointer;
  user-select: none;

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }

  svg {
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
`;

export const SubSection = styled.div<{ active?: boolean }>`
  ${props =>
    props.active &&
    css`
      display: flex;
      flex-direction: column;
      gap: 4px;
    `}

  padding: 1rem;
  border-top: 1px solid #222345;
`;
