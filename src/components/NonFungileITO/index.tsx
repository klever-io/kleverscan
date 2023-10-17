/* eslint-disable @typescript-eslint/no-unused-vars */
import { web } from '@klever/sdk-web';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IParsedITO } from 'types';
import { Loader } from '../Loader/styles';
import { BuyButton, LoaderWrapper, NFTimg, Pack, PackItem } from './styles';

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
  const [imgLoading, setImgLoading] = useState(true);

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
          <NFTimg
            imgLoading={imgLoading}
            width={226 * 0.7}
            height={271 * 0.7}
            src={selectedITO.assetLogo}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = '/cube.png';
            }}
            onLoad={() => setImgLoading(false)}
            alt="Pack"
          ></NFTimg>
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
