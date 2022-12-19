import Copy from '@/components/Copy';
import { useExtension } from '@/contexts/extension';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiLogOut, BiWalletAlt } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { IoCreateOutline } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import { parseAddress } from '../../../utils';
import WalletHelp from '../WalletHelp';
import {
  BackgroundHelper,
  BackGroundUserInfo,
  BodyContent,
  ConnectButton,
  ConnectContainer,
  ContentUserInfo,
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
          onClick={() => connectExtension()}
          key={String(extensionInstalled)}
        >
          <ConnectButton>
            {extensionLoading ? (
              <span> Loading... </span>
            ) : (
              <>
                {walletAddress && (
                  <div
                    onClick={() => {
                      if (openUserInfos) {
                        setOpenUserInfos(false);
                      } else {
                        setOpenUserInfos(true);
                      }
                    }}
                  >
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
      {openUserInfos && (
        <UserInfoContainer>
          <ContentUserInfo>
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
              {walletAddress && window.innerWidth > 768 && (
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
              <div>
                <BiWalletAlt size={'1em'} />
                <Link href={`/account/${walletAddress}`}>
                  <a onClick={() => setOpenUserInfos(false)}>
                    <p>Account</p>
                  </a>
                </Link>
                <RiArrowRightSLine size={'1.2em'} />
              </div>
              <div>
                <MdContentCopy size={'1em'} />
                <p>Copy Address</p>
                <RiArrowRightSLine size={'1.2em'} />
                {walletAddress && (
                  <Copy info="Wallet Address" data={walletAddress} />
                )}
              </div>
              <div>
                <IoCreateOutline size={'1em'} />
                <Link href={`/create-transaction`}>
                  <a onClick={() => setOpenUserInfos(false)}>
                    <p>Create Transaction</p>
                  </a>
                </Link>
                <RiArrowRightSLine size={'1.2em'} />
              </div>
              <div
                onClick={() => {
                  logoutExtension();
                  setOpenUserInfos(false);
                }}
              >
                <BiLogOut size={'1em'} />
                <p>Disconnect</p>
              </div>
            </BodyContent>
          </ContentUserInfo>
        </UserInfoContainer>
      )}
      <BackGroundUserInfo
        isOpen={openUserInfos}
        onClick={() => setOpenUserInfos(false)}
      />
    </>
  );
};

export default ConnectWallet;
