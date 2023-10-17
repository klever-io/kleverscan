import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import {
  IParsedProposalParam,
  IProposalParams,
  NetworkParamsIndexer,
} from '@/types/proposals';

export const getNetwork = (): string => {
  const network = process.env.DEFAULT_API_HOST;

  if (network?.includes('mainnet')) {
    return 'Mainnet';
  } else if (network?.includes('devnet')) {
    return 'Devnet';
  }

  return 'Testnet';
};

export const getProposalNetworkParams = (
  params: IProposalParams,
): IParsedProposalParam[] => {
  const fullInfoParams: IParsedProposalParam[] = Object.entries(params).map(
    ([index, value]) => ({
      paramIndex: index,
      paramLabel: NetworkParamsIndexer[index],
      paramValue: Number(value),
      paramText: proposalsMessages[NetworkParamsIndexer[index]],
    }),
  );

  return fullInfoParams;
};
