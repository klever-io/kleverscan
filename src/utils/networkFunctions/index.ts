import { proposalsMap } from '@/components/Tabs/NetworkParams/proposalsMap';
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

export const getProposalNetworkParams = (params: IProposalParams) => {
  const fullInfoParams = Object.entries(params).map(([index, value]) => {
    const paramText =
      proposalsMap[
        NetworkParamsIndexer[
          index as keyof typeof NetworkParamsIndexer
        ] as unknown as keyof typeof proposalsMap
      ]?.message;

    if (!paramText) console.warn('Missing param in proposalsMap:', index);

    return {
      paramIndex: index,
      paramLabel:
        NetworkParamsIndexer[index as keyof typeof NetworkParamsIndexer],
      paramValue: Number(value),
      paramText,
    };
  });

  return fullInfoParams;
};
