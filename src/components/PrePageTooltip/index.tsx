import { useInputSearch } from '@/contexts/inputSearch';
import { useTheme } from '@/contexts/theme';
import { getAssetByPartialSymbol } from '@/services/requests/asset';
import getAccount from '@/services/requests/searchBar/account';
import getBlock from '@/services/requests/searchBar/block';
import getTransaction from '@/services/requests/transaction';
import {
  IAccountResponse,
  IAssetResponse,
  IRowSection,
  ITransactionResponse,
  SearchRequest,
} from '@/types';
import { IBlockResponse } from '@/types/blocks';
import { ITransferContract } from '@/types/contracts';
import { getPrecision } from '@/utils/precisionFunctions';
import { processRowSectionsLayout } from '@/utils/table';
import React, { useEffect, useState } from 'react';
import { LuSearchX } from 'react-icons/lu';
import { useQuery } from 'react-query';
import { Loader } from '../Loader/styles';
import {
  AccountRowSections,
  AssetRowSections,
  BlockRowSections,
  TransactionRowSections,
} from './RowSections';
import {
  BiggerTitleSpan,
  CardItem,
  ErrorContent,
  ErrorTitle,
  ErrorWrapper,
  LeaveButton,
  LoaderWrapper,
  TitleSpan,
  TooltipBody,
  TooltipWrapper,
} from './styles';

export interface IPrePageTooltip {
  search: string;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  isInHomePage: boolean;
}

const getInputType = (value: string) => {
  const addressLength = 62;
  const txLength = 64;

  if (!isNaN(Number(value)) && Number(value) !== 0) {
    return 'block';
  }

  if (value.length === txLength) {
    return 'transaction';
  }

  if (value.length === addressLength) {
    return 'account';
  }
  if (value.toUpperCase() === 'KLV' || value.toUpperCase() === 'KFI') {
    return 'asset';
  }
  if (value.length <= 15) {
    return 'asset';
  }
};

const PrePageTooltip: React.FC<IPrePageTooltip> = ({
  search,
  setShowTooltip,
  isInHomePage,
}) => {
  const [precision, setPrecision] = useState(0);
  const trimmedSearch = search.trim().toLowerCase();
  const { setLinkValue } = useInputSearch();
  const type = getInputType(trimmedSearch);
  const { isDarkTheme } = useTheme();
  const canSearch = () => {
    if (!type) {
      return false;
    }
    return true;
  };
  const canSearchResult = canSearch();

  const { data, isLoading } = useQuery({
    queryKey: trimmedSearch,
    queryFn: () => getCorrectQueryFn(),
    enabled: canSearchResult,
  });

  if (!isLoading && canSearchResult && !data?.data) {
    setLinkValue(trimmedSearch, '');
  } else {
    setLinkValue(trimmedSearch, type);
  }

  const isAsset = () => {
    if (type === 'asset') {
      return true;
    }
  };

  const isAccount = () => {
    if (type === 'account') {
      return true;
    }
  };

  const isTransaction = () => {
    if (type === 'transaction') {
      return true;
    }
  };

  const isBlock = () => {
    if (type === 'block') {
      return true;
    }
  };

  const getCorrectQueryFn = (): Promise<SearchRequest> | undefined => {
    if (isAsset()) {
      return getAssetByPartialSymbol(trimmedSearch);
    }

    if (isAccount()) {
      return getAccount(trimmedSearch);
    }

    if (isTransaction()) {
      return getTransaction(trimmedSearch);
    }

    if (isBlock()) {
      return getBlock(trimmedSearch);
    }
  };

  const getCorrectRowSections = (data: SearchRequest): IRowSection[] => {
    if (isAsset()) {
      return AssetRowSections(
        data as IAssetResponse,
        precision,
        setShowTooltip,
        trimmedSearch,
      );
    }

    if (isAccount()) {
      return AccountRowSections(
        data as IAccountResponse,
        precision,
        setShowTooltip,
      );
    }

    if (isTransaction()) {
      return TransactionRowSections(
        data as ITransactionResponse,
        precision,
        setShowTooltip,
      );
    }

    if (isBlock()) {
      return BlockRowSections(
        data as IBlockResponse,
        precision,
        setShowTooltip,
      );
    }
    return [];
  };

  const getTxPrecision = async (transactionData: ITransactionResponse) => {
    if (transactionData?.data?.transaction?.contract.length) {
      const parameter = transactionData?.data?.transaction?.contract?.[0]
        ?.parameter as unknown as ITransferContract;
      if (typeof parameter?.amount === 'number') {
        const txPrecision = await getPrecision(parameter?.assetId || 'KLV');
        setPrecision(txPrecision);
      }
    }
  };

  const getAssetPrecision = async (assetData: IAssetResponse) => {
    if (assetData?.data?.asset?.assetId) {
      const assetPrecision = await getPrecision(
        assetData?.data?.asset?.assetId,
      );
      setPrecision(assetPrecision);
    }
  };

  const getCorrectPrecision = async () => {
    if (data) {
      if (isTransaction()) {
        getTxPrecision(data as ITransactionResponse);
      } else if (isAsset()) {
        getAssetPrecision(data as IAssetResponse);
      }
    }
  };

  useEffect(() => {
    getCorrectPrecision();
  }, [data]);

  let spanCount = 0;
  return (
    <TooltipBody
      id="PrePageTooltip"
      onClick={e => e.stopPropagation()}
      isInHomePage={isInHomePage}
    >
      {!isLoading && <LeaveButton onClick={() => setShowTooltip(false)} />}
      {isLoading && (
        <LoaderWrapper>
          <Loader width={100} height={100} />
        </LoaderWrapper>
      )}
      {!isLoading && canSearchResult && data?.data && (
        <TooltipWrapper>
          {data &&
            getCorrectRowSections(data).map(
              ({ element: Element, span }, index) => {
                const [updatedSpanCount, isRightAligned] =
                  processRowSectionsLayout(spanCount, span);
                spanCount = updatedSpanCount;
                return (
                  <CardItem
                    key={index}
                    isRightAligned={isRightAligned}
                    columnSpan={span}
                  >
                    <Element />
                  </CardItem>
                );
              },
            )}
        </TooltipWrapper>
      )}
      {!isLoading && !canSearchResult && (
        <ErrorWrapper>
          <ErrorTitle>Error</ErrorTitle>
          <ErrorContent>
            Sorry, we cannot search with the text you provided. Try checking the
            correct name and length of the address, asset, block or hash.
          </ErrorContent>
        </ErrorWrapper>
      )}
      {!isLoading && canSearchResult && !data?.data && (
        <ErrorWrapper>
          <BiggerTitleSpan>
            <span>No Results Found</span>
            <LuSearchX style={{ fontSize: '2rem' }} />
          </BiggerTitleSpan>
          <TitleSpan>
            There are no results for your search. Consider trying a different
            query.
          </TitleSpan>
        </ErrorWrapper>
      )}
    </TooltipBody>
  );
};

export default PrePageTooltip;
