/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateImgUrl } from '@/utils/imageValidate';
import { web } from '@klever/sdk';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
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

const NonFungibleITO: React.FC<INonFungible> = ({
  selectedITO,
  pack,
  currencyId,
  setTxHash,
  showcase,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('/cube.png');

  const verifyImg = async () => {
    const timeToValidadeImg = 2000; // 2 secs
    if (await validateImgUrl(selectedITO.assetLogo, timeToValidadeImg)) {
      setImageSrc(selectedITO.assetLogo);
    }
  };
  useEffect(() => {
    verifyImg();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      buyType: 0,
      id: selectedITO.assetId,
      currencyId,
      amount: pack.amount,
    };

    const parsedPayload = {
      ...payload,
    };

    try {
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
      setLoading(false);
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
      setLoading(false);
    }
  };

  return (
    <Pack>
      {
        <NextImage
          width={226 * 0.7}
          height={271 * 0.7}
          style={{ borderRadius: '0.8rem', margin: '10rem' }}
          src={imageSrc}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/cube.png';
          }}
          alt="Pack"
        ></NextImage>
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
                <span>Buy Pack</span>
              </BuyButton>
            )}
          </>
        )}
      </PackItem>
    </Pack>
  );
};

export default NonFungibleITO;
