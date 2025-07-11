import { PropsWithChildren } from 'react';
import { EmptyMultisign } from '../../styles';

export const EmptyTransaction: React.FC<PropsWithChildren<{ msg: string }>> = ({
  msg,
}) => {
  return <EmptyMultisign>{msg}</EmptyMultisign>;
};
