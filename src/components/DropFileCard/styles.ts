import { darken, lighten, transparentize } from 'polished';
import styled, { css } from 'styled-components';

interface IDropZoneProps {
  isDragging: boolean;
}

interface IUploadIconProps {
  isDragging: boolean;
}

interface IMessageProps {
  isDragging: boolean;
}

export const CardContainer = styled.div`
  width: 100%;
`;

export const TitleContainer = styled.div`
  margin-bottom: 0.5rem;
  span {
    font-weight: 500;
    color: ${props => props.theme.darkText};
  }
`;

export const DropZone = styled.div<IDropZoneProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 2rem;
  border: 2px dashed ${props => props.theme.violet};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  opacity: 1;

  &:hover {
    ${props => css`
      border-color: ${props.theme.violet};
      background-color: ${transparentize(0.95, props.theme.violet)};
    `}
  }

  ${props =>
    props.isDragging &&
    css`
      border-color: ${props.theme.violet};
      background-color: ${transparentize(0.9, props.theme.violet)};
    `}

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 100px;
    padding: 1.5rem;
  }
`;

export const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.darkText};
`;

export const UploadIcon = styled.div<IUploadIconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.darkText};
  transition: all 0.2s ease-in-out;

  ${props =>
    props.isDragging &&
    css`
      color: ${props.theme.violet};
      transform: scale(1.1);
    `}
`;

export const Message = styled.p<IMessageProps>`
  margin: 0;
  text-align: center;
  color: ${props => props.theme.darkText};
  font-size: 0.9rem;
  line-height: 1.4;
  transition: color 0.2s ease-in-out;

  ${props =>
    props.isDragging &&
    css`
      color: ${props.theme.violet};
      font-weight: 500;
    `}

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;
