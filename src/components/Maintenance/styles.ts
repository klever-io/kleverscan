import styled from 'styled-components';

export const Picture = styled.picture`
  width: 500px;
  aspect-ratio: 1/1;

  @media (max-width: 768px) {
    max-width: 400px;
    width: 100%;
  }

  img {
    width: 500px;
    aspect-ratio: 1/1;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const TextWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-width: 50rem;
  top: -80px;

  @media (max-width: 768px) {
    gap: 2rem;

    margin: 10px;
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
  margin-bottom: 2rem;
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
  line-height: 110%;
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
  line-height: 150%;
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
