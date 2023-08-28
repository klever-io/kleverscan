import { Loader } from '@/components/Loader/styles';
import Tooltip from '@/components/Tooltip';
import { useContractModal } from '@/contexts/contractModal';
import { IAsset } from '@/types';
import { IMarketplaceAsset } from '@/types/marketplaces';
import {
  CardLogo,
  GridItemButton,
  GridItemFlex,
  LoaderWrapper,
  MainItemsDiv,
  TooltipWrapper,
} from '@/views/marketplaces/detail';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';

export interface IBuyCard {
  marketplaceAsset: IMarketplaceAsset;
  precisionQueries?: UseQueryResult<[string, number], unknown>[];
  buyCardsLoading: boolean;
  assets: IAsset[] | undefined;
}

const BuyCard: React.FC<IBuyCard> = ({
  marketplaceAsset,
  precisionQueries,
  buyCardsLoading,
  assets,
}) => {
  const [isError, setIsError] = useState(false);
  const { getInteractionsButtons } = useContractModal();
  const [BuyButton] = getInteractionsButtons([
    {
      title: 'Place Buy Order',
      contractType: 'BuyContract',
      defaultValues: {
        buyType: 1,
        id: marketplaceAsset?.orderId,
        // currencyId: sell.currencyId,
      },
    },
  ]);

  // const findCorrectCurrencyId = (currencyId: string) => {
  //   return precisionQueries.find(res => res?.data?.[0] === currencyId)
  //     ?.data?.[1];
  // };

  const getCorrectLogo = (assetId: string) => {
    return assets?.find(asset => {
      return asset.assetId === assetId;
    })?.logo;
  };

  // const precision = findCorrectCurrencyId(sell?.currencyId || '') || 0;
  return (
    <MainItemsDiv>
      <LoaderWrapper>
        <TooltipWrapper>
          <Tooltip
            msg={
              'The image refers to the entire collection, not to the NFT being sold. NFT metadata can be added later.'
            }
          />
        </TooltipWrapper>
        {buyCardsLoading ? (
          <Loader height={75} width={75} />
        ) : (
          <CardLogo
            src={
              isError
                ? '/no-logo.png'
                : getCorrectLogo(marketplaceAsset?.assetId.split('/')[0]) ||
                  '/no-logo.png'
            }
            onError={() => setIsError(true)}
          />
        )}
      </LoaderWrapper>
      <GridItemFlex>
        <span>Asset Name</span>
        <span>{marketplaceAsset?.assetName}</span>
      </GridItemFlex>
      <GridItemFlex>
        <span>NFT</span>
        <span>{marketplaceAsset?.assetId}</span>
      </GridItemFlex>
      <GridItemFlex>
        <span>Order Id</span>
        <span>{marketplaceAsset?.orderId}</span>
      </GridItemFlex>
      {/* <GridItemFlex>
        <span>Market Type</span>
        <span>{sell.marketType === 'Auction' ? 'Auction' : 'Buy it now'}</span>
      </GridItemFlex> */}
      {/* <GridItemFlex>
        <span>Current Bid</span>
        <span>
          {sell?.currentBid
            ? `${sell.currentBid / 10 ** precision} ${sell?.currencyId}`
            : '-'}
        </span>
      </GridItemFlex> */}
      {/* <GridItemFlex>
        <span>Instant Sell Price</span>
        <span>
          {sell?.price
            ? `${sell.price / 10 ** precision} ${sell?.currencyId}`
            : '-'}
        </span>
      </GridItemFlex> */}
      {/* <GridItemFlex>
        <span>Reserve Price</span>
        <span>
          {sell?.reservePrice
            ? `${sell.reservePrice / 10 ** precision} ${sell?.currencyId}`
            : '-'}
        </span>
      </GridItemFlex> */}
      <GridItemButton>
        <BuyButton />
      </GridItemButton>
    </MainItemsDiv>
  );
};

export default BuyCard;