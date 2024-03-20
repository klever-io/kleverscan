import { Certified } from '@/assets/icons';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ size: number }>`
  width: fit-content;
  height: fit-content;
  position: relative;

  width: ${props => props.size}px;
  min-width: ${props => props.size}px;
  max-width: ${props => props.size}px;

  height: ${props => props.size}px;
  min-height: ${props => props.size}px;
  max-height: ${props => props.size}px;
`;

const LogoCSS = css`
  position: relative;
  border-radius: 50%;

  width: 100%;
  height: 100%;
`;

export const LetterLogo = styled.div<{ invertColors?: boolean }>`
  ${LogoCSS}
  border: 1px solid ${props => props.theme.borderLogo};

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  text-transform: uppercase;
  color: ${props =>
    props.invertColors ? props.theme.white : props.theme.black};
`;

export const Verified = styled(Certified)`
  position: absolute;
  right: 0;
  top: -1rem;

  transform: translate(50%, 50%);
`;

export const NextImageWrapperLogo = styled.div`
  ${LogoCSS}
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
