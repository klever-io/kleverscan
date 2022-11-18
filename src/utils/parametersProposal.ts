import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import {
  IFullInfoParam,
  IRawParam,
  NetworkParamsIndexer,
} from '@/types/proposals';

export const getProposalNetworkParams = (
  params: IRawParam,
): IFullInfoParam[] => {
  const fullInfoParams: IFullInfoParam[] = Object.entries(params).map(
    ([index, value]) => ({
      paramIndex: index,
      paramLabel: NetworkParamsIndexer[index],
      paramValue: Number(value),
      paramText: proposalsMessages[NetworkParamsIndexer[index]],
    }),
  );

  return fullInfoParams;
};
