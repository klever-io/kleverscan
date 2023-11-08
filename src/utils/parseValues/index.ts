import api from '@/services/api';
import { processITOPrecisions } from '@/services/requests/ito';
import {
  IAsset,
  IBalance,
  IDelegationsResponse,
  IFormData,
  IHolder,
  IITO,
  IPagination,
  IParsedITO,
  IValidator,
  IValidatorResponse,
} from '@/types';
import { IParsedProposal, IProposalResponse } from '@/types/proposals';
import { getVotingPowers, validateFormattedVotes } from '..';
import { getProposalNetworkParams } from '../networkFunctions';

/**
 *  Receives an IAccountAsset[] (which comes from an IAssetsHoldersResponse) and returns a new array of objects only with index, address, balance and rank properties.
 * @param holders
 * @param assetId is required to check if the holder asset is really from the correct asset.
 * @param pagination is required because is used to calculate the rank of the asset holder.
 * @returns IBalance[] which is the data necessary for the frontend to show the holders of an asset.
 */
export const parseHolders = (
  holders: IHolder[] | [],
  assetId: string,
  pagination: IPagination,
): IBalance[] =>
  holders.map((holder: IHolder, index: number) => {
    if (holder.assetId === assetId) {
      return {
        index,
        address: holder.address,
        balance: holder.balance,
        frozenBalance: holder.frozenBalance,
        totalBalance: holder.totalBalance,
        rank: index + 1 + (pagination.self - 1) * pagination.perPage,
      };
    } else
      return {
        index,
        address: '',
        balance: 0,
        frozenBalance: 0,
        totalBalance: 0,
        rank: 0,
      };
  });

/**
 * Receives an IValidatorResponse with data from all validators and parse it adding new fields: parsedAddress, rank, staked, cumulativeStaked and status.
 * @param validators
 * @returns IValidator[]
 */
export const parseValidators = (
  validators: IValidatorResponse,
): IValidator[] => {
  return validators.data['validators'].map(
    (delegation: IDelegationsResponse, index: number): IValidator => {
      const totalProduced =
        delegation.totalLeaderSuccessRate.numSuccess +
        delegation.totalValidatorSuccessRate.numSuccess;
      const totalMissed =
        delegation.totalLeaderSuccessRate.numFailure +
        delegation.totalValidatorSuccessRate.numFailure;

      return {
        ownerAddress: delegation.ownerAddress,
        parsedAddress: parseAddress(delegation.ownerAddress, 20),
        name: delegation.name,
        rank:
          index +
          (validators.pagination.self - 1) * validators.pagination.perPage +
          1,
        cumulativeStaked: parseFloat(
          (
            (delegation.totalStake / validators.data.networkTotalStake) *
            100
          ).toFixed(4),
        ),
        staked: delegation.totalStake,
        rating: delegation.rating,
        canDelegate: delegation.canDelegate,
        selfStake: delegation.selfStake,
        status: delegation.list,
        totalProduced,
        totalMissed,
        commission: delegation.commission,
        maxDelegation: delegation.maxDelegation,
      };
    },
  );
};

/** Parse data from an Object whose values are saved as string and convert them to their content. Example: "true" --> true */
export const parseData = (data: IFormData): IFormData => {
  const dataEntries = Object.entries(data);

  dataEntries.forEach(([key, value]) => {
    if (value === '' || value === null) {
      delete data[key];
    } else if (typeof value === 'object') {
      parseData(value);
    } else if (
      typeof value === 'string' &&
      new RegExp(
        '^((19|20)\\d\\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])',
      ).test(value)
    ) {
      data[key] = new Date(value).getTime() / 1000;
    } else if (isNaN(value as any)) {
      switch (value) {
        case 'true':
          data[key] = true;
          break;
        case 'false':
          data[key] = false;
          break;
        default:
          data[key] = value;
          break;
      }
    } else {
      data[key] = Number(value);
    }
  });

  return data;
};

/**
 * Splits an address in two parts, if the address length is greater than the maxLen. The first part is the beginning of the address. The last part is the end of the address. Ellipsis is between the splitted address.
 * @param address
 * @param maxLen
 * @returns string
 */
export const parseAddress = (address: string, maxLen: number): string => {
  return address?.length > maxLen
    ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
    : address;
};

/**
 * Sanitizes the assetId's from an IAsset array so they can be valid as URI components.
 * @param assets
 * @returns IAsset[]
 */
export const parseHardCodedInfo = (assets: IAsset[]): IAsset[] => {
  return assets.map(asset => {
    asset.assetId = encodeURIComponent(asset.assetId);
    return asset;
  });
};

export const parseJson = (data: string): string => {
  try {
    const json = JSON.parse(data);
    return JSON.stringify(json, null, 2);
  } catch (error) {
    return data;
  }
};

export const parseProposal = (proposal: IProposalResponse): any => {
  const votesYes = (proposal.data.proposal.votes['0'] || 0) / 10 ** 6;
  const votesNo = (proposal.data.proposal.votes['1'] || 0) / 10 ** 6;
  return {
    ...proposal.data.proposal,
    votingPowers: getVotingPowers(proposal?.data?.proposal.voters),
    pagination: proposal?.data?.proposal.votersPage,
    votes: {
      Yes: votesYes,
      No: votesNo,
    },
    totalVoted: votesYes + votesNo,
    parsedVoters: validateFormattedVotes(proposal.data.proposal),
  };
};

export const parseAllProposals = (
  arrayOfProposals: any[],
): IParsedProposal[] | [] => {
  if (arrayOfProposals) {
    arrayOfProposals.forEach((proposal, index) => {
      arrayOfProposals[index].parsedParameters = getProposalNetworkParams(
        proposal.parameters,
      );
    });
    return arrayOfProposals;
  }
  return [];
};

export const parseITOs = async (
  ITOs: IITO[],
): Promise<IParsedITO | never[]> => {
  const assetsInput: string = ITOs.map(ITO => ITO.assetId).join(',');
  const packsPrecisionCalls: Promise<IITO>[] = [];
  const res = await api.get({
    route: `assets/list?asset=${assetsInput}`,
  });
  if (!res.error || res.error === '') {
    const assets = res.data.assets;
    ITOs.forEach((ITO, index) => {
      const asset = assets.find(
        (asset: IAsset) => asset.assetId === ITOs[index].assetId,
      );
      ITO.maxAmount = ITO.maxAmount / 10 ** asset.precision;
      ITO['ticker'] = asset.ticker;
      ITO['assetType'] = asset.assetType;
      ITO['precision'] = asset.precision;
      ITO['assetLogo'] = asset.logo;
      packsPrecisionCalls.push(processITOPrecisions(ITO, asset.precision));
    });
    await Promise.allSettled(packsPrecisionCalls);
  }
  return [];
};
