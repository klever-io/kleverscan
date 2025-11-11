import { default as FungibleITO } from '@/components/FungibleITO';
import NonFungibleITO from '@/components/NonFungileITO';
import { IParsedITO } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { TFunction } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  ChooseAsset,
  ItemsContainer,
  ITOTitle,
  KeyLabel,
  PackContainer,
  FungibleContainer,
  FungibleItem,
} from './styles';

export const displayITOpacks = (
  ITO: IParsedITO,
  setTxHash: Dispatch<SetStateAction<string | null>>,
  t: TFunction,
): JSX.Element => {
  return (
    <>
      <ITOTitle>
        <span>{ITO && ITO?.assetId}</span>
      </ITOTitle>
      {ITO?.assetType === 'Fungible' ? (
        <FungibleContainer>
          {ITO?.packData?.map((packInfo: IPackInfo, packInfoIndex: number) => {
            return (
              <FungibleItem key={packInfoIndex}>
                <FungibleITO
                  packInfo={packInfo}
                  ITO={ITO}
                  setTxHash={setTxHash}
                  packInfoIndex={packInfoIndex}
                />
              </FungibleItem>
            );
          })}
        </FungibleContainer>
      ) : (
        ITO?.packData?.map((item: any, index) => {
          return (
            <PackContainer key={index + ITO.assetId}>
              <KeyLabel>{`${t('priceIn')} ${item.key}`}</KeyLabel>
              <ItemsContainer>
                {item.packs.map((pack: any, index: number) => {
                  return (
                    <NonFungibleITO
                      key={`${index}${item.assetId}`}
                      pack={pack}
                      currencyId={item.key}
                      selectedITO={ITO}
                      setTxHash={setTxHash}
                    />
                  );
                })}
              </ItemsContainer>
            </PackContainer>
          );
        })
      )}
      {!ITO?.packData && (
        <ChooseAsset>
          {' '}
          <span>{t('noPacksFound')}</span>
        </ChooseAsset>
      )}
    </>
  );
};
