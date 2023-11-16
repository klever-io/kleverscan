/* eslint-disable @typescript-eslint/no-unused-vars */
import { web } from '@klever/sdk-web';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IParsedITO } from 'types';
import nextI18nextConfig from '../../../next-i18next.config';
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

  const { t } = useTranslation('itos');

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
                <span>{t('buyPack')}</span>
              </BuyButton>
            )}
          </>
        )}
      </PackItem>
    </Pack>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['itos'],
    nextI18nextConfig,
  );

  return { props };
};

export default NonFungibleITO;
