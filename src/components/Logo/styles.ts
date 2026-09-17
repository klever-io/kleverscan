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

  float: left;
`;

/**
 * The corner mark on a verified asset, sized against the logo rather than
 * left at the icon's own 24px, which covered three quarters of a 32px list
 * logo.
 *
 * The viewBox is restored here because the SVG pipeline strips it from
 * Certified.svg. Without one, a width does not scale the drawing: it crops
 * it, so the mark rendered as a cut-off wedge instead of a check, which is
 * invisible at icon size and unmistakable when magnified.
 */
export const Verified = styled(Certified).attrs({ viewBox: '0 0 24 24' })`
  position: absolute;
  right: 0;
  top: 0;

  width: 45%;
  height: 45%;

  transform: translate(15%, -15%);
`;

export const NextImageWrapperLogo = styled.div`
  ${LogoCSS}
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
