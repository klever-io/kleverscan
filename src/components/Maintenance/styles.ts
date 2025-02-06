import styled from 'styled-components';

export const Picture = styled.picture`
  width: 500px;
  aspect-ratio: 1/1;

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
  }

  img {
    width: 500px;
    aspect-ratio: 1/1;

    @media (max-width: 768px) {
      width: 100%;
      position: absolute;
      filter: opacity(0.15) grayscale(100%);
    }
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: fit-content;
`;

export const TextWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: calc(100vh - 11.5rem);
  max-width: 50rem;

  top: 0px;
  @media (min-width: 768px) {
    height: fit-content;
    justify-content: center;
    top: -80px;
  }
`;

export const Title1 = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.black};
  font-family: 'Manrope';
  font-weight: 600;
  font-size: 24px;
  line-height: 32.8px;
  @media (min-width: 768px) {
    margin-top: 0;
    font-size: 3.5rem;
    line-height: 100%;
  }
`;

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const P1 = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.black};
  text-align: center;
  font-family: 'Manrope';
  font-weight: 400;
  font-size: 16px;
  line-height: 110%;
  @media (min-width: 768px) {
    margin-block: 2rem;
    font-size: 20px;
    line-height: 150%;
  }
`;

export const Title3 = styled.h3`
  text-align: center;
  color: ${({ theme }) => theme.black};
  font-family: 'Montserrat';
  font-weight: 500;
  margin-bottom: 0;
  font-size: 24px;
  line-height: 100%;
  @media (min-width: 768px) {
    font-size: 30px;
  }
`;

export const P2 = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.black};
  font-family: 'Manrope';
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
`;

export const LearnMore = styled.button`
  a {
    text-decoration: none;
    color: black;
  }
  width: 164px;
  height: 43px;
  padding: 24px 25px;
  gap: 8px;
  border-radius: 200px;
  background-color: ${({ theme }) => theme.black};
  color: black;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    margin-top: 1rem;
  }
`;
