import { IPackInfo, IPackItem } from '@/types/contracts';
import { web } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IParsedITO } from 'types';
import Input from '../Input';
import { Loader } from '../Loader/styles';
import {
  AssetName,
  Button,
  Container,
  Content,
  FungibleContainer,
  LoaderWrapper,
  PriceRange,
  PriceRangeTitle,
  Row,
  TotalPrice,
  ViewMoreButton,
} from './styles';
import { getPrecision } from '@/utils/precisionFunctions';

interface IFungibleITO {
  ITO: IParsedITO;
  packInfo: IPackInfo;
  packInfoIndex: number;
  showcase?: boolean;
  setTxHash?: (e: string) => any;
}

export const isFloat = (value: number): boolean => {
  if (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    !Number.isInteger(value)
  ) {
    return true;
  }

  return false;
};

const FungibleITO: React.FC<PropsWithChildren<IFungibleITO>> = ({
  ITO,
  packInfo,
  packInfoIndex,
  setTxHash,
  showcase,
}) => {
  const { t } = useTranslation('assets');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewMore] = useState(false);

  const calculateCost = (indexPackData: number, qtyPacks: number) => {
    const packs = ITO.packData[indexPackData].packs;
    if (qtyPacks === 1) {
      return amount * packs[0].price;
    } else if (qtyPacks === 2) {
      if (amount >= 0 && amount <= packs[0].amount) {
        return amount * packs[0].price;
      } else if (amount >= packs[1].price) {
        return amount * packs[1].price;
      }
    }

    let priceIndex;
    const range: number[] = [];

    packs.forEach((pack: IPackItem) => {
      range.push(pack.amount);
    });

    for (const rangeIndex in range) {
      if (amount <= range[rangeIndex]) {
        priceIndex = Number(rangeIndex);
        break;
      }
    }

    let cost = 0;

    if (!priceIndex) {
      priceIndex = packs.length - 1;
      cost = amount * packs[priceIndex].price;
    } else {
      cost = amount * packs[priceIndex].price;
    }

    return isFloat(cost) && String(cost).length > 10
      ? Number(cost.toPrecision(5))
      : cost;
  };

  const calculatePriceRange = (
    currentAmount: number,
    packs: IPackItem[],
    index: number,
  ): boolean => {
    if (index === 0) {
      return currentAmount <= packs[0].amount;
    } else if (index === packs.length - 1) {
      return currentAmount > packs[packs.length - 2].amount;
    }
    return (
      currentAmount > packs[index - 1].amount &&
      currentAmount <= packs[index].amount
    );
  };

  const handleSubmit = async (currencyId: string) => {
    if (!amount) {
      toast.error(t('itos:noEmptyOrZeroToastError'));
      return;
    }

    if (!packInfo?.precision) {
      toast.error('Error calculating pack price, please reload page.');
      return;
    }

    const payload = {
      buyType: 0,
      id: ITO.assetId,
      currencyId,
      amount: amount * 10 ** ITO.precision,
      currencyAmount:
        calculateCost(packInfoIndex, packInfo.packs.length) *
        10 ** packInfo.precision,
    };

    const parsedPayload = {
      ...payload,
    };

    try {
      setLoading(true);
      const unsignedTx = await web.buildTransaction([
        {
          type: 17, // Buy Order type
          payload: parsedPayload,
        },
      ]);
      const signedTx = await web.signTransaction(unsignedTx);
      const response = await web.broadcastTransactions([signedTx]);
      if (setTxHash) setTxHash(response.data.txsHashes[0]);
      toast.success(t('itos:successBroadcastTxToast'));
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRange = (value: number) => {
    for (let i = 0; i < packInfo?.packs?.length; i++) {
      if (value <= packInfo?.packs[i]?.amount) {
        const min = i === 0 ? 0 : packInfo?.packs[i - 1]?.amount + 1;
        const max = packInfo?.packs[i]?.amount;
        const key = packInfo?.key;
        return { min, max, price: packInfo?.packs[i]?.price, key };
      }
    }

    const lastPack = packInfo?.packs[packInfo?.packs.length - 1];
    const range = {
      key: packInfo?.key,
      min: lastPack?.amount + 1,
      max: Infinity,
      lastItem: true,
      price: lastPack?.price,
    };

    return range;
  };

  const currentPriceRange = handleGetRange(amount);

  return (
    <FungibleContainer key={packInfoIndex}>
      <Content>
        <AssetName>{t('ITO.Price In', { asset: `${packInfo.key}` })}</AssetName>
        <Input
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          handleConfirmClick={() => undefined}
        />
        <TotalPrice>
          {showcase ? (
            <span>{t('ITO.It will cost')}</span>
          ) : (
            <span>{t('ITO.You will pay')}</span>
          )}{' '}
          <span>
            {calculateCost(packInfoIndex, packInfo.packs.length)} {packInfo.key}
          </span>
        </TotalPrice>
        {!showcase && !loading && (
          <Button onClick={() => handleSubmit(packInfo.key)}>
            <span>{t('ITO.Buy Token')}</span>
          </Button>
        )}
        {loading && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PriceRangeTitle>{t('ITO.Price Range')}</PriceRangeTitle>
          <ViewMoreButton onClick={() => setViewMore(!viewMore)}>
            {viewMore ? 'Hidden All' : 'View More'}
          </ViewMoreButton>
        </div>

        {!viewMore && (
          <PriceRange>
            <Row inPriceRange={true}>
              {'lastItem' in currentPriceRange &&
              currentPriceRange?.lastItem ? (
                <span>{`> ${currentPriceRange.min}`}</span>
              ) : (
                <span>{`${currentPriceRange.min} - ${currentPriceRange.max}`}</span>
              )}
              <span>{`${currentPriceRange.price} ${currentPriceRange.key} / ${ITO.ticker}`}</span>
            </Row>
          </PriceRange>
        )}

        {viewMore && (
          <PriceRange>
            {packInfo.packs.map(
              (packItem: IPackItem, packItemIndex: number) => {
                const isLastElement =
                  packInfo.packs.length === packItemIndex + 1;

                if (packInfo.packs.length === 1) {
                  return (
                    <Row key={packItemIndex} inPriceRange={true}>
                      <span>0 +</span>
                      <span>
                        {packItem.price} {packInfo.key} / {ITO.ticker}
                      </span>
                    </Row>
                  );
                } else if (packInfo.packs.length === 2) {
                  return (
                    <Row
                      key={packItemIndex}
                      inPriceRange={calculatePriceRange(
                        amount,
                        packInfo.packs,
                        packItemIndex,
                      )}
                    >
                      <span>
                        {packItemIndex === 0
                          ? `0 - ${packItem.amount}`
                          : `> ${packInfo.packs[0].amount}`}
                      </span>
                      <span>
                        {packItem.price} {packInfo.key} / {ITO.ticker}
                      </span>
                    </Row>
                  );
                }

                return (
                  <Row
                    key={packItemIndex}
                    inPriceRange={calculatePriceRange(
                      amount,
                      packInfo.packs,
                      packItemIndex,
                    )}
                  >
                    {packItemIndex === 0 && <span>0 - {packItem.amount}</span>}
                    {!isLastElement && packItemIndex > 0 && (
                      <span>
                        {packInfo.packs[packItemIndex - 1].amount + 1} -{' '}
                        {packInfo.packs[packItemIndex].amount}
                      </span>
                    )}
                    {isLastElement && (
                      <span>
                        {'>'} {packInfo.packs[packItemIndex - 1].amount}
                      </span>
                    )}
                    <span>
                      {packItem.price} {packInfo.key} / {ITO.ticker}
                    </span>
                  </Row>
                );
              },
            )}
          </PriceRange>
        )}
      </Content>
    </FungibleContainer>
  );
};

export default FungibleITO;
