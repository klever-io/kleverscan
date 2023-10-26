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
import {
  processITOPrecisions,
  requestAssetsList,
  requestITOss,
} from '@/services/requests/ito';
import { IAsset, IITO, IParsedITO } from '@/types';
import { IPackInfo } from '@/types/contracts';
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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useQuery } from 'react-query';

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

const ITOsPage: React.FC = () => {
  const [selectedITO, setSelectedITO] = useState<null | IParsedITO>(null);
  const [txHash, setTxHash] = useState('');
  const router = useRouter();
  const { isMobile } = useMobile();
  const { extensionInstalled, connectExtension } = useExtension();

  const { getInteractionsButtons } = useContractModal();

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading: isLoadingITos,
    refetch: refetchITos,
  } = useInfiniteQuery(
    'ITOss',
    ({ pageParam = 1 }) => requestITOss(router, pageParam),
    {
      getNextPageParam: lastPage => {
        if (lastPage) {
          const { self, totalPages } = lastPage?.pagination;
          if (totalPages > self) {
            return self + 1;
          }
        }
      },
    },
  );
  const itemsITOs = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.itos];
    }, []);
  }, [data]);

  const {
    data: assetsList,
    isLoading: assetListLoading,
    refetch: refetchAssetsList,
    isFetching: isFetchingAssets,
  } = useQuery({
    queryKey: `assetList-${itemsITOs}`,
    queryFn: () => requestAssetsList(itemsITOs as IITO[]),
    enabled: !!itemsITOs,
  });

  useEffect(() => {
    parseITOs();
    refetchAssetsList();
  }, [itemsITOs, isFetching, assetsList]);

  const parseITOs = async (): Promise<IParsedITO | never[]> => {
    if (itemsITOs && assetsList && !isFetchingAssets) {
      const packsPrecisionCalls: Promise<IITO>[] = [];
      itemsITOs.forEach((ITO: IITO, index: number) => {
        const asset = assetsList.find(
          (asset: IAsset) => asset.assetId === itemsITOs[index].assetId,
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

  const requestWithLoading = async () => {
    refetchITos();
    refetchAssetsList();
  };

  useEffect(() => {
    requestWithLoading();
  }, [router?.query?.active]);

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

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
    refetchITos();
    refetchAssetsList();
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
      isHiddenInput: false,
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
              dataLength={itemsITOs?.length || 0}
              next={() => {
                fetchNextPage();
              }}
              hasMore={!!hasNextPage}
              loader={<Loader />}
              scrollableTarget={'scrollableDiv'}
              endMessage={
                itemsITOs && itemsITOs?.length
                  ? 'All ITOs have been loaded.'
                  : ''
              }
            >
              <Scroll>
                {itemsITOs &&
                  itemsITOs.length > 0 &&
                  itemsITOs.map((ITO: IParsedITO) => {
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

              {selectedITO && !isLoadingITos ? (
                displayITO()
              ) : (
                <ChooseAsset>
                  {!selectedITO && !isLoadingITos && (
                    <span>Choose an asset</span>
                  )}
                  {isLoadingITos && <Loader height={70} width={100} />}
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
