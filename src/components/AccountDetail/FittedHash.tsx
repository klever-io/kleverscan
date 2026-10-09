import { useMiddleFit } from '@/components/FittedText/useMiddleFit';
import React from 'react';
import { FactHash } from './styles';

/* The same middle truncation as a block key: the cell width decides how
   much of the start and the end stay visible. The title keeps the whole
   address, and the copy button next to it copies that whole address. */
const FittedHash: React.FC<{ value: string }> = ({ value }) => {
  const { ref, shown } = useMiddleFit<HTMLSpanElement>(value);

  return (
    <FactHash ref={ref} title={value}>
      {shown}
    </FactHash>
  );
};

export default FittedHash;
