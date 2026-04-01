import Copy from '@/components/Copy';
import { CenteredRow } from '@/styles/common';
import Link from 'next/link';
import React from 'react';
import { IoOpenOutline } from 'react-icons/io5';

interface AddressLinkProps {
  address?: string;
  isSmartContract?: boolean;
}

const AddressLink: React.FC<AddressLinkProps> = ({
  address,
  isSmartContract,
}) => {
  const href = isSmartContract
    ? `/smart-contract/${address}`
    : `/account/${address}`;

  return (
    <CenteredRow>
      <Link href={href}>{address || '--'}</Link>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <IoOpenOutline size={20} />
      </a>
      <Copy data={address} info="Address" />
    </CenteredRow>
  );
};

export default AddressLink;
