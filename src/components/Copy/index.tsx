import { Copy as CopyIcon } from '@/assets/icons';
import * as clipboard from 'clipboard-polyfill';
import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

interface ICopyProps {
  data?: string;
  info?: string;
  children?: React.ReactNode;
  style?: Record<string, unknown>;
  svgSize?: number;
}

const IconContainer = styled.div`
  cursor: pointer;
  line-height: 0;
`;

const Copy: React.FC<ICopyProps> = ({
  data,
  info = 'Text',
  children,
  style,
  svgSize = 24,
}) => {
  const handleCopyInfo = async () => {
    await clipboard.writeText(String(data));

    toast.info(`${info} copied to clipboard`, {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    });
  };

  const size = svgSize / 24;

  return (
    <Fragment>
      <IconContainer onClick={handleCopyInfo} style={style}>
        {children ? children : <CopyIcon style={{ zoom: `${size}` }} />}
      </IconContainer>
    </Fragment>
  );
};

export default Copy;
