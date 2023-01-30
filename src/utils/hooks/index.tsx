/* eslint-disable @typescript-eslint/ban-types */
import api from '@/services/api';
import { IAsset, IAssetResponse } from '@/types';
import { useEffect, useRef, useState } from 'react';
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
] => {
  const [assets, setAssets] = useState<IAsset[]>([]);

  let fetchPartialAssetTimeout: ReturnType<typeof setTimeout>;

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
            res(response.data.assets);
            setAssets([...assets, ...response.data.assets]);
          } else {
            res(assets);
          }
        }, 500);
      });
    },
  ];
};
