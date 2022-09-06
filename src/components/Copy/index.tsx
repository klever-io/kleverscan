import { Copy as CopyIcon } from '@/assets/icons';
import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

interface ICopyProps {
  data?: string;
  info?: string;
}

const IconContainer = styled.div`
  cursor: pointer;
`;

const Copy: React.FC<ICopyProps> = ({ data, info = 'Text' }) => {
  const handleCopyInfo = async () => {
    await navigator.clipboard.writeText(String(data));

    toast.info(`${info} copied to clipboard`, {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    });
  };

  return (
    <Fragment>
      <IconContainer onClick={handleCopyInfo}>
        <CopyIcon />
      </IconContainer>
    </Fragment>
  );
};

export default Copy;
