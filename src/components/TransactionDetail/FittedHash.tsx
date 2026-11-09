import { useMiddleFit } from '@/components/FittedText/useMiddleFit';
import React from 'react';
import { FactHash } from './styles';

/* The cell width decides how much of the start and the end stay visible.
   The title keeps the whole value, and the copy button copies that whole
   value. The sender stays an ExplorerLink. The fit itself lives in
   useMiddleFit, shared with the account address and the block key. */
const FittedHash: React.FC<{ value: string }> = ({ value }) => {
  const { ref, shown } = useMiddleFit<HTMLElement>(value, true);

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
