import { useMiddleFit } from '@/components/FittedText/useMiddleFit';
import React from 'react';
import { FactHash, FactHashLink } from './styles';

/* The cell width decides how much of the start and the end stay visible.
   The title keeps the whole value, and the copy button copies that whole
   value. An optional href makes the sender a link. The fit itself lives in
   useMiddleFit, shared with the account address and the block key. */
const FittedHash: React.FC<{ value: string; href?: string }> = ({
  value,
  href,
}) => {
  const { ref, shown } = useMiddleFit<HTMLElement>(value, true);

  if (href) {
    return (
      <FactHashLink
        ref={node => {
          ref.current = node;
        }}
        href={href}
        title={value}
      >
        {shown}
      </FactHashLink>
    );
  }

  return (
    <FactHash
      ref={node => {
        ref.current = node;
      }}
      title={value}
    >
      {shown}
    </FactHash>
  );
};

export default FittedHash;
