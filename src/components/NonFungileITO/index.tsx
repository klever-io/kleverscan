import { PropsWithChildren } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useExtension } from '@/contexts/extension';
import { Transaction } from '@klever/connect';
import { useTranslation } from 'next-i18next';
import Image from 'next/legacy/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IParsedITO } from 'types';
import { Loader } from '../Loader/styles';
import { BuyButton, LoaderWrapper, Pack, PackItem } from './styles';

interface INonFungible {
  selectedITO: IParsedITO;
  pack: any;
  currencyId: string;
  setTxHash?: (e: string) => any;
  showcase?: boolean;
}

const NonFungibleITO: React.FC<PropsWithChildren<INonFungible>> = ({
  selectedITO,
  pack,
  currencyId,
  setTxHash,
  showcase,
}) => {
  const { t } = useTranslation('itos');
  const { wallet } = useExtension();

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      buyType: 0,
      id: selectedITO.assetId,
      currencyId,
      amount: pack.amount,
      currencyAmount: pack.rawPrice,
    };

    const parsedPayload = {
      ...payload,
    };

    if (!wallet) {
      toast.error(t('assets:walletNotConnected'));
      setLoading(false);
      return;
    }

    try {
      const unsignedTx = await wallet.buildTransaction([
        {
          contractType: 17, // Buy Order type
          ...parsedPayload,
        },
      ]);
      const signedTx = await wallet.signTransaction(
        Transaction.fromTransaction(unsignedTx),
      );
      const txHashes = await wallet.broadcastTransactions([signedTx]);
      if (setTxHash && txHashes?.[0]) setTxHash(txHashes[0]);
      toast.success(t('successBroadcastTxToast'));
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pack>
      {
        <>
          <Image
            width={226 * 0.7}
            height={271 * 0.7}
            src={imageError ? '/cube.png' : selectedITO.assetLogo}
            onError={() => {
              setImageError(true);
            }}
            onLoad={() => setImgLoading(false)}
            alt="Pack"
            loader={({ src, width }) => `${src}?w=${width}`}
          ></Image>
          {imgLoading && <Loader height={226 * 0.7} width={'86px'} />}
        </>
      }
      <PackItem>
        <p>
          {pack.amount} {selectedITO.ticker}
        </p>
        <p>
          {pack.price} {currencyId}
        </p>
        {!showcase && (
          <>
            {loading ? (
              <LoaderWrapper>
                <Loader />
              </LoaderWrapper>
            ) : (
              <BuyButton onClick={() => handleSubmit()}>
                <span>{t('assets:ITO.Buy Pack')}</span>
              </BuyButton>
            )}
          </>
        )}
      </PackItem>
    </Pack>
  );
};

export default NonFungibleITO;
