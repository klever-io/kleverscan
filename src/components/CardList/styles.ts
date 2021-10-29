import styled, {css} from 'styled-components';

interface IStyle {
  transparent: boolean;
}

export const CardContainer = styled.div<IStyle>`
  padding: 1rem 5rem;
  margin-bottom: 0.5em; 
  margin-right: 0.5rem;

  display: inline-flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: center;
  
  ${props => props.transparent ? css`
    // If transparent flag
    border: 1px solid ${props.theme.card.border};
  ` : css `
    // if transparent flag nil
    background-image: ${props => props.theme.card.background};
  `}
  
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 100%;
    
    text-align: center;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  
  margin: 1rem 0 1rem;
`;

export const Title = styled.p<IStyle>`
  font-size: .9em;
  font-weight: normal;
  
  color: ${props => props.transparent ? props.theme.card.gray : props.theme.card.white}
`

export const Subtitle = styled.h1<IStyle>`
  font-weight: normal;
  
  color: ${props => props.theme.card[props.transparent ? 'black' : 'white']}
`