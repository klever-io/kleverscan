import { isFloat } from '@/components/FungibleITO';
import { StyledArrow } from '@/components/Layout/Title/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { IAsset, IParsedITO } from '@/types';
import { IPackItem } from '@/types/contracts';
import { getPrecision } from '@/utils/precisionFunctions';
import { web } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowContainer,
  AssetName,
  AssetVisualization,
  Background,
  BuyForm,
  Container,
  Content,
  Header,
  Input,
  InputContainer,
  InputRow,
  Label,
  SelectContainer,
  SubmitButton,
  Title,
} from './styles';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

interface ParticipateModalProps {
  isOpenParticipateModal: boolean;
  setOpenParticipateModal: (state: boolean) => void;
  asset: IAsset;
  ITO: IParsedITO;
  setTxHash: (txHash: string) => void;
  setLoading: (state: boolean) => void;
}

export const ParticipateModal: React.FC<ParticipateModalProps> = ({
  isOpenParticipateModal,
  setOpenParticipateModal,
  asset,
  ITO,
  setTxHash,
  setLoading,
}) => {
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [assetAmount, setAssetAmount] = useState<number>(0);
  const [currencyAmount, setCurrencyAmount] = useState<number>(0);
  const { t } = useTranslation('assets');

  const closeModal = () => {
    setOpenParticipateModal(false);
  };

  const getOptions = () => {
    return (
      ITO?.packData.map(pack => ({
        label: pack.key,
        value: pack.key,
      })) || []
    );
  };

  const calculateCostFromAmount = (amount: number): number => {
    if (!ITO) {
      return 0;
    }

    if (amount <= 0) {
      return 0;
    }

    const qtyPacks = ITO.packData.length;

    const packs =
      ITO.packData.find(pack => pack.key === selectedPack)?.packs ||
      ([
        {
          amount: 0,
          price: 0,
        },
      ] as IPackItem[]);

    if (qtyPacks === 1) {
      return amount / packs[0].price;
    } else if (qtyPacks === 2) {
      if (amount >= 0 && amount <= packs[0].amount) {
        return amount / packs[0].price;
      } else if (amount >= packs[1].price) {
        return amount / packs[1].price;
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
      cost = amount / packs[priceIndex].price;
    } else {
      cost = amount / packs[priceIndex].price;
    }

    return isFloat(cost) && String(cost).length > 10
      ? Number(cost.toPrecision(5))
      : cost;
  };

  const calculateAmountFromCost = (cost: number): number => {
    if (!ITO) {
      return 0;
    }

    if (cost <= 0) {
      return 0;
    }

    const qtyPacks = ITO.packData.length;

    const packs =
      ITO.packData.find(pack => pack.key === selectedPack)?.packs ||
      ([
        {
          amount: 0,
          price: 0,
        },
      ] as IPackItem[]);

    if (qtyPacks === 1) {
      return (cost * packs[0].amount) / packs[0].price;
    } else if (qtyPacks === 2) {
      if (cost >= 0 && cost <= packs[0].amount * packs[0].price) {
        return (cost * packs[0].amount) / packs[0].price;
      } else if (cost >= packs[1].amount * packs[1].price) {
        return (cost * packs[1].amount) / packs[1].price;
      }
    }

    let priceIndex;
    const range: number[] = [];

    packs.forEach((pack: IPackItem) => {
      range.push(pack.amount * pack.price);
    });

    for (const rangeIndex in range) {
      if (cost <= range[rangeIndex]) {
        priceIndex = rangeIndex;
        break;
      }
    }

    let amount = 0;

    if (!priceIndex) {
      priceIndex = packs.length - 1;
      amount = (cost * packs[priceIndex].amount) / packs[priceIndex].price;
    } else {
      amount = (cost * packs[priceIndex].amount) / packs[priceIndex].price;
    }

    return isFloat(amount) && String(amount).length > 10
      ? Number(amount.toPrecision(5))
      : amount;
  };

  const handleSubmit = async () => {
    if (!currencyAmount) {
      toast.error(t('noEmptyOrZeroToastError'));
      return;
    }

    const payload = {
      buyType: 0,
      id: ITO.assetId,
      currencyId: selectedPack,
      amount: currencyAmount * 10 ** (await getPrecision(ITO.assetId)),
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
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Container isOpenParticipateModal={isOpenParticipateModal}>
      <Content>
        <Header>
          <ArrowContainer onClick={closeModal}>
            <StyledArrow />
          </ArrowContainer>
          <Title>You&apos;re Buying</Title>
        </Header>

        <AssetVisualization>
          <AssetLogo
            logo={asset?.logo || ''}
            ticker={asset?.ticker || ''}
            name={asset?.name || ''}
            verified={asset?.verified}
            size={40}
          />
          <AssetName>
            {asset?.name} ({asset?.ticker})
          </AssetName>
        </AssetVisualization>

        <BuyForm>
          <InputRow>
            <Label>Buy {asset?.ticker} with</Label>
            <InputContainer>
              <Input
                value={currencyAmount}
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
                  options={getOptions()}
                  onChange={value => {
                    setSelectedPack((value as { value: string })?.value || '');
                    setAssetAmount(calculateAmountFromCost(currencyAmount));
                  }}
                  value={getOptions().find(
                    option => option.value === selectedPack,
                  )}
                />
              </SelectContainer>
            </InputContainer>
          </InputRow>

          <InputRow>
            <Label>Amount of {asset?.ticker}</Label>
            <InputContainer>
              <Input
                value={assetAmount}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;

                  setAssetAmount(value);
                  setCurrencyAmount(calculateCostFromAmount(value));
                }}
              />
            </InputContainer>
          </InputRow>
        </BuyForm>
        <SubmitButton type="button" onClick={handleSubmit}>
          Buy now
        </SubmitButton>
      </Content>
      <Background onClick={closeModal} />
    </Container>
  );
};
