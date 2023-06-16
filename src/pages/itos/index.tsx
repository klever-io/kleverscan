import { Assets as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Filter, { IFilter } from '@/components/Filter';
import { default as FungibleITO } from '@/components/FungibleITO';
import { Container } from '@/components/FungibleITO/styles';
import Input from '@/components/Input';
import Title from '@/components/Layout/Title';
import { Loader } from '@/components/Loader/styles';
import NonFungibleITO from '@/components/NonFungileITO';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { IAsset, IITO, IParsedITO } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  AssetContainer,
  AssetsList,
  ChooseAsset,
  CloseIcon,
  ConfigITOButtonWrapper,
  HashAndCopy,
  HashContent,
  Header,
  IDAsset,
  ItemsContainer,
  ITOContainer,
  ITOContent,
  ITOSearchButton,
  ITOTitle,
  KeyLabel,
  LineInputSection,
  MainContainer,
  MainContent,
  PackContainer,
  Scroll,
  Scrollable,
  SearchContainer,
  SideList,
} from '@/views/itos';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export const displayITOpacks = (
  ITO: IParsedITO,
  setTxHash: Dispatch<SetStateAction<string>>,
): JSX.Element => {
  return (
    <>
      <ITOTitle>
        <span>{ITO && ITO?.assetId}</span>
      </ITOTitle>
      {ITO?.assetType === 'Fungible'
        ? ITO?.packData?.map((packInfo: IPackInfo, packInfoIndex: number) => {
            return (
              <Container key={packInfoIndex}>
                <FungibleITO
                  packInfo={packInfo}
                  ITO={ITO}
                  setTxHash={setTxHash}
                  packInfoIndex={packInfoIndex}
                />
              </Container>
            );
          })
        : ITO?.packData?.map((item: any, index) => {
            return (
              <PackContainer key={index + ITO.assetId}>
                <KeyLabel>{`Price in ${item.key}`}</KeyLabel>
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
          })}
      {!ITO?.packData && (
        <ChooseAsset>
          {' '}
          <span>No packs found.</span>
        </ChooseAsset>
      )}
    </>
  );
};

export const processITOPrecisions = async (
  ITO: IITO,
  assetPrecision: number,
): Promise<IITO> => {
  ITO.packData.forEach(async packInfo => {
    const keyPrecision = await getPrecision(packInfo.key);
    packInfo.packs.forEach(pack => {
      pack.price = pack.price / 10 ** keyPrecision;
      pack.amount = pack.amount / 10 ** assetPrecision;
    });
  });
  return ITO;
};

export const parseITOs = async (
  ITOs: IITO[],
): Promise<IParsedITO | never[]> => {
  const assetsInput: string = ITOs.map(ITO => ITO.assetId).join(',');
  const packsPrecisionCalls: Promise<IITO>[] = [];
  const res = await api.get({
    route: `assets/list?asset=${assetsInput}`,
  });
  if (!res.error || res.error === '') {
    const assets = res.data.assets;
    ITOs.forEach((ITO, index) => {
      const asset = assets.find(
        (asset: IAsset) => asset.assetId === ITOs[index].assetId,
      );
      ITO.maxAmount = ITO.maxAmount / 10 ** asset.precision;
      ITO['ticker'] = asset.ticker;
      ITO['assetType'] = asset.assetType;
      ITO['precision'] = asset.precision;
      ITO['assetLogo'] = asset.logo;
      packsPrecisionCalls.push(processITOPrecisions(ITO, asset.precision));
    });
    await Promise.allSettled(packsPrecisionCalls);
  }
  return [];
};

const ITOsPage: React.FC = () => {
  const [ITOs, setITOs] = useState<IParsedITO[]>([]);
  const [lastPage, setLastPage] = useState(0);
  const [selectedITO, setSelectedITO] = useState<null | IParsedITO>(null);
  const [page, setPage] = useState(1);
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isMobile } = useMobile();
  const { extensionInstalled, connectExtension } = useExtension();

  const { getInteractionsButtons } = useContractModal();

  const requestITOs = async (tempPage?: number) => {
    const asset = router?.query?.asset ?? '';
    const itoPage = tempPage ?? page;
    const isActive = router?.query?.active ?? true;
    return api.get({
      route: `ito/list`,
      query: { page: itoPage, active: isActive, asset },
    });
  };

  const requestITOsAndReset = async () => {
    const res = await requestITOs(1);
    if (!res.error || res.error === '') {
      const newITOs = res?.data?.itos || [];
      await parseITOs(newITOs);
      setPage(1);
      setLastPage(res.pagination.totalPages);
      setITOs(newITOs);
    }
  };

  const requestITOsAndAddMore = async () => {
    const res = await requestITOs();
    if (!res.error || res.error === '') {
      const newITOs = res?.data?.itos || [];
      await parseITOs(newITOs);
      const allITOs = [...ITOs, ...newITOs];
      setLastPage(res.pagination.totalPages);
      setITOs(allITOs);
    }
  };

  const parseITOs = async (ITOs: IITO[]): Promise<IParsedITO | never[]> => {
    const assetsInput: string = ITOs.map(ITO => ITO.assetId).join(',');
    const packsPrecisionCalls: Promise<IITO>[] = [];
    const res = await api.get({
      route: `assets/list?asset=${assetsInput}`,
    });
    if (!res.error || res.error === '') {
      const assets = res.data.assets;
      ITOs.forEach((ITO, index) => {
        const asset = assets.find(
          (asset: IAsset) => asset.assetId === ITOs[index].assetId,
        );
        ITO.maxAmount = ITO.maxAmount / 10 ** asset.precision;
        ITO['ticker'] = asset.ticker;
        ITO['assetType'] = asset.assetType;
        ITO['precision'] = asset.precision;
        ITO['assetLogo'] = asset.logo;
        packsPrecisionCalls.push(processITOPrecisions(ITO, asset.precision));
      });
      await Promise.allSettled(packsPrecisionCalls);
    }
    return [];
  };

  const processITOPrecisions = async (
    ITO: IITO,
    assetPrecision: number,
  ): Promise<IITO> => {
    ITO.packData.forEach(async packInfo => {
      const keyPrecision = await getPrecision(packInfo.key);
      packInfo.packs.forEach(pack => {
        pack.price = pack.price / 10 ** keyPrecision;
        pack.amount = pack.amount / 10 ** assetPrecision;
      });
    });
    return ITO;
  };

  const requestWithLoading = async () => {
    setLoading(true);
    await requestITOsAndReset();
    setLoading(false);
  };

  useEffect(() => {
    requestWithLoading();
  }, [router?.query?.active]);

  useEffect(() => {
    if (page > 1) {
      requestITOsAndAddMore();
    }
  }, [page]);

  if (extensionInstalled) {
    connectExtension();
  }

  const paginateITOs = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const getActive = () => {
    const active = router?.query?.active;
    if (typeof active === 'undefined') {
      router['query']['active'] = 'true';
      return 'Active';
    } else if (active === 'true') {
      return 'Active';
    }
    router['query']['active'] = 'false';
    return 'Inactive';
  };

  const updateSearchInput = (e: Event) => {
    const value: string = (e.target as HTMLInputElement).value;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, asset: value },
    });
  };

  const filters: IFilter[] = [
    {
      firstItem: 'Active',
      data: ['Inactive'],
      onClick: (value: string) => {
        router.push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              active: value === 'Active' ? 'true' : 'false',
            },
          },
          undefined,
          {
            shallow: true,
          },
        );
      },
      current: getActive(),
      inputType: 'button',
    },
  ];
  const ITOTable = () => {
    return (
      <>
        <AssetsList>
          <SearchContainer>
            <Input
              containerStyles={{ width: '100%' }}
              type="text"
              value={router.query.asset as string}
              placeholder="Type asset name"
              onChange={e => updateSearchInput(e)}
              handleConfirmClick={() => requestWithLoading()}
            />
            <ITOSearchButton onClick={requestWithLoading}>
              Search
            </ITOSearchButton>
          </SearchContainer>
          {filters.map(filter => (
            <Filter key={JSON.stringify(filter)} {...filter} />
          ))}
          <Scrollable id="scrollableDiv">
            <InfiniteScroll
              style={{
                gap: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom: 15,
              }}
              dataLength={ITOs?.length}
              next={paginateITOs}
              hasMore={page >= lastPage ? false : true}
              loader={<Loader />}
              scrollableTarget={'scrollableDiv'}
              endMessage={ITOs?.length ? 'All ITOs have been loaded.' : ''}
            >
              <Scroll>
                {ITOs.length > 0 &&
                  ITOs.map((ITO: IParsedITO) => {
                    return (
                      <AssetContainer
                        selected={selectedITO?.assetId === ITO.assetId}
                        key={ITO.assetId}
                        onClick={() => setSelectedITO(ITO)}
                      >
                        <IDAsset>
                          <span>{ITO.assetId}</span>
                        </IDAsset>
                      </AssetContainer>
                    );
                  })}
              </Scroll>
            </InfiniteScroll>
          </Scrollable>
        </AssetsList>
        {isMobile && <LineInputSection />}
      </>
    );
  };

  const displayITO = () => {
    return (
      <>
        <ITOTitle>
          <span>{selectedITO && selectedITO?.assetId}</span>
        </ITOTitle>
        {selectedITO?.assetType === 'Fungible'
          ? selectedITO?.packData?.map(
              (packInfo: IPackInfo, packInfoIndex: number) => {
                return (
                  <Container key={packInfoIndex}>
                    <FungibleITO
                      packInfo={packInfo}
                      ITO={selectedITO}
                      setTxHash={setTxHash}
                      packInfoIndex={packInfoIndex}
                    />
                  </Container>
                );
              },
            )
          : selectedITO?.packData?.map((item: any, index) => {
              return (
                <PackContainer key={index + selectedITO.assetId}>
                  <KeyLabel>{`Price in ${item.key}`}</KeyLabel>
                  <ItemsContainer>
                    {item.packs.map((pack: any, index: number) => {
                      return (
                        <NonFungibleITO
                          key={`${index}${item.assetId}`}
                          pack={pack}
                          currencyId={item.key}
                          selectedITO={selectedITO}
                          setTxHash={setTxHash}
                        />
                      );
                    })}
                  </ItemsContainer>
                </PackContainer>
              );
            })}
        {!selectedITO?.packData && (
          <ChooseAsset>
            {' '}
            <span>No packs found.</span>
          </ChooseAsset>
        )}
      </>
    );
  };

  const [ConfigITOButton] = getInteractionsButtons([
    {
      title: 'Create ITO',
      contractType: 'ConfigITOContract',
    },
  ]);

  return (
    <MainContainer>
      <ITOContainer>
        <Header>
          <Title title="ITOs" Icon={Icon} />
          <ConfigITOButtonWrapper>
            <ConfigITOButton />
          </ConfigITOButtonWrapper>
        </Header>
        <MainContent>
          <SideList>
            <AssetsList>{ITOTable()}</AssetsList>
          </SideList>
          <ITOContent>
            <div>
              {txHash && (
                <HashContent>
                  <HashAndCopy>
                    <Link href={{ pathname: `transaction/${txHash}` }}>
                      <a> Hash: {txHash}</a>
                    </Link>
                    <Copy data={txHash} info={'Transaction hash'} />
                  </HashAndCopy>
                  <div>
                    <CloseIcon size={23} onClick={() => setTxHash('')} />
                  </div>
                </HashContent>
              )}

              {selectedITO && !loading ? (
                displayITO()
              ) : (
                <ChooseAsset>
                  {!selectedITO && !loading && <span>Choose an asset</span>}
                  {loading && <Loader height={70} width={100} />}
                </ChooseAsset>
              )}
            </div>
          </ITOContent>
        </MainContent>
      </ITOContainer>
    </MainContainer>
  );
};

export default ITOsPage;
