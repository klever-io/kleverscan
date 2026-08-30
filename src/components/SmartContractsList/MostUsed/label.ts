import { IContractShare } from '@/components/SmartContractsList/summaryFigures';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';

/**
 * What to draw for a contract: its name when it has one that is safe to show,
 * and its shortened address otherwise.
 *
 * The name goes through `safeContractName` because it is owner-set text
 * standing where an address would, and this section is the most prominent
 * place on the page for it to stand.
 */
export const contractLabel = (
  segment: Pick<IContractShare, 'address' | 'name'>,
  chars = 14,
): string => {
  const shown = segment.name ? safeContractName(segment.name) : '';
  return shown || parseAddress(segment.address, chars);
};
