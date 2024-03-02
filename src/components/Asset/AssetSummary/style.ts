import Image from 'next/image';
import styled from 'styled-components';

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
  justify-content: center;
  gap: 24px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding-top: 20px;

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    padding: 0;
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
  }

  p {
    color: ${({ theme }) => theme.lightGray};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;

  max-width: 565px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.lightGray};

  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`;
export const SocialNetworks = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

export const RightSide = styled.div`
  position: relative;
`;

export const BackgroundImage = styled(Image)`
  filter: saturate(10%) opacity(7%);

  object-fit: cover;

  position: relative;
  top: 50%;
  /* transform: translateY(-50%); */

  width: 550px;
  height: 450px;
`;
