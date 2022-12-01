import styled from 'styled-components';

export const Container = styled.div`
  padding: 10rem;

  display: flex;

  flex-direction: row;
  justify-content: center;

  background-color: ${props => props.theme.background};

  div div:last-child span {
    color: white;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 3rem;
    align-items: center;

    flex-direction: column-reverse;
  }
`;

export const MaintenanceImage = styled.img`
  z-index: 10;
  background: '';
  margin: auto;
  width: 100%;
  height: 50vh;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const Message = styled.div`
  span {
    color: ${props => props.theme.black};
    font-weight: 500;
    font-size: 5rem;
    font-family: Rubik, sans-serif;

    text-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: min(4rem, 50vw);
    }
  }
`;
