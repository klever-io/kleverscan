import { default as DefaultLoader } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import styled from 'styled-components';

export const Loader = styled(DefaultLoader).attrs(props => ({
  type: 'TailSpin',
  color: props.theme.violet,
  height: 25,
  width: 25,
}))``;

export const HomeLoader = styled(DefaultLoader).attrs(props => ({
  type: 'TailSpin',
  color: props.theme.violet,
  height: '40%',
  width: '40%',
}))``;
