import { KLV } from '@/assets/coins';
import { Check, Plug } from '@/assets/icons';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  getAccountBalanceRequest,
  IAccountBalance,
} from '@/services/requests/account';
import { getNetwork } from '@/utils/networkFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiLogOut, BiWalletAlt } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';
import { IoCreateOutline, IoReloadSharp } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Copy from '../Copy';
import {
  ActionItem,
  BalanceContainer,
  BodyContent,
  ContainerAsset,
  DropdownIcon,
  HeaderInfo,
  IoReloadSharpWrapper,
  OtherAssetsContainer,
  QRCodeContainer,
  QRCodeContent,
  ReloadContainer,
  SpanDropdown,
  SubSection,
  UserInfoContainer,
} from './styles';

export interface IAssetBalance {
  assetId: string;
  balance: string;
}

interface IAccountDetailsModal {
  openUserInfos: boolean;
  setOpenUserInfos: Dispatch<SetStateAction<boolean>>;
}

export const getNetworkPath = (network: string): string => {
  if (network === 'mainnet') {
    return 'https://kleverscan.org/';
  } else if (network === 'testnet') {
    return 'https://testnet.kleverscan.org/';
  } else if (network === 'devnet') {
    return 'https://devnet.kleverscan.org/';
  } else {
    return 'https://kleverscan.org/';
  }
};

export const AccountDetailsModal: React.FC<IAccountDetailsModal> = ({
  openUserInfos,
  setOpenUserInfos,
}) => {
  const [primaryAsset, setPrimaryAsset] = useState<IAssetBalance[]>([]);
  const [expandAssets, setExpandAssets] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [openNetworks, setOpenNetworks] = useState<boolean>(false);

  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const { walletAddress, connectExtension, logoutExtension } = useExtension();
  const { isMobile } = useMobile();
  const network = getNetwork();
  const router = useRouter();

  const { data, refetch: getAccountBalance } = useQuery<IAccountBalance>({
    queryKey: ['accountBalance', walletAddress],
    queryFn: () => getAccountBalanceRequest(walletAddress, setLoadingBalance),
    enabled: !!walletAddress,
    onSettled: () => {
      setLoadingBalance(false);
    },
  });

  const { balance, otherAssets } = useMemo(() => {
    if (data) {
      const { balance, otherAssets } = data;
      return { balance, otherAssets };
    }
    return { balance: {}, otherAssets: [] };
  }, [data]);

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

  const onClickSetAssetPrimary = (assetId: string, balance: string) => {
    const assetObj = { assetId, balance };
    localStorage.setItem('primaryAsset', JSON.stringify(assetObj));
    const getPrimaryAsset: IAssetBalance = JSON.parse(
      localStorage.getItem('primaryAsset') as any,
    );
    setPrimaryAsset([getPrimaryAsset]);
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

  const dropdownProps = {
    onMouseOver: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  const updatePrimaryAsset = () => {
    const storagePrimaryAssets = localStorage.getItem('primaryAsset');
    if (!storagePrimaryAssets) {
      return;
    }

    if (storagePrimaryAssets === 'undefined') {
      localStorage.removeItem('primaryAsset');
      return;
    }

    try {
      const getPrimaryAsset: IAssetBalance = JSON.parse(storagePrimaryAssets);
      setPrimaryAsset([getPrimaryAsset]);

      const newPrimaryAsset = otherAssets.find(
        asset => asset.assetId === getPrimaryAsset.assetId,
      );

      if (newPrimaryAsset) {
        localStorage.setItem('primaryAsset', JSON.stringify(newPrimaryAsset));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updatePrimaryAsset();
  }, [otherAssets]);

  useEffect(() => {
    getAccountBalance();
  }, [walletAddress]);

  return (
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
        {walletAddress && <small>{parseAddress(walletAddress, 25)}</small>}

        <ReloadContainer>
          <BalanceContainer>
            <ContainerAsset onClick={() => setExpandAssets(!expandAssets)}>
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
                  <span>{balance['klv']}</span>
                  <KLV />
                </>
              )}
              <SpanDropdown {...dropdownProps}>
                <DropdownIcon $openOtherAssets={!expandAssets} />
                {expandAssets && otherAssets.length > 0 && (
                  <OtherAssetsContainer isMobile={isMobile}>
                    {otherAssets.map((asset: any) => (
                      <div
                        key={JSON.stringify(asset)}
                        onClick={() => {
                          onClickSetAssetPrimary(asset.assetId, asset.balance);
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
              onClick={() => getAccountBalance()}
              $loading={loadingBalance}
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
        <SubSection active={openNetworks}>
          <ActionItem
            onClick={() => {
              setOpenNetworks(!openNetworks);
            }}
            active={openNetworks}
          >
            <Plug />
            <p>Change Network</p>
            <RiArrowDownSLine size={'1.2em'} />
          </ActionItem>
          {openNetworks && (
            <>
              <ActionItem
                onClick={() => {
                  if (network === 'Mainnet') {
                    return;
                  }
                  router.push(getNetworkPath('mainnet'));
                  setOpenUserInfos(false);
                }}
                secondary
                disabled={network === 'Mainnet'}
              >
                <p>Mainnet</p>
                {network === 'Mainnet' && <Check />}
              </ActionItem>
              <ActionItem
                onClick={() => {
                  if (network === 'Testnet') {
                    return;
                  }
                  router.push(getNetworkPath('testnet'));
                  setOpenUserInfos(false);
                }}
                secondary
                disabled={network === 'Testnet'}
              >
                <p>Testnet</p>
                {network === 'Testnet' && <Check />}
              </ActionItem>
            </>
          )}
        </SubSection>

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
    </UserInfoContainer>
  );
};
