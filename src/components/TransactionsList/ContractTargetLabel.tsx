import { Mono } from '@/styles/common';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';
import { ContractName } from './styles';
import { useContractName } from './useContractName';

export interface IContractTargetLabelProps {
  address: string;
  isContract?: boolean;
  /** How many characters of the address to keep when no name is known. */
  truncateTo: number;
}

/**
 * What a row shows for the address it points at: the contract's own name when
 * the chain has one, and the shortened address otherwise.
 *
 * The name arrives on its own request, so a row paints its address first and
 * takes the name when it lands. That keeps a decoration off the path the
 * table has to walk before it can show anything at all.
 *
 * A name is words and gets the page font; an address is a hash and keeps the
 * monospace that makes its middle ellipsis line up down the column.
 */
const ContractTargetLabel: React.FC<IContractTargetLabelProps> = ({
  address,
  isContract,
  truncateTo,
}) => {
  const name = useContractName(address, Boolean(isContract));
  const shown = name ? safeContractName(name) : '';

  // Both readings share one fixed box. The name lands about a second after
  // the row is readable, and a cell that resizes on arrival drags every
  // column beside it; identical width either way means nothing moves.
  //
  // A name that survives none of the cleaning is not a name; the address is.
  // The title carries the cleaned text plus the address, so the cell is never
  // the only place the counterparty is named, and the characters kept out of
  // the cell cannot reappear in the browser's own tooltip.
  return (
    <ContractName title={shown ? `${shown} · ${address}` : address}>
      {shown || <Mono>{parseAddress(address, truncateTo)}</Mono>}
    </ContractName>
  );
};

export default ContractTargetLabel;
