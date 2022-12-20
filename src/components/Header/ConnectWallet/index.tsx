import Copy from '@/components/Copy';
import { useExtension } from '@/contexts/extension';
import { useScroll } from '@/utils/hooks';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { BiLogOut, BiWalletAlt } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { IoCreateOutline } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import { parseAddress } from '../../../utils';
import WalletHelp from '../WalletHelp';
import {
  ActionItem,
  BackgroundHelper,
  BackGroundUserInfo,
  BodyContent,
  ConnectButton,
  ConnectContainer,
  HeaderInfo,
  QRCodeContainer,
  QRCodeContent,
  UserInfoContainer,
} from './styles';

interface IConnectWallet {
  clickConnection: () => void;
}
const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openUserInfos, setOpenUserInfos] = useState(false);

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
            <span>Connect</span>
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
            </QRCodeContainer>
            <BodyContent>
              <ActionItem>
                <BiWalletAlt size={'1.2rem'} />
                <Link href={`/account/${walletAddress}`}>
                  <a onClick={() => setOpenUserInfos(false)}>
                    <p>Account Details</p>
                  </a>
                </Link>
                <RiArrowRightSLine size={'1.2em'} />
              </ActionItem>
              <ActionItem>
                <IoCreateOutline size={'1.2rem'} />
                <Link href={`/create-transaction`}>
                  <a onClick={() => setOpenUserInfos(false)}>
                    <p>Create Transaction</p>
                  </a>
                </Link>
                <RiArrowRightSLine size={'1.2em'} />
              </ActionItem>

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
