import { default as DefaultLoader } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import styled from 'styled-components';

export const Loader = styled(DefaultLoader).attrs(props => ({
  type: 'TailSpin',
  color: props.theme.violet,
  height: props.height || 25,
  width: props.width || 25,
}))``;

export const HomeLoader = styled(DefaultLoader).attrs(props => ({
  type: 'TailSpin',
  color: props.theme.violet,
  height: '40%',
  width: '40%',
}))``;

export const LoaderWrapper = styled.div`
  height: 22rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const baseTransform = `translateY(-50%)`;

export const InlineLoaderWrapper = styled.div<{
  height: number;
  color: string;
}>`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 1rem;

  div {
    position: absolute;
    top: 50%;
    width: ${({ height }) => height}px;
    height: ${({ height }) => height}px;
    border-radius: 50%;
    background: ${({ color }) => color};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-child(1) {
    left: ${({ height }) => (8 * height) / 13}px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  div:nth-child(2) {
    left: ${({ height }) => (8 * height) / 13}px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-child(3) {
    left: ${({ height }) => (32 * height) / 13}px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-child(4) {
    left: ${({ height }) => (56 * height) / 13}px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0) ${baseTransform};
    }
    100% {
      transform: scale(1) ${baseTransform};
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1) ${baseTransform};
    }
    100% {
      transform: scale(0) ${baseTransform};
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translateX(0) ${baseTransform};
    }
    100% {
      transform: translateX(${({ height }) => (24 * height) / 13}px)
        ${baseTransform};
    }
  }
`;
