import styled from 'styled-components';

export const DetailsRow = styled.pre`
  width: 100%;
  color: ${props => props.theme.white};
  position: relative;
  border-bottom: 1px solid ${props => props.theme.card.border};
  border-top: 1px solid ${props => props.theme.card.border};

  height: 30rem;

  overflow: auto;
  scroll-behavior: unset;
`;

export const HiddenTextArea = styled.textarea`
  position: absolute;

  top: 1.2rem;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  color: transparent;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  padding: 0.5em;

  transition: none;

  overflow: hidden;
  scroll-behavior: unset;

  word-break: break-word;

  tab-size: 1ch;

  caret-color: ${props => props.theme.true.white};
`;

export const ErrorMessage = styled.div`
  margin: 10px;

  color: ${props => props.theme.status.error};
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    min-width: 32px;
  }
`;
