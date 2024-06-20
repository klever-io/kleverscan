import { PropsWithChildren } from 'react';
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
  color?: string;
}

const IconContainer = styled.div`
  cursor: pointer;
  line-height: 0;
  svg {
    g {
      fill: ${({ color }) => color};
    }
  }
`;

const Copy: React.FC<PropsWithChildren<ICopyProps>> = ({
  data,
  info = 'Text',
  children,
  style,
  svgSize = 24,
  color = '#7B7DB2',
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
      <IconContainer onClick={handleCopyInfo} style={style} color={color}>
        {children ? children : <CopyIcon style={{ zoom: `${size}` }} />}
      </IconContainer>
    </Fragment>
  );
};

export default Copy;
