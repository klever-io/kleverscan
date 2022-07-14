import styled, { css } from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Form } from '@unform/web';

interface IButton {
  submit?: boolean;
}

export const FormBody = styled(Form)``;

export const FormSection = styled.div<{ inner?: boolean }>`
  margin-top: 1rem;
  padding: 1.5rem;
  padding-top: 3rem;
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  grid-auto-columns: auto;
  column-gap: 1rem;
  row-gap: 3rem;

  border-radius: 1rem;

  &:not(:first-child) {
    padding-top: 5rem;
  }

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.8, '#000')};

  background-color: ${props => props.theme.form.background};
  ${props =>
    props.inner &&
    css`
      filter: brightness(97%);
      grid-column: auto / span 2;
    `}

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    padding: 0.5rem;
    padding-top: 5rem;

    ${props =>
      props.inner &&
      css`
        margin-top: -1rem;
      `}
  }
`;

export const SectionTitle = styled.div`
  font-size: 1.2rem;
  width: calc(100% - 2rem);
  font-weight: 600;
  display: flex;
  color: ${props => props.theme.form.sectionTitle};
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

export const TooltipSpace = styled.div`
  margin-left: 0.4rem;
  position: absolute;
  left: 2rem;
  bottom: 3rem;
`;

export const InputWrapper = styled.div``;

export const ButtonContainer = styled.button<IButton>`
  background-color: #7B7DB2;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  margin-top: ${props => (props.submit ? 1.7 : 0)}rem;
  cursor: pointer;
`;
