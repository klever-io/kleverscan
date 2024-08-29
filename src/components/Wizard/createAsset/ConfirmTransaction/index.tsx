import { WizardLeftArrow } from '@/assets/icons';
import Tooltip from '@/components/Tooltip';
import { validateImgUrl } from '@/utils/imageValidate';
import { parseAddress } from '@/utils/parseValues';
import Image from 'next/legacy/image';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoArrowForward } from 'react-icons/io5';
import { infinitySymbol, IWizardConfirmProps } from '..';
import { formatPrecision } from '../../utils';
import {
  BackArrowSpan,
  ButtonsContainer,
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ConfirmCardImage,
  GenericCardContainer,
  ReviewContainer,
  WizardButton,
} from '../styles';
import { TransactionDetails } from '../TransactionDetails';
import { TransactionDetails2 } from '../TransactionDetails2';
import { TransactionDetails3 } from '../TransactionDetails3';

export const ConfirmTransaction: React.FC<
  PropsWithChildren<IWizardConfirmProps>
> = ({
  informations: { assetType, additionalFields },
  handleStep,
  fromAdvancedSteps,
  t,
}) => {
  const { watch } = useFormContext();
  const name = watch('name');
  const ticker = watch('ticker');
  const maxSupply = watch('maxSupply');
  const ownerAddress = watch('ownerAddress');
  const logo = watch('logo');

  const assetText = assetType === 0 ? 'token' : 'NFT';
  const precision = watch('precision') || null;
  const initialSupply = watch('initialSupply');

  const [validImage, setValidImage] = useState(false);

  useEffect(() => {
    const getImage = async () => {
      const image = await validateImgUrl(logo, 2000);
      if (image) {
        setValidImage(true);
      }
    };
    getImage();
  }, []);

  const handlePreviousStep = () => {
    if (fromAdvancedSteps) {
      handleStep(prev => prev - 1);
    } else {
      handleStep(assetText === 'NFT' ? 6 : 8);
    }
  };

  const renderLogo = () => {
    if (validImage) {
      return (
        <ConfirmCardImage>
          <Image
            alt="logo"
            src={logo}
            width={40}
            height={40}
            objectPosition="center"
            style={{ borderRadius: '10px' }}
            loader={({ src, width }) => `${src}?w=${width}`}
          />
        </ConfirmCardImage>
      );
    }

    return <ConfirmCardImage>{name[0]?.toUpperCase()}</ConfirmCardImage>;
  };

  return (
    <>
      <GenericCardContainer>
        <div>
          <p>{t('wizards:common.confirm.create', { type: assetText })}</p>
          <p>{t('wizards:common.confirm.review')}</p>
        </div>
        <ReviewContainer>
          <span>{t('wizards:common.confirm.reviewAsset', { assetText })}</span>

          <ConfirmCardBasics tokenInfo>
            <div>
              {renderLogo()}
              <div>
                <span>{ticker}</span>
                <span>{name}</span>
              </div>
            </div>
            <ConfirmCardBasisInfo>
              <span>{t('wizards:common.maxSupply')}</span>
              <span>{maxSupply ? maxSupply : infinitySymbol}</span>
            </ConfirmCardBasisInfo>
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>{t('wizards:common.initialSupply')}</span>
                <span>{initialSupply ? initialSupply : 0}</span>
              </ConfirmCardBasisInfo>
            )}
            {additionalFields && (
              <ConfirmCardBasisInfo>
                <span>{t('wizards:common.precision')}</span>
                <span>
                  <span>{precision || 0} </span>:{' '}
                  <strong>({formatPrecision(precision ?? 0, true)})</strong>
                  <Tooltip msg="Min unity" />
                </span>
              </ConfirmCardBasisInfo>
            )}
            <ConfirmCardBasisInfo>
              <span>{t('wizards:common.basicOptions.ownerAddress')}</span>
              <span>{parseAddress(ownerAddress, 14)}</span>
            </ConfirmCardBasisInfo>
          </ConfirmCardBasics>
          <TransactionDetails />
          <TransactionDetails2 {...{ assetType, additionalFields }} />
          <TransactionDetails3 assetType={assetType} />
        </ReviewContainer>
        <ButtonsContainer isRow>
          <BackArrowSpan onClick={handlePreviousStep}>
            <WizardLeftArrow />
          </BackArrowSpan>
          <WizardButton type="submit">
            <p>{t('wizards:common.confirm.confirmTransaction')}</p>
            <span>
              <IoArrowForward />
            </span>
          </WizardButton>
        </ButtonsContainer>
      </GenericCardContainer>
    </>
  );
};
