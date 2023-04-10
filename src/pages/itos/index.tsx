import { Assets as Icon } from '@/assets/title-icons';
import ModalContract from '@/components/Contract/ModalContract';
import Copy from '@/components/Copy';
import { default as FungibleITO } from '@/components/FungibleITO';
import { Container } from '@/components/FungibleITO/styles';
import Input from '@/components/Input';
import Title from '@/components/Layout/Title';
import { Loader } from '@/components/Loader/styles';
import NonFungibleITO from '@/components/NonFungileITO';
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
  CreateITOButton,
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

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
    route: `assets/kassets?asset=${assetsInput}`,
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
  const [search, setSearch] = useState('');
  const [lastPage, setLastPage] = useState(0);
  const [selectedITO, setSelectedITO] = useState<null | IParsedITO>(null);
  const [page, setPage] = useState(1);
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { isMobile } = useMobile();
  const { extensionInstalled, connectExtension } = useExtension();

  const requestITOs = async () => {
    const res = await api.get({
      route: `ito/list?page=${page}`,
    });
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
      route: `assets/kassets?asset=${assetsInput}`,
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
    await requestITOs();
    setLoading(false);
  };

  useEffect(() => {
    requestWithLoading();
  }, []);

  useEffect(() => {
    if (page > 1) {
      requestITOs();
    }
  }, [page]);

  if (extensionInstalled) {
    connectExtension();
  }

  // TODO: activate this commented function when query for ITOs partial name
  // const findITO = (input: string): IParsedITO | null => {
  //   if (ITOs) {
  //     return ITOs.find(ITO => ITO.assetId.includes(input)) || null;
  //   }
  //   return null;
  // };

  const findITO = async (): Promise<IParsedITO | null> => {
    if (ITOs) {
      const res = await api.get({
        route: `ito/${search}`,
      });
      if (!res.error || res.error === '') {
        const ITO = res.data.ito;
        await parseITOs([ITO]);
        return ITO;
      }
      toast.error('Could not find ITO.');
    }
    return null;
  };

  const filterITOs = (input: string): IParsedITO[] | null => {
    if (ITOs.length) {
      // return ITOs.filter((ITO) => ITO.assetId.includes(input))
      // TODO: refactor when query for ITOs partial name
      return ITOs;
    }
    return null;
  };

  const handleConfirmClick = async () => {
    setLoading(true);
    const ITOResult = await findITO();
    setLoading(false);
    setSelectedITO(ITOResult);
  };

  const paginateITOs = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const ITOTable = () => {
    const filteredITOs = filterITOs(search);
    return (
      <>
        <AssetsList>
          <SearchContainer>
            <Input
              containerStyles={{ width: '100%' }}
              type="text"
              value={search}
              placeholder="Type asset name"
              onChange={e => {
                setSearch(e.target.value.toUpperCase());
              }}
              handleConfirmClick={() => handleConfirmClick()}
            />
            <ITOSearchButton onClick={handleConfirmClick}>
              Search
            </ITOSearchButton>
          </SearchContainer>
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
              hasMore={(page >= lastPage ? false : true) && !search}
              loader={<Loader />}
              scrollableTarget={'scrollableDiv'}
              endMessage={ITOs?.length ? 'All ITOs have been loaded.' : ''}
            >
              <Scroll>
                {filteredITOs &&
                  filteredITOs.map((ITO: IParsedITO) => {
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

  const modalOptions = {
    contractType: 'ConfigITOContract',
    setOpenModal: setModalOpen,
    openModal: modalOpen,
    title: 'Create ITO',
  };

  return (
    <MainContainer>
      <ITOContainer>
        <Header>
          <Title title="ITOs" Icon={Icon} />
          <CreateITOButton onClick={() => setModalOpen(true)}>
            Create ITO
          </CreateITOButton>
        </Header>
        <ModalContract {...modalOptions} />
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

              {selectedITO ? (
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
