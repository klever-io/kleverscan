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
  parseITOsRequest,
  requestAssetsList,
  requestITOs,
} from '@/services/requests/ito';
import { IITOsResponse, IParsedITO } from '@/types';
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
import { GetStaticProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';

export const displayITOpacks = (
  ITO: IParsedITO,
  setTxHash: Dispatch<SetStateAction<string>>,
  t: TFunction,
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
                <KeyLabel>{`${t('priceIn')} ${item.key}`}</KeyLabel>
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
          <span>{t('noPacksFound')}</span>
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

  const { t } = useTranslation('itos');

  const { getInteractionsButtons } = useContractModal();

  const requestInfiniteQuery = async ({ pageParam = 1 }) => {
    const dataITOs = await requestITOs(router, pageParam);
    const assets = await requestAssetsList(dataITOs);
    await parseITOsRequest(dataITOs, assets);
    return dataITOs;
  };

  const nextPageRequest = (lastPage: IITOsResponse) => {
    if (lastPage) {
      const { self, totalPages } = lastPage?.pagination;
      if (totalPages > self) {
        return self + 1;
      }
    }
  };
  const {
    data,
    fetchNextPage: nextPageITOs,
    isFetching,
    hasNextPage,
    isLoading: isLoadingITOs,
    refetch: refetchITOs,
  } = useInfiniteQuery('ITOss', requestInfiniteQuery, {
    getNextPageParam: nextPageRequest,
    enabled: !!router.isReady,
  });

  const itemsITOs = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data.itos];
  }, []);

  const requestWithLoading = async () => {
    refetchITOs();
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
      return t('status.active');
    } else if (active === 'true') {
      return t('status.active');
    }
    router['query']['active'] = 'false';
    return t('status.inactive');
  };

  const updateSearchInput = (e: Event) => {
    const value: string = (e.target as HTMLInputElement).value;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, asset: value },
    });
    refetchITOs();
  };

  const filters: IFilter[] = [
    {
      firstItem: t('status.active'),
      data: [t('status.inactive')],
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
        refetchITOs();
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
              placeholder={t('searchInput')}
              onChange={e => updateSearchInput(e)}
              handleConfirmClick={() => requestWithLoading()}
            />
            <ITOSearchButton onClick={requestWithLoading}>
              {t('searchButton')}
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
                nextPageITOs();
              }}
              hasMore={!!hasNextPage}
              loader={<Loader />}
              scrollableTarget={'scrollableDiv'}
              endMessage={
                itemsITOs && itemsITOs?.length ? t('loadedAllITO') : ''
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
                  <KeyLabel>{`${t('priceIn')} ${item.key}`}</KeyLabel>
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
            <span>{t('noPacksFound')}</span>
          </ChooseAsset>
        )}
      </>
    );
  };

  const [ConfigITOButton] = getInteractionsButtons([
    {
      title: t('createITOButton'),
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

              {selectedITO && !isLoadingITOs ? (
                displayITO()
              ) : (
                <ChooseAsset>
                  {!selectedITO && !isLoadingITOs && (
                    <span>{t('chooseAsset')}</span>
                  )}
                  {isLoadingITOs && <Loader height={70} width={100} />}
                </ChooseAsset>
              )}
            </div>
          </ITOContent>
        </MainContent>
      </ITOContainer>
    </MainContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['itos'],
    nextI18nextConfig,
  );

  return { props };
};

export default ITOsPage;
