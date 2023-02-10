/* eslint-disable @typescript-eslint/ban-types */
import api from '@/services/api';
import { IAsset, IAssetResponse } from '@/types';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPrecision } from '..';

export const useDidUpdateEffect = (fn: Function, inputs: Array<any>): void => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
};

export const useScroll = (
  condition: boolean,
  callback: (this: Window, ev: Event) => any,
): void => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (condition) {
        window.addEventListener('scroll', callback);
      } else {
        window.removeEventListener('scroll', callback);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', callback);
      }
    };
  }, [condition]);
};

export function usePrecision<T extends string | string[]>(
  assetIds: T,
): T extends string ? number : { [assetId: string]: number };
export function usePrecision(
  assetIds: string | string[],
): number | { [assetId: string]: number } {
  const [precision, setPrecision] = useState<
    number | { [assetId: string]: number }
  >(0);
  useEffect(() => {
    const precisionCall = async () => {
      setPrecision(await getPrecision(assetIds));
    };
    precisionCall();
  }, []);
  if (typeof precision === 'number') {
    return precision as number;
  } else {
    return precision as { [assetId: string]: number };
  }
}

export const useFetchPartialAsset = (): [
  IAsset[],
  (value: string) => Promise<IAsset[]>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [assetsSearch, setAssetsSearch] = useState<IAsset[]>(() => {
    try {
      const storedData = localStorage.getItem('allAssetsSearch');
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  let fetchPartialAssetTimeout: ReturnType<typeof setTimeout>;

  const initialState = async () => {
    const response = await api.get({
      route: `assets/kassets`,
      query: { limit: 10 },
    });
    setAssets([...response.data.assets, ...assetsSearch]);
  };

  useEffect(() => {
    try {
      localStorage.setItem('allAssetsSearch', JSON.stringify(assetsSearch));
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }, [assetsSearch]);
  const addAssetsLocalStorage = (response: IAsset[]) => {
    setAssetsSearch([...assetsSearch, ...response]);
  };
  useEffect(() => {
    initialState();
  }, []);
  return [
    assets,
    value => {
      clearTimeout(fetchPartialAssetTimeout);
      return new Promise(res => {
        fetchPartialAssetTimeout = setTimeout(async () => {
          let response: IAssetResponse;
          if (
            value &&
            !assets.find(asset => asset.assetId.includes(value.toUpperCase()))
          ) {
            response = await api.getCached({
              route: `assets/kassets?asset=${value}`,
            });
            if (!response.data.assets.length) {
              setAssets([...assets]);
            } else {
              res(response.data.assets);
              addAssetsLocalStorage(response.data.assets);
              setAssets([...assets, ...response.data.assets]);
            }
            res(response.data.assets);
            setLoading(false);
          } else {
            setLoading(false);
            res(assets);
          }
        }, 500);
      });
    },
    loading,
    setLoading,
  ];
};
