import { Certified } from '@/assets/icons';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: fit-content;
  position: relative;
`;

const LogoCSS = css`
  position: relative;

  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
`;

export const LetterLogo = styled.div<{ invertColors?: boolean }>`
  ${LogoCSS}
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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

export const NextImageWrapper = styled.div`
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo} !important;
  width: 2.1rem;
  height: 2.1rem;
  img {
    border: 2px solid ${props => props.theme.borderLogo} !important;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
