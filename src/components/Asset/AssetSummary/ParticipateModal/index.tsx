import FungibleITO, { isFloat } from '@/components/FungibleITO';
import {
  ItemsContainer,
  KeyLabel,
  PackContainer,
} from '@/components/ITO/styles';
import { StyledArrow } from '@/components/Layout/Title/styles';
import NonFungibleITO from '@/components/NonFungileITO';
import { useExtension } from '@/contexts/extension';
import { IParsedITO } from '@/types';
import { IPackItem } from '@/types/contracts';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowContainer,
  Background,
  Container,
  Content,
  Header,
  NoNFungileContentHeader,
  SelectContainer,
  Title,
  TitleContainer,
} from './styles';
import { web } from '@klever/sdk-web';

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

  const getPriceOptions = () => {
    return (
      ITO?.packData?.flatMap(pack =>
        pack.packs.map((item: any, index: number) => ({
          label: `${item.price} ${pack.key}`,
          key: pack.key,
          value: item.price,
          index: index,
        })),
      ) || []
    );
  };

  const [selectedPackCurrency, setSelectedPackCurrency] = useState<string>(
    getPackCurrencyOptions()[0]?.value || '',
  );
  const [selectedPack, setSelectedPack] = useState<number>(0);
  const [assetAmount, setAssetAmount] = useState<number>(0);
  const [currencyAmount, setCurrencyAmount] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number>(
    getPriceOptions()[0]?.index || 0,
  );
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
      const unsignedTx = await web?.buildTransaction([
        {
          type: 17, // Buy Order type
          payload: payload,
        },
      ]);
      if (!unsignedTx) {
        throw new Error('Transaction building failed.');
      }
      const signedTx = await web.signTransaction(unsignedTx);
      if (!signedTx) {
        throw new Error('Transaction signing was cancelled.');
      }
      const response = await web?.broadcastTransactions([signedTx]);
      if (!response?.data?.txsHashes?.length) {
        throw new Error('Transaction broadcasting failed.');
      }

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
        {ITO.assetType === 'Fungible' ? (
          <FungibleITO
            packInfo={selectedPackData}
            ITO={ITO}
            setTxHash={setTxHash}
            packInfoIndex={ITO.packData.findIndex(
              pack => pack.key === selectedPackCurrency,
            )}
          />
        ) : (
          ITO?.packData?.map((item: any, index) => {
            return (
              <PackContainer key={index + ITO.assetId}>
                <NoNFungileContentHeader>
                  <KeyLabel>{`${t('priceIn')} ${item.key}`}</KeyLabel>
                  <SelectContainer>
                    <ReactSelect
                      classNamePrefix="react-select"
                      options={getPriceOptions()}
                      onChange={value => {
                        setSelectedPrice(
                          (value as { index: number })?.index || 0,
                        );
                      }}
                      value={getPriceOptions().find(
                        option =>
                          option.key === item.key &&
                          option.value === item.packs[selectedPrice].price,
                      )}
                    />
                  </SelectContainer>
                </NoNFungileContentHeader>
                <ItemsContainer>
                  {item?.packs
                    .filter((pack: any, index: number) => {
                      const selectedOption = getPriceOptions().find(
                        option =>
                          option.index === selectedPrice &&
                          option.key === item.key,
                      );
                      return selectedOption && index === selectedOption.index;
                    })
                    .map((pack: any, index: number) => {
                      return (
                        <NonFungibleITO
                          key={`${index}${item.assetId}`}
                          pack={pack}
                          currencyId={item.key}
                          selectedITO={ITO}
                          setTxHash={setTxHash}
                          t={t}
                        />
                      );
                    })}
                </ItemsContainer>
              </PackContainer>
            );
          })
        )}
      </Content>
      <Background onClick={closeModal} />
    </Container>
  );
};
