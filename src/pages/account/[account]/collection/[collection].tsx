import { PropsWithChildren, useMemo, useRef, useCallback } from 'react';
import { Validators as Icon } from '@/assets/cards';
import Detail from '@/components/Detail';
import { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  CustomLink,
  NftImage,
  NftImageContainer,
  NftImageEmpty,
  NftImageError,
  ViewToggleContainer,
  ViewToggleButton,
  GridContainer,
  NftSearchContainer,
  NftInputContainer,
  NoNftsFound,
} from '@/styles/common';
import { INfts, IPagination, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import {
  getStorageViewMode,
  setQueryAndRouter,
  storageViewMode,
} from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Skeleton from '@/components/Skeleton';
import NftCardView from '@/components/NftCardView';

import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import { Search } from '@/assets/icons';

interface ICollectionPage {
  collection: INfts[];
  pagination: IPagination;
  address: string;
  collectionAsset: string;
}

interface INftImage {
  [key: string]: {
    url: string;
    loading: boolean;
    error: boolean;
  };
}

const Collection: React.FC<PropsWithChildren<ICollectionPage>> = () => {
  const header = [
    'Image',
    'ID',
    'Collection Name',
    'Collection Id',
    'Address',
    '',
  ];
  const [isTablet, setIsTablet] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [collection, setCollection] = useState<null | string>(null);
  const [metadata, setMetadata] = useState<null | string>(null);
  const [nftImages, setNftImages] = useState<INftImage>({});
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() =>
    getStorageViewMode(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [nfts, setNfts] = useState<INfts[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tabletWindow = window.innerWidth <= 1025 && window.innerWidth >= 769;
    setIsTablet(tabletWindow);
  });

  useEffect(() => {
    if (router.isReady) {
      setAddress(router.query.account as string);
      setCollection(router.query.collection as string);
    }
  }, [router.isReady]);

  const requestCollection = useCallback(
    async (page: number, limit: number, searchTerm?: string) => {
      setLoading(true);
      try {
        const searchValue =
          searchTerm !== undefined ? searchTerm : debouncedSearch;
        const actualLimit = searchValue.trim() !== '' ? 1000 : limit;

        const response = await api.get({
          route: `address/${address}/collection/${collection}?page=${page}&limit=${actualLimit}`,
        });
        let filteredNfts = [];
        const collectionData = response?.data?.collection || [];
        if (searchValue.trim() !== '' && searchValue.trim() !== undefined) {
          filteredNfts = collectionData.filter((nft: INfts) =>
            nft.nftNonce.toString().includes(searchValue),
          );
          setNfts(filteredNfts);
          setPagination(null);
          return { data: { collection: filteredNfts } };
        } else {
          setNfts(collectionData);
          setPagination(response?.pagination || null);
          setCurrentPage(page);
          return response;
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [address, collection, debouncedSearch],
  );

  const requestMetadata = async () => {
    try {
      const assetId = router.query.collection as string;
      const response = await api.get({
        route: `assets/${assetId}`,
      });
      const uris = response.data.asset.uris;
      const metadataUri = uris?.find(
        (uri: { key: string; value: string }) => uri.key === 'metadata',
      );
      const nftMetadata = metadataUri ? metadataUri.value : null;
      setMetadata(nftMetadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setMetadata(null);
    }
  };

  const fetchNftImage = async (metadataUrl: string, nftId: string) => {
    setNftImages(prev => ({
      ...prev,
      [nftId]: { url: '', loading: true, error: false },
    }));

    try {
      const fullUrl = `${metadataUrl}/${nftId}`;
      const response = await fetch(
        `/api/nft-metadata?url=${encodeURIComponent(fullUrl)}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setNftImages(prev => ({
            ...prev,
            [nftId]: { url: data.image, loading: false, error: false },
          }));
        } else {
          setNftImages(prev => ({
            ...prev,
            [nftId]: { url: '', loading: false, error: true },
          }));
        }
      } else {
        setNftImages(prev => ({
          ...prev,
          [nftId]: { url: '', loading: false, error: true },
        }));
      }
    } catch (error) {
      console.error(`Error fetching NFT image for ID ${nftId}:`, error);
      setNftImages(prev => ({
        ...prev,
        [nftId]: { url: '', loading: false, error: true },
      }));
    }
  };

  useEffect(() => {
    if (address && collection) {
      requestMetadata();
      requestCollection(1, 12);
    }
  }, [address, collection, requestCollection]);

  useEffect(() => {
    if (router.query.page && address && collection) {
      const pageFromUrl = Number(router.query.page);
      if (pageFromUrl !== currentPage && pageFromUrl > 0) {
        setCurrentPage(pageFromUrl);
        requestCollection(pageFromUrl, 12);
      }
    }
  }, [router.query.page, address, collection, requestCollection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setTableRefreshKey(prev => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (address && collection) {
      requestCollection(1, 12, debouncedSearch);
    }
  }, [debouncedSearch, address, collection, requestCollection]);

  useEffect(() => {
    if (!metadata || nfts.length === 0) return;

    const idsToFetch = nfts
      .map(n => n.assetId?.split('/')[1])
      .filter((id): id is string => !!id && !nftImages[id]);

    idsToFetch.forEach(id => {
      fetchNftImage(metadata, id);
    });
  }, [metadata, nfts, nftImages]);

  const { isMobile } = useMobile();

  const rowSections = (nft: INfts): IRowSection[] => {
    const { address, assetName: collection, assetId } = nft;

    const collectionId = assetId?.split('/')[0];
    const nftId = assetId?.split('/')[1];

    const sections: IRowSection[] = address
      ? [
          {
            element: props =>
              nftImages[nftId]?.loading ? (
                <Skeleton width={50} height={50} />
              ) : (
                <NftImageContainer key={`image-${assetId}`}>
                  {nftImages[nftId]?.url ? (
                    <NftImage
                      src={nftImages[nftId].url}
                      alt={`NFT ${nftId}`}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : nftImages[nftId]?.error ? (
                    <NftImageError>Error</NftImageError>
                  ) : (
                    <NftImageEmpty>-</NftImageEmpty>
                  )}
                </NftImageContainer>
              ),
            span: 1,
          },
          {
            element: props => <span key={assetId}>#{nftId}</span>,
            span: 1,
          },
          {
            element: props => <span key={collection}>{collection}</span>,
            span: 1,
          },
          {
            element: props => <span key={collectionId}>{collectionId}</span>,
            span: 1,
          },
          {
            element: props => (
              <Link href={`/account/${address}`} key={address} legacyBehavior>
                {isMobile
                  ? parseAddress(address, 14)
                  : address || isTablet
                    ? parseAddress(address, 20)
                    : address}
              </Link>
            ),
            span: 1,
          },
          {
            element: props => (
              <Link
                href={`/asset/${collectionId}/${nftId}`}
                key={assetId}
                legacyBehavior
              >
                <CustomLink>Details</CustomLink>
              </Link>
            ),
            span: 1,
          },
        ]
      : [{ element: props => <></>, span: 1 }];

    return sections;
  };

  const tableProps: ITable = {
    type: 'nfts',
    header,
    rowSections,
    dataName: 'collection',
    request: (page: number, limit: number) =>
      requestCollection(page, limit, debouncedSearch),
    refreshKey: tableRefreshKey,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setCurrentPage(1);

    if (searchValue === '') {
      setDebouncedSearch('');
      setTableRefreshKey(prev => prev + 1);
    }
  };

  const handleImageError = (nftId: string) => {
    setNftImages(prev => ({
      ...prev,
      [nftId]: { url: '', loading: false, error: true },
    }));
  };

  const renderGridView = () => {
    if (loading) {
      return (
        <GridContainer>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} width={250} height={300} />
          ))}
        </GridContainer>
      );
    }

    return (
      <>
        {nfts.length === 0 && debouncedSearch.trim() !== '' ? (
          <NoNftsFound role="status" aria-live="polite">
            No NFTs found matching "{debouncedSearch}"
          </NoNftsFound>
        ) : (
          <GridContainer>
            {nfts.map(nft => {
              const { assetId } = nft;
              const nftId = assetId?.split('/')[1];

              return (
                <NftCardView
                  key={assetId}
                  nft={nft}
                  nftImages={nftImages}
                  metadata={metadata}
                  onImageError={handleImageError}
                />
              );
            })}
          </GridContainer>
        )}

        {pagination && debouncedSearch.trim() === '' && (
          <PaginationContainer>
            <Pagination
              tableRef={gridRef}
              count={pagination?.totalPages || 1}
              page={currentPage}
              onPaginate={page => {
                setCurrentPage(page);
                setQueryAndRouter(
                  { ...router.query, page: page.toString() },
                  router,
                );
                requestCollection(page, 12, debouncedSearch);
              }}
            />
          </PaginationContainer>
        )}
      </>
    );
  };

  const viewModeToggle = () => {
    const handleViewModeChange = (newViewMode: 'table' | 'grid') => {
      setViewMode(newViewMode);
      storageViewMode(newViewMode);
    };

    return (
      <NftSearchContainer>
        <NftInputContainer>
          <input
            type="text"
            placeholder="Search NFT By Id"
            value={search}
            aria-label="Search NFT by ID"
            autoComplete="off"
            inputMode="numeric"
            onChange={handleSearchChange}
          />
          <Search />
        </NftInputContainer>
        <ViewToggleContainer>
          <ViewToggleButton
            active={viewMode === 'table'}
            onClick={() => handleViewModeChange('table')}
          >
            Table View
          </ViewToggleButton>
          <ViewToggleButton
            active={viewMode === 'grid'}
            onClick={() => handleViewModeChange('grid')}
          >
            Grid View
          </ViewToggleButton>
        </ViewToggleContainer>
      </NftSearchContainer>
    );
  };

  const detailProps = {
    title: `NFT Collection - ${collection}`,
    headerIcon: Icon,
    cards: undefined,
    dataName: 'collection',
    tableProps: viewMode === 'table' ? tableProps : undefined,
    route: `/account/${address}`,
    customContent: viewMode === 'grid' ? renderGridView() : undefined,
    customHeader: viewModeToggle(),
  };

  return <>{address && collection && <Detail {...detailProps} />}</>;
};

export default Collection;
