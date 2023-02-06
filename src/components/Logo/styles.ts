import { Certified } from '@/assets/icons';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: fit-content;
  position: relative;
`;

const LogoCSS = css`
  position: relative;

  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
`;

export const Logo = styled.img`
  ${LogoCSS}
`;

export const LetterLogo = styled.div`
  ${LogoCSS}
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-transform: uppercase;
`;

export const Verified = styled(Certified)`
  position: absolute;
  right: 0;
  top: -1rem;

  transform: translate(50%, 50%);
`;
