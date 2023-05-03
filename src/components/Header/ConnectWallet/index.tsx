import { KLV } from '@/assets/coins';
import Copy from '@/components/Copy';
import Tour from '@/components/Tour';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { formatAmount } from '@/utils/formatFunctions';
import { useScroll } from '@/utils/hooks';
import { getNetwork } from '@/utils/networkFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import { BiLogOut, BiWalletAlt } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';
import { IoCreateOutline, IoReloadSharp } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import WalletHelp from '../WalletHelp';
import {
  ActionItem,
  BackgroundHelper,
  BackGroundUserInfo,
  BalanceContainer,
  BodyContent,
  ConnectButton,
  ConnectContainer,
  ContainerAsset,
  DropdownIcon,
  HeaderInfo,
  IoReloadSharpWrapper,
  OtherAssetsContainer,
  QRCodeContainer,
  QRCodeContent,
  ReloadContainer,
  SpanDropdown,
  UserInfoContainer,
} from './styles';

interface IConnectWallet {
  clickConnection: () => void;
}

interface IAssetBalance {
  assetId: string;
  balance: string;
}

const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const [balance, setBalance] = useState<{
    [assetId: string]: string | number;
  }>({
    klv: 0,
  });
  const [primaryAsset, setPrimaryAsset] = useState<IAssetBalance[]>([]);
  const [otherAssets, setOtherAssets] = useState<IAssetBalance[]>([]);
  const [expandAssets, setExpandAssets] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useMobile();
  const network = getNetwork();
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
        const accountAssets = res?.data?.account.assets;
        if (accountAssets) {
          const otherAssets: any = [];
          Object.values(accountAssets).map((asset: any) => {
            otherAssets.push({
              assetId: asset.assetId,
              balance: formatAmount(asset.balance / 10 ** asset.precision),
            });
          });
          setOtherAssets(otherAssets);
          if (typeof klvAvailableBalance === 'number') {
            setBalance({ klv: formatAmount(klvAvailableBalance / 10 ** 6) });
            setLoadingBalance(false);
          }
          setLoadingBalance(false);
        }
      }

      if (res.error === 'cannot find account in database') {
        setOtherAssets([{ assetId: 'KLV', balance: '0' }]);
        setLoadingBalance(false);
      }
    }
  }, [walletAddress]);

  useEffect(() => {
    getAccountBalance();
  }, [walletAddress]);

  useScroll(openUserInfos, () => setOpenUserInfos(false));

  useEffect(() => {
    const storagePrimaryAssets = localStorage.getItem('primaryAsset');
    if (storagePrimaryAssets) {
      try {
        const getPrimaryAsset: IAssetBalance = JSON.parse(
          storagePrimaryAssets as any,
        );
        setPrimaryAsset([getPrimaryAsset]);
      } catch (error) {
        console.error(error);
      }
    }
  }, [otherAssets]);

  useEffect(() => {
    try {
      const storagePrimaryAssets = localStorage.getItem('primaryAsset');
      if (storagePrimaryAssets) {
        const getPrimaryAsset = JSON.parse(storagePrimaryAssets as any);
        const newPrimaryAsset = otherAssets.filter(
          asset => asset.assetId === getPrimaryAsset.assetId,
        );
        if (newPrimaryAsset) {
          localStorage.setItem(
            'primaryAsset',
            JSON.stringify(newPrimaryAsset[0]),
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [otherAssets]);

  const connectAndOpen = () => {
    if (!walletAddress) {
      connectExtension();
    } else {
      setOpenUserInfos(!openUserInfos);
    }
  };

  const handleMouseEnter = () => {
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
  };

  const handleMouseLeave = () => {
    const seconds = !isMobile && !(screen.width < 1024) ? 500 : 100;
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setExpandAssets(false);
    }, seconds);
  };

  const requestKLV = async () => {
    setLoadingBalance(true);
    const response = await api.post({
      route: `transaction/send-user-funds/${walletAddress}`,
    });

    if (response.code === 'internal_error') {
      toast.error('You already ordered KLV in less than 24 hours!');
      setLoadingBalance(false);
    } else {
      toast.success('Test KLV request successful!');
      setLoadingBalance(true);
      getAccountBalance();
    }

    setLoadingBalance(false);
  };

  const dropdownProps = {
    onMouseOver: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  const onClickSetAssetPrimary = (assetId: string, balance: string) => {
    const assetObj = { assetId, balance };
    localStorage.setItem('primaryAsset', JSON.stringify(assetObj));
    const getPrimaryAsset: IAssetBalance = JSON.parse(
      localStorage.getItem('primaryAsset') as any,
    );
    setPrimaryAsset([getPrimaryAsset]);
  };

  return (
    <>
      {!extensionInstalled && (
        <>
          <ConnectContainer>
            <ConnectButton onClick={handleClick}>
              <BiWalletAlt size={'1.2em'} />
              <span>Klever Extension</span>
            </ConnectButton>
          </ConnectContainer>
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
        </>
      )}

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
                      <AiOutlineUser size={'1.3em'} />
                      <span>Show Wallet</span>
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
          <UserInfoContainer openUserInfos={openUserInfos} isMobile={isMobile}>
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

              <ReloadContainer>
                <BalanceContainer>
                  <ContainerAsset
                    onClick={() => setExpandAssets(!expandAssets)}
                  >
                    {primaryAsset.length > 0 ? (
                      <>
                        <>
                          <span>{primaryAsset[0].balance || '---'}</span>
                          {primaryAsset[0].assetId === 'KLV' ? (
                            <KLV />
                          ) : (
                            <span>{primaryAsset[0].assetId}</span>
                          )}
                        </>
                      </>
                    ) : (
                      <>
                        <span>
                          {balance['klv'] !== undefined
                            ? balance['klv']
                            : '---'}
                        </span>
                        <KLV />
                      </>
                    )}
                    <SpanDropdown {...dropdownProps}>
                      <DropdownIcon openOtherAssets={!expandAssets} />
                      {expandAssets && otherAssets.length > 0 && (
                        <OtherAssetsContainer isMobile={isMobile}>
                          {otherAssets.map((asset: any) => (
                            <div
                              key={JSON.stringify(asset)}
                              onClick={() => {
                                onClickSetAssetPrimary(
                                  asset.assetId,
                                  asset.balance,
                                );
                                setExpandAssets(false);
                              }}
                            >
                              <span>{asset.balance}</span>
                              <p>{asset.assetId}</p>
                            </div>
                          ))}
                        </OtherAssetsContainer>
                      )}
                    </SpanDropdown>
                  </ContainerAsset>
                  <IoReloadSharpWrapper
                    onClick={getAccountBalance}
                    loading={loadingBalance}
                    openOtherAssets={!expandAssets}
                  >
                    <IoReloadSharp />
                  </IoReloadSharpWrapper>
                </BalanceContainer>
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
              {network === 'Testnet' && (
                <ActionItem onClick={requestKLV}>
                  <IoMdAddCircle size={'1.2rem'} />
                  <p>Request Test KLV</p>
                </ActionItem>
              )}
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
