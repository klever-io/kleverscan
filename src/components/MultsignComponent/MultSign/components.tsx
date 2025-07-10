import { PropsWithChildren } from 'react';
import { ITransaction } from '@klever/sdk-web';
import { EmptyMultisign } from '../styles';

export const addNewSignatures = (
  signedTx: ITransaction,
  raw: ITransaction,
): ITransaction => {
  const JSONContractFile = raw;
  if (JSONContractFile?.Signature?.[0]) {
    JSONContractFile?.Signature.push(signedTx?.Signature[0]);
    return JSONContractFile;
  }
  return signedTx;
};

export const EmptyTransaction: React.FC<PropsWithChildren<{ msg: string }>> = ({
  msg,
}) => {
  return <EmptyMultisign>{msg}</EmptyMultisign>;
};
