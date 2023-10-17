import { transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.span<{
  width?: number | string;
  height?: number | string;
}>`
  display: block;
  height: ${props =>
    typeof props.height === 'number'
      ? `${props.height}px`
      : props.height || '25px'} !important;
  width: ${props =>
    typeof props.width === 'number'
      ? `${props.width}px`
      : props.width || '120px'};
`;
export const SkeletonLoader = styled.span`
  display: inline-block;

  width: 100% !important;
  height: 100%;

  background: ${() =>
    `linear-gradient(-90deg, 
      ${transparentize(0.9, '#999999')} 0%, 
      ${transparentize(0.75, '#999999')} 50%, 
      ${transparentize(0.9, '#999999')} 100%)`};
  background-size: 400% 400%;

  border-radius: 5px;

  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
`;

export const SkeletonDiv = styled.div`
  margin: 0.5rem;
`;
