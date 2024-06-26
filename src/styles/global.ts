import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
    font-family: "Manrope", sans-serif;
  }


  body {
    background: ${props => props.theme.background};
  }

  a, a:hover, a:focus, a:active {
    text-decoration: none;
    color: inherit;
    text-underline-offset: 0.2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    html {
      font-size: 93.75%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    html {
      font-size: 87.5%;
    }
  }

  body, input, textarea, button {
    font: 500 1rem "Manrope", sans-serif;
  }

  input {
    border: unset;
    
    background-color: transparent;

    &:focus {
      outline: unset;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    font-family: "Manrope", sans-serif;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button {
    cursor: pointer;

    background-color: transparent;

    border: unset;

    color: ${props => props.theme.white};
  }

  /* a {
    background-image: ${props => props.theme.text.background};
    background-clip: text;
    -webkit-background-clip: text;

    color: transparent;

    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.rose};
    }
  } */

  @keyframes fadein {
    from { 
      opacity: 0; 
    }

    to {
      opacity: 1;
    }
  }
`;
