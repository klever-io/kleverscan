import WalletHelp from '@/components/Header/WalletHelp';
import { useExtension } from '@/contexts/extension';
import { PropsWithChildren, useState } from 'react';
import { UnderscoreConnect } from '../styles';

export const ConnectButtonComponent: React.FC<PropsWithChildren> = () => {
  const [openWalletHelp, setOpenWalletHelp] = useState(false);
  const { connectExtension, extensionInstalled, walletAddress } =
    useExtension();

  const handleClick = () => {
    if (!extensionInstalled) setOpenWalletHelp(true);
    if (extensionInstalled && !walletAddress) connectExtension();
  };
  return extensionInstalled && walletAddress ? (
    <></>
  ) : (
    <>
      <p>
        You are not connected to your wallet, do you want to{' '}
        <UnderscoreConnect onClick={handleClick}>connect?</UnderscoreConnect>
      </p>
      <WalletHelp
        closeDrawer={() => setOpenWalletHelp(false)}
        opened={openWalletHelp}
        clickConnectionMobile={() => setOpenWalletHelp(false)}
      />
    </>
  );
};
