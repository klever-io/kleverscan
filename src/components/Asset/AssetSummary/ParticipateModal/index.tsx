import { PropsWithChildren } from 'react';
import FungibleITO, { isFloat } from '@/components/FungibleITO';
import { StyledArrow } from '@/components/Layout/Title/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { useExtension } from '@/contexts/extension';
import { IParsedITO } from '@/types';
import { IPackItem } from '@/types/contracts';
import { getPrecision } from '@/utils/precisionFunctions';
import { web } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowContainer,
  AssetName,
  AssetVisualization,
  Background,
  BuyForm,
  Container,
  Content,
  CurrencyTicker,
  Fees,
  Header,
  Input,
  InputContainer,
  InputRow,
  Label,
  NFTSelectContainer,
  SelectContainer,
  SubmitButton,
  Title,
  TitleContainer,
} from './styles';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

interface ParticipateModalProps {
  isOpenParticipateModal: boolean;
  setOpenParticipateModal: (state: boolean) => void;
  ITO: IParsedITO;
  setTxHash: (txHash: string) => void;
  setLoading: (state: boolean) => void;
}

export const ParticipateModal: React.FC<
  PropsWithChildren<ParticipateModalProps>
> = ({
  isOpenParticipateModal,
  setOpenParticipateModal,
  ITO,
  setTxHash,
  setLoading,
}) => {
  const getPackCurrencyOptions = () => {
    return (
      ITO?.packData?.map(pack => ({
        label: pack.key,
        value: pack.key,
      })) || []
    );
  };

  const [selectedPackCurrency, setSelectedPackCurrency] = useState<string>(
    getPackCurrencyOptions()[0]?.value || '',
  );
  const [selectedPack, setSelectedPack] = useState<number>(0);
  const [assetAmount, setAssetAmount] = useState<number>(0);
  const [currencyAmount, setCurrencyAmount] = useState<number>(0);
  const {
    setOpenDrawer,
    extensionInstalled,
    walletAddress,
    connectExtension,
    checkKleverWebObject,
  } = useExtension();
  const { t } = useTranslation('assets');

  const closeModal = () => {
    setOpenParticipateModal(false);
  };

  const selectedPackData = useMemo(
    () =>
      ITO.packData?.find(pack => pack.key === selectedPackCurrency) ||
      ITO.packData?.[0] || {
        key: '',
        precision: 0,
        packs: [],
      },
    [selectedPackCurrency, ITO.packData],
  );

  useEffect(() => {
    if (isOpenParticipateModal) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpenParticipateModal]);

  const getPackOptions = () => {
    const packs =
      ITO?.packData?.find(pack => {
        return pack.key === selectedPackCurrency;
      })?.packs || [];

    return packs?.map(pack => ({
      label: `${pack.amount} ${ITO.ticker}`,
      value: pack.amount,
    }));
  };

  const calculateCostFromAmount = (amount: number): number => {
    // second input
    if (!ITO) {
      return 0;
    }

    if (amount <= 0) {
      return 0;
    }

    const qtyPacks = selectedPackData.packs.length;

    const packs =
      selectedPackData?.packs ||
      ([
        {
          amount: 0,
          price: 0,
        },
      ] as IPackItem[]);

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

  const calculateAmountFromCost = (cost: number): number => {
    //first input
    if (!ITO) {
      return 0;
    }

    if (cost <= 0) {
      return 0;
    }

    if (!selectedPackData) {
      return 0;
    }

    const qtyPacks = selectedPackData.packs.length;

    const packs =
      selectedPackData?.packs ||
      ([
        {
          amount: 0,
          price: 0,
        },
      ] as IPackItem[]);

    if (qtyPacks === 1) {
      const result = cost / packs[0].price;
      return ITO?.precision ? +result.toFixed(ITO.precision) : result;
    } else if (qtyPacks === 2) {
      if (cost >= 0 && cost <= packs[0].amount * packs[0].price) {
        return cost / packs[0].price;
      } else if (cost >= packs[1].amount * packs[1].price) {
        return cost / packs[1].price;
      }
    }

    let priceIndex;
    const range: number[] = [];

    packs.forEach((pack: IPackItem) => {
      range.push(pack.amount * pack.price);
    });

    for (const rangeIndex in range) {
      if (cost <= range[rangeIndex]) {
        priceIndex = Number(rangeIndex);
        break;
      }
    }

    let amount = 0;

    if (!priceIndex) {
      priceIndex = packs.length - 1;
      amount = cost / packs[priceIndex].price;
    } else {
      amount = cost / packs[priceIndex].price;
    }

    return isFloat(amount) && String(amount).length > 10
      ? Number(amount.toPrecision(5))
      : amount;
  };

  const handleSubmit = async () => {
    if (!selectedPackCurrency) {
      toast.error('Please select a pack currency');
      return;
    }

    if (!currencyAmount) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!selectedPackData.precision) {
      toast.error('Error while calculating pack price. Please reload page');
      return;
    }

    if (!extensionInstalled) {
      setOpenDrawer(true);
      return;
    }
    if (!walletAddress || !checkKleverWebObject()) {
      await connectExtension();
    }

    const payload = {
      buyType: 0,
      id: ITO.assetId,
      currencyId: selectedPackCurrency,
      currencyAmount: currencyAmount * 10 ** selectedPackData.precision,
      amount: assetAmount * 10 ** ITO.precision,
    };

    try {
      setLoading(true);
      setTxHash('');
      const unsignedTx = await web.buildTransaction([
        {
          type: 17, // Buy Order type
          payload: payload,
        },
      ]);
      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);
      const response = await web.broadcastTransactions([signedTx]);

      setTxHash(response.data.txsHashes[0]);
      toast.success('Transaction successfully broadcasted.');
      closeModal();
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRange = (value: number) => {
    for (let i = 0; i < selectedPackData?.packs?.length; i++) {
      if (value <= selectedPackData?.packs[i].amount) {
        const min = i === 0 ? 0 : selectedPackData?.packs[i - 1].amount + 1;
        const max = selectedPackData?.packs[i].amount;
        return { min, max, price: selectedPackData?.packs[i].price };
      }
    }
    const range = {
      min:
        selectedPackData?.packs[selectedPackData?.packs.length - 1].amount + 1,
      max: selectedPackData?.packs[selectedPackData?.packs.length - 1].amount,
      lastItem: selectedPackData?.packs.length - 1 ? true : false,
      price: selectedPackData?.packs[selectedPackData?.packs.length - 1].price,
    };

    return range;
  };

  const currentPriceRange = handleGetRange(currencyAmount);

  return (
    <Container isOpenParticipateModal={isOpenParticipateModal}>
      <Content>
        <Header>
          <TitleContainer>
            <ArrowContainer onClick={closeModal}>
              <StyledArrow />
            </ArrowContainer>
            <Title>You&apos;re Buying</Title>
          </TitleContainer>
          <SelectContainer>
            <ReactSelect
              classNamePrefix="react-select"
              options={getPackCurrencyOptions()}
              onChange={value => {
                setSelectedPackCurrency(
                  (value as { value: string })?.value || '',
                );
                setAssetAmount(calculateAmountFromCost(currencyAmount));
              }}
              value={getPackCurrencyOptions().find(
                option => option.value === selectedPackCurrency,
              )}
            />
          </SelectContainer>
        </Header>

        <FungibleITO
          packInfo={selectedPackData}
          ITO={ITO}
          setTxHash={setTxHash}
          packInfoIndex={0}
        />

        {/* <AssetVisualization>
            <AssetLogo
              logo={ITO?.logo || ''}
              ticker={ITO?.ticker || ''}
              name={ITO?.name || ''}
              verified={ITO?.verified}
              size={40}
            />
            <AssetName>
              {ITO?.name} ({ITO?.ticker})
            </AssetName>
          </AssetVisualization>

          <BuyForm>
            <InputRow>
              <Label>Buy {ITO?.ticker} with</Label>
              <InputContainer disabled={ITO.assetType === 'NonFungible'}>
                <Input
                  value={currencyAmount}
                  disabled={ITO.assetType === 'NonFungible'}
                  onChange={e => {
                    const value = Number(e.target.value);
                    if (Number.isNaN(value)) return;

                    setCurrencyAmount(value);
                    setAssetAmount(calculateAmountFromCost(value));
                  }}
                />
                <SelectContainer>
                  <ReactSelect
                    classNamePrefix="react-select"
                    options={getPackCurrencyOptions()}
                    onChange={value => {
                      setSelectedPackCurrency(
                        (value as { value: string })?.value || '',
                      );
                      setAssetAmount(calculateAmountFromCost(currencyAmount));
                    }}
                    value={getPackCurrencyOptions().find(
                      option => option.value === selectedPackCurrency,
                    )}
                  />
                </SelectContainer>
              </InputContainer>

              {ITO.royalties.fixed ? (
                <Fees>{ITO.royalties.fixed} KLV (Fixed Royalties)</Fees>
              ) : (
                ''
              )}
            </InputRow>

            <InputRow>
              <Label>Amount of {ITO?.ticker}</Label>
              {ITO.assetType === 'Fungible' ? (
                <InputContainer>
                  <Input
                    value={assetAmount}
                    onChange={e => {
                      const { value } = e.target;

                      const [_, decimalPart] = value.toString().split('.');
                      if (decimalPart?.length > ITO.precision) return;

                      const valueToNum = Number(value);
                      if (Number.isNaN(valueToNum)) return;

                      setAssetAmount(valueToNum);
                      setCurrencyAmount(calculateCostFromAmount(valueToNum));
                    }}
                  />
                  {ITO.assetType === 'Fungible' ? (
                    <CurrencyTicker>{ITO.ticker}</CurrencyTicker>
                  ) : null}
                </InputContainer>
              ) : (
                <NFTSelectContainer>
                  <ReactSelect
                    classNamePrefix="react-select"
                    options={getPackOptions()}
                    onChange={(e: any) => {
                      const value = Number(e.value as string);
                      if (Number.isNaN(value)) return;

                      setSelectedPack(value);
                      setAssetAmount(value);
                      setCurrencyAmount(calculateCostFromAmount(value));
                    }}
                    placeholder={
                      getPackOptions().length === 0
                        ? 'Select a currency first'
                        : 'Select a pack'
                    }
                    isDisabled={getPackOptions().length === 0}
                    value={getPackOptions()?.find(
                      option => option.value === selectedPack,
                    )}
                  />
                </NFTSelectContainer>
              )}
            </InputRow>
            <InputRow>
              <Label>Price Range</Label>
              <InputContainer>
                <Input
                  value={'lastItem' in currentPriceRange && currentPriceRange?.lastItem === true ?
                    `> ${currentPriceRange.min}`
                    :
                    `${currentPriceRange.min} - ${currentPriceRange.max}`
                  }
                />
                {ITO.assetType === 'Fungible' ? (
                  <CurrencyTicker>{`${currentPriceRange.price}  ${ITO.ticker}/${selectedPackData?.key}`}</CurrencyTicker>
                ) : null}
              </InputContainer>
            </InputRow>
            <InputRow>
            </InputRow>
          </BuyForm>
          <SubmitButton
            type="button"
            onClick={handleSubmit}
            secondary={!extensionInstalled}
            isDisabled={!currencyAmount || !selectedPackCurrency}
          >
            Buy now
          </SubmitButton> */}
      </Content>
      <Background onClick={closeModal} />
    </Container>
  );
};
