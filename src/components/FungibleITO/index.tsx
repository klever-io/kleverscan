import { IPackInfo, IPackItem } from '@/types/contracts';
import { web } from '@klever/sdk';
import Input from 'components/Input';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IParsedITO } from 'types';
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
} from './styles';

interface IFungibleITO {
  ITO: IParsedITO;
  packInfo: IPackInfo;
  packInfoIndex: number;
  showcase?: boolean;
  setTxHash?: (e: string) => any;
}

const isFloat = (value: number) => {
  if (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    !Number.isInteger(value)
  ) {
    return true;
  }

  return false;
};

const FungibleITO: React.FC<IFungibleITO> = ({
  ITO,
  packInfo,
  packInfoIndex,
  setTxHash,
  showcase,
}) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateCost = (indexPackData: number, qtyPacks: number) => {
    if (ITO) {
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
          priceIndex = rangeIndex;
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
        ? cost.toPrecision(5)
        : cost;
    }
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
      toast.error('The amount field cannot be empty or zero!');
      return;
    }

    const payload = {
      buyType: 0,
      id: ITO.assetId,
      currencyId,
      amount: amount * 10 ** ITO.precision,
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
      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);
      const response = await web.broadcastTransactions([signedTx]);
      if (setTxHash) setTxHash(response.data.txsHashes[0]);
      toast.success('Transaction broadcast successfully');
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FungibleContainer key={packInfoIndex}>
        <Content>
          <AssetName>{`Price in ${packInfo.key}`}</AssetName>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            handleConfirmClick={() => undefined}
          />
          <TotalPrice>
            {showcase ? <span>It will cost</span> : <span>You will pay</span>}{' '}
            <span>
              {calculateCost(packInfoIndex, packInfo.packs.length)}{' '}
              {packInfo.key}
            </span>
          </TotalPrice>
          {!showcase && !loading && (
            <Button onClick={() => handleSubmit(packInfo.key)}>
              <span>Buy Token</span>
            </Button>
          )}
          {loading && (
            <LoaderWrapper>
              <Loader />
            </LoaderWrapper>
          )}
        </Content>
        <Content>
          <PriceRange>
            <PriceRangeTitle>Price Range</PriceRangeTitle>
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
        </Content>
      </FungibleContainer>
    </Container>
  );
};

export default FungibleITO;
