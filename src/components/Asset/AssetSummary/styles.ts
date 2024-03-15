import styled, { css } from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const PageTitle = styled.h1`
  font-size: 1.25rem !important;
`;

export const AssetTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;

    align-items: flex-start;
  }
`;

export const AssetHeaderContainer = styled.div`
  background-color: transparent !important;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
  color: ${props => props.theme.black} !important;
  &:hover {
    cursor: default;
  }
  h1 {
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  p {
    margin-top: 0.25rem;
    color: ${props => props.theme.darkText} !important;
  }

  a {
    color: ${props => props.theme.black} !important;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AssetTypeContainer = styled.div`
  padding: 0.5rem 1rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.card.assetText};

  color: ${props => props.theme.true.white};
  font-weight: 400;
  font-size: 0.85rem;

  border-radius: 1rem;
`;

export const AssetSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 40px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  padding-top: 20px;

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    padding-top: 40px;
    padding-bottom: 80px;
  }
`;

export const About = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 80px 0;

  h2 {
    color: ${({ theme }) => theme.black};
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;

    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    color: ${({ theme }) => theme.darkText};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

export const EditContainer = styled.div`
  width: 32px;

  display: grid;
  place-items: center;

  cursor: pointer;
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;

  max-width: 565px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.darkText};

  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`;
export const SocialNetworks = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  gap: 16px;
`;

export const LinkStyles = styled.a`
  background-color: white;
  display: grid;
  place-items: center;

  padding: 6px;
  border-radius: 24px;

  cursor: pointer;

  svg {
    path {
      fill: ${({ theme }) => theme.violet};
    }
  }
`;

export const RightSide = styled.div`
  position: relative;

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 420px;
  }
`;

export const BackgroundImage = styled.div`
  filter: saturate(10%) opacity(7%);

  object-fit: cover;

  width: 550px;
  height: 450px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-40%) translateX(-50%);

  img {
    mask-image: linear-gradient(
        to top,
        transparent 0%,
        white 10% 90%,
        transparent 100%
      ),
      linear-gradient(to left, transparent 0%, white 10% 90%, transparent 100%);

    mask-position: center;
    mask-repeat: no-repeat;
    mask-composite: intersect;
  }
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.darkText};
  font-weight: 300;
  font-size: 0.875rem;
  line-height: 1rem;
`;

export const CardContainer = styled.div`
  background-image: url('/images/faq_card.svg');
  background-size: contain;
  background-repeat: no-repeat;

  max-width: 420px;
  aspect-ratio: 2.26;

  padding-top: 29px;
  padding-left: 53px;
  padding-right: 35px;

  display: flex;
  flex-direction: column;

  position: relative;
  z-index: 2;

  gap: 16px;
`;

export const TotalRaised = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const TotalRaisedValue = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

export const Progress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.lightGray};
  color: ${({ theme }) => theme.darkText};
  border-radius: 4px;
`;

export const ProgressFill = styled.div<{ fillWidth: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.violet};
  border-radius: 4px;
  width: ${props => props.fillWidth * 100}%;
`;

export const DetailsRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const Rate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailsValue = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1rem;
`;

export const EndTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ParticipateButton = styled.button<{ secondary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 14px 0;
  border-radius: 24px;

  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.violet};

  background-color: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white} !important;

  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1;
  text-decoration: none;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    filter: brightness(1.2);
  }

  ${({ theme, secondary }) =>
    secondary &&
    css`
      background-color: transparent;
      color: ${theme.black};
    `}
`;
