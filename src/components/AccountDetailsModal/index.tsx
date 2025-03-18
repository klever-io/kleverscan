import { KLV } from '@/assets/coins';
import { Wallet, ArrowRight, CategoryTransparent } from '@/assets/icons';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  IAccountBalance,
  getAccountBalanceRequest,
} from '@/services/requests/account';
import { getNetwork } from '@/utils/networkFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MdContentCopy } from 'react-icons/md';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Copy from '../Copy';
import {
  AccordionContent,
  ActionItem,
  AssetContent,
  AssetItem,
  AssetName,
  AssetPrice,
  BodyContent,
  MyProjectsContainer,
  MyProjectsContent,
  MyWalletContainer,
  MyWalletContent,
  MyWalletInfo,
  OwnedItem,
  Pill,
  PrimaryAssetContent,
  ProgressBarContainer,
  ProgressBarFill,
  QRCodeContent,
  SeeTokens,
  SubSection,
  TransactionContainer,
  TransactionContent,
  UserInfoContainer,
} from './styles';
import { getAssetsByOwner, getOwnedAssets } from '@/services/requests/asset';

import AssetLogo from '../Logo/AssetLogo';

export interface IAssetBalance {
  assetId: string;
  assetName: string;
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

export const AccountDetailsModal: React.FC<
  PropsWithChildren<IAccountDetailsModal>
> = ({ openUserInfos, setOpenUserInfos }) => {
  const [primaryAsset, setPrimaryAsset] = useState<IAssetBalance[]>([]);
  const [expandAssets, setExpandAssets] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [openNetworks, setOpenNetworks] = useState<boolean>(false);
  const [openWallet, setOpenWallet] = useState<boolean>(true);
  const [openCategory, setOpenCategory] = useState<boolean>(false);

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

  const reorderAssets = (
    assets: IAssetBalance[],
  ): { firstFour: IAssetBalance[]; remaining: IAssetBalance[] } => {
    const klvIndex = assets.findIndex(asset => asset.assetId === 'KLV');
    const kfiIndex = assets.findIndex(asset => asset.assetId === 'KFI');

    const result = [...assets];

    if (klvIndex !== -1) {
      const [klv] = result.splice(klvIndex, 1);
      result.unshift(klv);
    }

    if (kfiIndex !== -1 && kfiIndex !== 0) {
      const [kfi] = result.splice(kfiIndex, 1);
      result.splice(1, 0, kfi);
    }

    const firstFour = result.slice(0, 4);
    const remaining = result.slice(4);

    return { firstFour, remaining };
  };

  const { balance, otherAssets } = useMemo(() => {
    if (data) {
      const { balance, otherAssets } = data;
      const { firstFour, remaining } = reorderAssets(otherAssets);

      return {
        balance,
        otherAssets: {
          firstFour,
          remaining,
        },
      };
    }
    return {
      balance: {
        klv: '',
      },
      otherAssets: {
        firstFour: [],
        remaining: [],
      },
    };
  }, [data]);

  const assetIds = otherAssets.firstFour.map(asset => asset.assetId);

  const { data: ownedAssets } = useQuery({
    queryKey: ['ownedAssets', walletAddress],
    queryFn: () => getOwnedAssets(walletAddress),
    enabled: !!walletAddress,
  });

  const calculatePoolMetrics = asset => {
    if (!asset.poolData) {
      return {
        available: 0,
        quotient: 0,
        used: 0,
        total: 0,
      };
    }

    const { precision } = asset;
    const { klvBalance, kdaBalance, fRatioKDA, fRatioKLV } = asset.poolData;

    const parsedKLVBalance = klvBalance / 10 ** 6;

    const parsedKdaBalance = kdaBalance / 10 ** precision;

    const available = klvBalance / 10 ** 6;

    const quotient = fRatioKDA / 10 ** precision / (fRatioKLV / 10 ** 6);

    const totalKLVUsed = parsedKdaBalance / quotient;

    const total = totalKLVUsed + parsedKLVBalance;

    return {
      available,
      quotient,
      totalKLVUsed,
      total,
    };
  };

  const [openAccordions, setOpenAccordions] = useState(
    ownedAssets?.length ? [ownedAssets[0].assetId] : [],
  );

  const toggleAccordion = (assetId: string) => {
    setOpenAccordions(prev =>
      prev.includes(assetId)
        ? prev.filter(accordionId => accordionId !== assetId)
        : [...prev, assetId],
    );
  };

  const requestKLV = async () => {
    setLoadingBalance(true);
    const response = await api.post({
      route: `transaction/send-user-funds/${walletAddress}`,
    });

    if (response?.error) {
      const error =
        response?.error.replace('transaction generation failed:', '') ||
        'You already ordered KLV in less than 24 hours!';

      toast.error(error);
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

      const newPrimaryAsset = otherAssets.firstFour.find(
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
      <BodyContent>
        <SubSection active={openWallet}>
          <ActionItem
            onClick={() => {
              setOpenWallet(!openWallet);
            }}
            active={openWallet}
          >
            <Wallet />
            <p>My Wallet</p>
            <RiArrowDownSLine size={'1.5rem'} />
          </ActionItem>
          {openWallet && (
            <MyWalletContainer>
              <MyWalletContent>
                <MyWalletInfo>
                  <div>
                    {walletAddress && (
                      <span>{parseAddress(walletAddress, 15)}</span>
                    )}
                    {walletAddress && (
                      <Copy info="Wallet Address" data={walletAddress}>
                        <MdContentCopy size={'1rem'} />
                      </Copy>
                    )}
                  </div>

                  <div>
                    {primaryAsset.length > 0 ? (
                      <PrimaryAssetContent>
                        {primaryAsset[0].assetId === 'KLV' ? (
                          <KLV />
                        ) : (
                          <AssetLogo
                            logo=""
                            ticker={primaryAsset[0]?.assetId || ''}
                            name={primaryAsset[0]?.assetId || ''}
                            size={24}
                          />
                        )}
                        <span>{primaryAsset[0].balance || '---'}</span>
                      </PrimaryAssetContent>
                    ) : (
                      <PrimaryAssetContent>
                        <KLV />
                        <span>{balance['klv']}</span>
                      </PrimaryAssetContent>
                    )}
                  </div>
                </MyWalletInfo>
                <div>
                  {walletAddress && (
                    <QRCodeContent>
                      <div>
                        <QRCodeSVG value={walletAddress} size={100}></QRCodeSVG>
                      </div>
                    </QRCodeContent>
                  )}
                </div>
              </MyWalletContent>

              {otherAssets.firstFour.map((asset: any) => (
                <AssetItem
                  key={asset.assetId}
                  onClick={() => {
                    onClickSetAssetPrimary(asset.assetId, asset.balance);
                    setExpandAssets(false);
                  }}
                >
                  <div>
                    <AssetLogo
                      logo={asset?.logo || ''}
                      ticker={asset?.assetName || ''}
                      name={asset?.assetName || ''}
                      size={24}
                    />
                  </div>
                  <AssetContent>
                    <AssetName>
                      <p>{asset.assetId}</p>
                      <p>{asset.assetName}</p>
                    </AssetName>
                    <AssetPrice>
                      <p>{asset.balance}</p>
                    </AssetPrice>
                  </AssetContent>
                </AssetItem>
              ))}

              <Link
                href={`/account/${walletAddress}?tab=Assets`}
                onClick={() => setOpenUserInfos(false)}
              >
                <SeeTokens>
                  <p>
                    See all{' '}
                    {otherAssets.remaining.length +
                      otherAssets.firstFour.length}{' '}
                    tokens
                  </p>

                  <ArrowRight />
                </SeeTokens>
              </Link>
            </MyWalletContainer>
          )}
        </SubSection>

        {ownedAssets?.length && (
          <SubSection active={openCategory}>
            <ActionItem
              onClick={() => {
                setOpenCategory(!openCategory);
              }}
              active={openCategory}
            >
              <CategoryTransparent />
              <p>My Projects</p>
              <RiArrowDownSLine size={'1.5rem'} />
            </ActionItem>

            {openCategory && (
              <MyProjectsContainer>
                {ownedAssets.map(asset => {
                  const poolMetrics = asset.poolData
                    ? calculatePoolMetrics(asset)
                    : null;

                  return (
                    <MyProjectsContent key={asset.assetId}>
                      <OwnedItem
                        onClick={() => toggleAccordion(asset.assetId)}
                        active={openAccordions.includes(asset.assetId)}
                      >
                        <AssetLogo
                          logo={asset?.logo || ''}
                          ticker={asset?.ticker || ''}
                          name={asset?.name || ''}
                          size={24}
                        />
                        <p>{asset.name}</p>
                        <RiArrowDownSLine size={'1.5rem'} />
                      </OwnedItem>
                      {openAccordions.includes(asset.assetId) && (
                        <AccordionContent>
                          {asset.transactionData &&
                            asset.transactionLastDay && (
                              <TransactionContainer>
                                <TransactionContent>
                                  <p>Total transactions</p>
                                  {asset.transactionData?.totalRecords}
                                </TransactionContent>
                                <TransactionContent>
                                  <p>Last 24h</p>
                                  {asset.transactionLastDay &&
                                  asset.transactionLastDay.totalRecords > 0
                                    ? `+${asset.transactionLastDay.totalRecords}`
                                    : asset.transactionLastDay?.totalRecords ||
                                      0}
                                </TransactionContent>
                              </TransactionContainer>
                            )}

                          {poolMetrics && (
                            <TransactionContainer>
                              <TransactionContent>
                                <h2>KDA Fee Pool</h2>
                                <h3>{poolMetrics.available} available KLV</h3>
                                <h4>
                                  {poolMetrics.totalKLVUsed} /{' '}
                                  {poolMetrics.total} KLV
                                </h4>
                                <p>Usage</p>
                                <p
                                  style={{
                                    textAlign: 'right',
                                    marginTop: '4px',
                                    fontSize: '0.9em',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {(
                                    (poolMetrics.totalKLVUsed /
                                      poolMetrics.total) *
                                    100
                                  ).toFixed(2)}
                                  /100%
                                </p>
                                <ProgressBarContainer>
                                  <ProgressBarFill
                                    percentage={
                                      (poolMetrics.totalKLVUsed /
                                        poolMetrics.total) *
                                      100
                                    }
                                  />
                                </ProgressBarContainer>
                              </TransactionContent>
                            </TransactionContainer>
                          )}

                          <div style={{ width: '100%' }}>
                            <Link
                              href={`create-transaction?contract=DepositContract&contractDetails=%7B"depositType"%3A1%2C"collection"%3A"${asset.assetId}"%7D`}
                            >
                              <Pill
                                full={true}
                                bgColor="#AA33B5"
                                borderColor="#AA33B5"
                              >
                                Deposit to KDA Fee Pool
                              </Pill>
                            </Link>
                          </div>

                          <div style={{ width: '100%' }}>
                            <Link href={`/asset/${asset.assetId}`}>
                              <Pill full={true} borderColor="#AA33B5">
                                Go to KDA Fee Pool Page
                              </Pill>
                            </Link>
                          </div>

                          <div style={{ width: '100%' }}>
                            <Link href={`/asset/${asset.assetId}`}>
                              <Pill full={true}>Go to Asset page</Pill>
                            </Link>
                          </div>
                        </AccordionContent>
                      )}
                    </MyProjectsContent>
                  );
                })}
              </MyProjectsContainer>
            )}
          </SubSection>
        )}

        {/* <Link
          href={`/create-transaction`}
          onClick={() => setOpenUserInfos(false)}
        >
          <ActionItem>
            <IoCreateOutline size={'1.2rem'} />
            <p>Create Transaction</p>
            <RiArrowRightSLine size={'1.2em'} />
          </ActionItem>
        </Link> */}

        {/* <SubSection active={openNetworks}>
          <ActionItem
            onClick={() => {
              setOpenNetworks(!openNetworks);
            }}
            active={openNetworks}
          >
            <Plug size={'1.5rem'} />
            <p>Change Network</p>
            <RiArrowDownSLine size={'1.5rem'} />
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
        </SubSection> */}

        {/* {network === 'Testnet' && (
          <ActionItem onClick={requestKLV}>
            <IoMdAddCircle size={'1.2rem'} />
            <p>Request Test KLV</p>
          </ActionItem>
        )} */}
      </BodyContent>
    </UserInfoContainer>
  );
};
