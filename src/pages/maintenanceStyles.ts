import styled from 'styled-components';

export const Main = styled.main`
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: black;
`;

export const Title1 = styled.h1`
  text-align: center;
  margin: 20px;
  color: white;
  font-family: 'Manrope';
  font-weight: 700;
  font-size: 36px;
  line-height: 32.8px;
  @media (min-width: 768px) {
    font-family: 'Manrope';
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
  }
`;

export const P1 = styled.p`
  text-align: center;
  margin: 10px 20px 20px 20px;
  color: white;
  text-align: center;
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 16px;
  line-height: 16.8px;
  @media (min-width: 768px) {
    font-family: 'Manrope';
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
  }
`;

export const Title3 = styled.h3`
  text-align: center;
  color: white;
  font-family: 'Montserrat';
  font-weight: 700;
  margin-bottom: 0;
  font-size: 24px;
  line-height: 16.8px;
  @media (min-width: 768px) {
    font-family: 'Montserrat';
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
  }
`;

export const P2 = styled.p`
  text-align: center;
  color: white;
  font-family: 'Manrope';
  font-weight: 600;
  font-size: 16px;
  line-height: 30px;
  @media (min-width: 768px) {
    font-family: 'Manrope';
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
  }
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
  background-color: white;
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
`;
