import { KLV } from '@/assets/coins';
import Copy from '@/components/Copy';
import Tour from '@/components/Tour';
import { useExtension } from '@/contexts/extension';
import api from '@/services/api';
import { useScroll } from '@/utils/hooks';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { BiLogOut, BiWalletAlt } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { IoCreateOutline, IoReloadSharp } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import { formatAmount, parseAddress } from '../../../utils';
import WalletHelp from '../WalletHelp';
import {
  ActionItem,
  BackgroundHelper,
  BackGroundUserInfo,
  BalanceContainer,
  BodyContent,
  ConnectButton,
  ConnectContainer,
  HeaderInfo,
  IoReloadSharpWrapper,
  QRCodeContainer,
  QRCodeContent,
  ReloadContainer,
  UserInfoContainer,
} from './styles';

interface IConnectWallet {
  clickConnection: () => void;
}
const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const [balance, setBalance] = useState<{
    [assetId: string]: string | number;
  }>({
    klv: 0,
  });
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  const {
    walletAddress,
    extensionLoading,
    extensionInstalled,
    connectExtension,
    logoutExtension,
  } = useExtension();

  const handleClick = () => {
    setOpenDrawer(true);
  };
  const closeMenu = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : 'visible';
  }, [openDrawer]);
  const getAccountBalance = useCallback(async () => {
    if (walletAddress) {
      setLoadingBalance(true);
      const res = await api.get({
        route: `address/${walletAddress}`,
      });
      if (!res.error || res.error === '') {
        const klvAvailableBalance = res?.data?.account?.balance;
        if (typeof klvAvailableBalance === 'number') {
          setBalance({ klv: formatAmount(klvAvailableBalance / 10 ** 6) });
          setLoadingBalance(false);
        }
      }

      if (res.error === 'cannot find account in database') {
        setBalance({ klv: 0 });
        setLoadingBalance(false);
      }
    }
  }, [walletAddress]);

  useEffect(() => {
    getAccountBalance();
  }, [walletAddress]);

  useScroll(openUserInfos, () => setOpenUserInfos(false));

  const connectAndOpen = () => {
    if (!walletAddress) {
      connectExtension();
    } else {
      setOpenUserInfos(!openUserInfos);
    }
  };

  return (
    <>
      {!extensionInstalled && (
        <ConnectContainer>
          <ConnectButton onClick={handleClick}>
            <BiWalletAlt size={'1.2em'} />
            <span>Klever Extension</span>
          </ConnectButton>
        </ConnectContainer>
      )}

      <BackgroundHelper
        onClick={closeMenu}
        onTouchStart={closeMenu}
        opened={openDrawer}
      />
      <WalletHelp
        closeDrawer={() => setOpenDrawer(false)}
        opened={openDrawer}
        clickConnectionMobile={clickConnection}
      />

      {extensionInstalled && (
        <Tour
          guideName="connectWallet"
          side="bottom"
          tourTooltip="Now that you connected your wallet, click here to see more options"
          condition={!!walletAddress}
        >
          <ConnectContainer
            onClick={() => connectAndOpen()}
            key={String(extensionInstalled)}
          >
            <ConnectButton>
              {extensionLoading ? (
                <span> Loading... </span>
              ) : (
                <>
                  {walletAddress && (
                    <div onClick={() => setOpenUserInfos(!openUserInfos)}>
                      <FaUserAlt size={'1.2em'} />
                      <small>{parseAddress(walletAddress, 15)}</small>
                    </div>
                  )}
                  {!walletAddress && (
                    <>
                      <BiWalletAlt size={'1.2em'} />
                      <span>Connect</span>
                    </>
                  )}
                </>
              )}
            </ConnectButton>
          </ConnectContainer>
        </Tour>
      )}
      {walletAddress &&
        ReactDOM.createPortal(
          <UserInfoContainer openUserInfos={openUserInfos}>
            <HeaderInfo>
              <div>
                <BiWalletAlt size={'1em'} />
                <p>My Wallet</p>
              </div>
              <AiOutlineClose
                onClick={() => setOpenUserInfos(false)}
                cursor={'pointer'}
              />
            </HeaderInfo>
            <QRCodeContainer>
              {walletAddress && (
                <QRCodeContent>
                  <div>
                    <QRCodeSVG value={walletAddress} size={100}></QRCodeSVG>
                  </div>
                </QRCodeContent>
              )}
              {walletAddress && (
                <small>{parseAddress(walletAddress, 25)}</small>
              )}

              <ReloadContainer onClick={getAccountBalance}>
                <BalanceContainer>
                  <span>
                    {balance['klv'] !== undefined ? balance['klv'] : '---'}
                  </span>
                  <KLV />
                </BalanceContainer>
                <IoReloadSharpWrapper loading={loadingBalance}>
                  <IoReloadSharp />
                </IoReloadSharpWrapper>
              </ReloadContainer>
            </QRCodeContainer>
            <BodyContent>
              <Link href={`/account/${walletAddress}`}>
                <a onClick={() => setOpenUserInfos(false)}>
                  <ActionItem>
                    <BiWalletAlt size={'1.2rem'} />
                    <p>Account Details</p>
                    <RiArrowRightSLine size={'1.2em'} />
                  </ActionItem>
                </a>
              </Link>
              <Link href={`/create-transaction`}>
                <a onClick={() => setOpenUserInfos(false)}>
                  <ActionItem>
                    <IoCreateOutline size={'1.2rem'} />
                    <p>Create Transaction</p>
                    <RiArrowRightSLine size={'1.2em'} />
                  </ActionItem>
                </a>
              </Link>

              {walletAddress && (
                <Copy info="Wallet Address" data={walletAddress}>
                  <ActionItem>
                    <MdContentCopy size={'1.2rem'} />
                    <p>Copy Address</p>
                  </ActionItem>
                </Copy>
              )}
              <ActionItem
                onClick={() => {
                  logoutExtension();
                  setOpenUserInfos(false);
                }}
              >
                <BiLogOut size={'1.2rem'} />
                <p>Disconnect</p>
              </ActionItem>
            </BodyContent>
          </UserInfoContainer>,
          window.document.body,
        )}
      {walletAddress &&
        ReactDOM.createPortal(
          <BackGroundUserInfo
            isOpen={openUserInfos}
            onClick={() => setOpenUserInfos(false)}
            onTouchStart={() => setOpenUserInfos(false)}
          />,
          window.document.body,
        )}
    </>
  );
};

export default ConnectWallet;
