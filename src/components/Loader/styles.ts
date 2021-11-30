import styled from 'styled-components';

import { default as DefaultLoader } from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

export const Loader = styled(DefaultLoader).attrs(props => ({
  type: 'TailSpin',
  color: props.theme.input.shadow,
  height: 30,
  width: 30,
}))``;
