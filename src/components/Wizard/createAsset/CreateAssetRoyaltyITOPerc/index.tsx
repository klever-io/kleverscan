import { PropsWithChildren } from 'react';
import { IWizardComponents } from '..';
import { CreateAssetRoyaltyITONFT } from '../CreateAssetRoyaltyITONFT';
import { CreateAssetRoyaltyITOToken } from '../CreateAssetRoyaltyITOToken';

export const CreateAssetRoyaltyITOPerc: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, isNFT, t }) => {
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const props = {
    buttonsProps,
    t,
  };

  if (!isNFT) {
    return <CreateAssetRoyaltyITOToken {...props} />;
  } else {
    return <CreateAssetRoyaltyITONFT {...props} />;
  }
};
